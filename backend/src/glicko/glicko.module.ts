import { Module } from '@nestjs/common';
import { GlickoService } from './glicko.service';
import { UserRating } from 'src/ranked/entities/user-rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [GlickoService],
  imports: [TypeOrmModule.forFeature([UserRating])],
})
export class GlickoModule {}
