import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { User } from 'src/user/entities/user.entity';
import { Sprint } from './entities/sprint.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintPersonalBest } from './entities/sprint-personal-best.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, User, SprintPersonalBest])],
  controllers: [SprintController],
  providers: [SprintService]
})
export class SprintModule { }
