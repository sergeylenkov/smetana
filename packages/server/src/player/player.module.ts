import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../tracks/track.entity';
import { TracksService } from '../tracks/tracks.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [PlayerController],
  providers: [TracksService, PlayerService],
})
export class PlayerModule {}
