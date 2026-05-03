import { Injectable } from '@nestjs/common';
import { Ratings } from 'src/_interface/ranked.rank';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GlickoService {
  constructor(private userService: UserService) {}

  private glicko2 = require('glicko2');
  public glicko = new this.glicko2.Glicko2({
    // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
    //      be tested to decide which value results in greatest predictive accuracy."
    tau: 0.5,
    // rating : default rating
    rating: 1500,
    //rd : Default rating deviation
    //     small number = good confidence on the rating accuracy
    rd: 350,
    //vol : Default volatility (expected fluctation on the player rating)
    vol: 0.06,
  });

  async updateRatings(
    winnerID: number,
    loserID: number,
  ): Promise<{ gainedElo: number; lostElo: number }> {
    const winner = await this.userService.getGlickoRatingsByUserId(winnerID);
    const loser = await this.userService.getGlickoRatingsByUserId(loserID);
    const glickoWinner = this.glicko.makePlayer(
      winner.rating,
      winner.ratingDeviation,
      winner.volatility,
    );
    const glickoLoser = this.glicko.makePlayer(
      loser.rating,
      loser.ratingDeviation,
      loser.volatility,
    );
    const oldWinnerRating = glickoWinner.getRating();
    const oldLoserRating = glickoLoser.getRating();
    this.glicko.updateRatings([[glickoWinner, glickoLoser, 1]]);
    const newWinnerRating = glickoWinner.getRating();
    const newLoserRating = glickoLoser.getRating();
    const winnerRatings: Ratings = {
      rating: newWinnerRating,
      ratingDeviation: glickoWinner.getRd(),
      volatility: glickoWinner.getVol(),
    };
    const loserRatings: Ratings = {
      rating: glickoLoser.getRating(),
      ratingDeviation: glickoLoser.getRd(),
      volatility: glickoLoser.getVol(),
    };
    const gainedElo = Math.floor(newWinnerRating) - Math.floor(oldWinnerRating);
    const lostElo = Math.floor(oldLoserRating) - Math.floor(newLoserRating);
    await this.userService.updateGlickoRating(
      winnerID,
      winnerRatings,
      loserID,
      loserRatings,
    );
    return { gainedElo, lostElo };
  }

  async predictWinrate(player1ID: number, player2ID: number): Promise<number> {
    const player1 = await this.userService.getGlickoRatingsByUserId(player1ID);
    const player2 = await this.userService.getGlickoRatingsByUserId(player2ID);
    const glickoPlayer1 = this.glicko.makePlayer(
      player1.rating,
      player1.ratingDeviation,
      player1.volatility,
    );
    const glickoPlayer2 = this.glicko.makePlayer(
      player2.rating,
      player2.ratingDeviation,
      player2.volatility,
    );
    return (await this.glicko.predict(glickoPlayer1, glickoPlayer2)) * 100;
  }
}
