import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSprintRequestDto, CreateSprintResponseDto, GetLeaderboardResponseDto } from '@shared/types';
import { User } from 'src/user/entities/user.entity';
import { Sprint } from './entities/sprint.entity';
import { Repository } from 'typeorm';
import { SprintPersonalBest } from './entities/sprint-personal-best.entity';

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(Sprint)
        private readonly sprintRepo: Repository<Sprint>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(SprintPersonalBest)
        private readonly personalBestRepo: Repository<SprintPersonalBest>,
    ) { }

    async createSprint(
        userId: string,
        dto: CreateSprintRequestDto,
    ): Promise<CreateSprintResponseDto> {
        const user = await this.userRepo.findOne({
            where: { uid: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const sprint = this.sprintRepo.create({
            user: { uid: user.uid } as User,
            gameStartTime: dto.gameStartTime,
            gameEndTime: dto.gameEndTime,
            gameDuration: dto.gameDuration,
            bubblesShot: dto.bubblesShot,
            bubblesPerSecond: dto.bubblesPerSecond,
            bubblesClearToWin: dto.bubblesClearToWin,
            bubblesCleared: dto.bubblesCleared,
        });

        const saved = await this.sprintRepo.save(sprint);

        await this.updatePersonalBest(userId, saved);

        return {
            uid: saved.uid,
            userId: saved.user.uid,
            gameStartTime: saved.gameStartTime,
            gameEndTime: saved.gameEndTime,
            gameDuration: saved.gameDuration,
            bubblesShot: saved.bubblesShot,
            bubblesPerSecond: saved.bubblesPerSecond,
            bubblesClearToWin: saved.bubblesClearToWin,
            bubblesCleared: saved.bubblesCleared,
            createdAt: saved.createdAt,
        };
    }

    private async updatePersonalBest(userId: string, sprint: Sprint) {
        const existing = await this.personalBestRepo.findOne({
            where: { userId },
        });

        if (!existing || sprint.gameDuration < existing.bestGameDuration) {
            await this.personalBestRepo.save({
                userId,
                bestGameDuration: sprint.gameDuration,
                bubblesPerSecond: sprint.bubblesPerSecond,
            });
        }
    }

    async getGlobalLeaderboard(limit = 10): Promise<GetLeaderboardResponseDto> {
        const rows = await this.personalBestRepo
            .createQueryBuilder('pb')
            .innerJoinAndSelect('pb.user', 'user')
            .orderBy('pb.bestGameDuration', 'ASC')
            .limit(limit)
            .getMany();

        return {
            entries: this.map(rows),
        };
    }

    async getCountryLeaderboard(
        countryCode: string,
        limit = 10,
    ): Promise<GetLeaderboardResponseDto> {
        const rows = await this.personalBestRepo
            .createQueryBuilder('pb')
            .innerJoinAndSelect('pb.user', 'user')
            .where('user.countryCode = :countryCode', { countryCode })
            .orderBy('pb.bestGameDuration', 'ASC')
            .limit(limit)
            .getMany();

        return {
            entries: this.map(rows),
        };
    }

    private map(rows: SprintPersonalBest[]) {
        return rows.map((r, i) => ({
            rank: i + 1,
            username: r.user.username,
            bubblesPerSecond: r.bubblesPerSecond,
            gameDuration: r.bestGameDuration,
            profilePicture: r.user.pbUrl || '',
            userId: r.user.uid,
        }));
    }
}
