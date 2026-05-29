import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRating } from 'src/ranked/entities/user-rating.entity';
import { Repository } from 'typeorm';
import { GlickoRatings } from '@shared/types';
import * as Glicko2Lib from 'glicko2';
import { Glicko2Constructor } from '@shared/types';

const Glicko2 = Glicko2Lib.Glicko2 as unknown as Glicko2Constructor;

@Injectable()
export class GlickoService {
  constructor(
    @InjectRepository(UserRating)
    private readonly userRatingRepository: Repository<UserRating>,
  ) {}

  private readonly glicko = new Glicko2({
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
    winnerID: string,
    loserID: string,
  ): Promise<{ gainedElo: number; lostElo: number }> {
    const winner = await this.getGlickoRatingsByUserId(winnerID);
    const loser = await this.getGlickoRatingsByUserId(loserID);

    const gWinner = this.glicko.makePlayer(
      winner.rating,
      winner.ratingDeviation,
      winner.volatility,
    );

    const gLoser = this.glicko.makePlayer(
      loser.rating,
      loser.ratingDeviation,
      loser.volatility,
    );

    const oldWinner = gWinner.getRating();
    const oldLoser = gLoser.getRating();

    this.glicko.updateRatings([[gWinner, gLoser, 1]]);

    const newWinner = gWinner.getRating();
    const newLoser = gLoser.getRating();

    const winnerRatings: GlickoRatings = {
      rating: newWinner,
      ratingDeviation: gWinner.getRd(),
      volatility: gWinner.getVol(),
    };

    const loserRatings: GlickoRatings = {
      rating: newLoser,
      ratingDeviation: gLoser.getRd(),
      volatility: gLoser.getVol(),
    };

    await this.updateGlickoRating(
      winnerID,
      winnerRatings,
      loserID,
      loserRatings,
    );

    return {
      gainedElo: Math.floor(newWinner) - Math.floor(oldWinner),
      lostElo: Math.floor(oldLoser) - Math.floor(newLoser),
    };
  }

  async predictWinrate(player1ID: string, player2ID: string): Promise<number> {
    const p1 = await this.getGlickoRatingsByUserId(player1ID);
    const p2 = await this.getGlickoRatingsByUserId(player2ID);

    const g1 = this.glicko.makePlayer(
      p1.rating,
      p1.ratingDeviation,
      p1.volatility,
    );

    const g2 = this.glicko.makePlayer(
      p2.rating,
      p2.ratingDeviation,
      p2.volatility,
    );

    return this.glicko.predict(g1, g2) * 100;
  }

  async getGlickoRatingsByUserId(userId: string): Promise<GlickoRatings> {
    const rating = await this.userRatingRepository.findOne({
      where: {
        user: { uid: userId },
      },
      relations: ['user'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating not found for user ${userId}`);
    }

    return {
      rating: rating.rating,
      ratingDeviation: rating.ratingDeviation,
      volatility: rating.volatility,
    };
  }

  async updateGlickoRating(
    winnerId: string,
    winnerRatings: GlickoRatings,
    loserId: string,
    loserRatings: GlickoRatings,
  ): Promise<void> {
    const winner = await this.userRatingRepository.findOne({
      where: { user: { uid: winnerId } },
      relations: ['user'],
    });

    const loser = await this.userRatingRepository.findOne({
      where: { user: { uid: loserId } },
      relations: ['user'],
    });

    if (!winner || !loser) {
      throw new NotFoundException('One or both ratings not found');
    }

    winner.rating = winnerRatings.rating;
    winner.ratingDeviation = winnerRatings.ratingDeviation;
    winner.volatility = winnerRatings.volatility;

    loser.rating = loserRatings.rating;
    loser.ratingDeviation = loserRatings.ratingDeviation;
    loser.volatility = loserRatings.volatility;

    await this.userRatingRepository.save([winner, loser]);
  }
}
