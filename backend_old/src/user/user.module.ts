import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileStorageService } from './file-storage.service';
import { RankedModule } from 'src/ranked/ranked.module';

@Module({
  imports: [forwardRef(() => RankedModule)],
  providers: [UserService, PrismaService, FileStorageService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
