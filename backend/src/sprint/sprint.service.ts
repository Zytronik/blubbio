import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSprintRequestDto, CreateSprintResponseDto } from '@shared/types';
import { User } from 'src/user/entities/user.entity';
import { Sprint } from './entities/sprint.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SprintService {
    constructor(
        @InjectRepository(Sprint)
        private readonly sprintRepo: Repository<Sprint>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
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
}
