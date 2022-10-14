import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { Track } from './track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  exports: [TracksService],
  providers: [TracksService],
  controllers: [TracksController],
})
export class TracksModule {}
