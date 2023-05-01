import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Statistics } from './statistics.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { Artist } from '../artists/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistics, Album, Track, Artist])],
  exports: [StatisticsService],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
