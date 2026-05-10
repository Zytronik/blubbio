import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BlobModule } from 'src/blob/blob.module';
import { RankedModule } from 'src/ranked/ranked.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BlobModule, RankedModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
