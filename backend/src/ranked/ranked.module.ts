import { Module } from '@nestjs/common';
import { RankedService } from './ranked.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRating } from 'src/ranked/entities/user-rating.entity';

@Module({
  providers: [RankedService],
  imports: [TypeOrmModule.forFeature([UserRating])],
  exports: [RankedService],
})
export class RankedModule {}
