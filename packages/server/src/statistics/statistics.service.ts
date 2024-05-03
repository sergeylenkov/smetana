import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './statistics.entity';
import { Track } from '../tracks/track.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>
  ) {}

  async create(trackId: number) {
    const today = new Date();
    const track = await this.tracksRepository.findOneBy({ id: trackId });

    let statistics = await this.statisticsRepository.findOneBy({
      track: track,
    });

    if (statistics) {
      statistics.lastPlayedTime = today.toISOString();
      statistics.playsCount = statistics.playsCount + 1;
    } else {
      statistics = new Statistics();

      statistics.track = track;
      statistics.isFavorite = false;
      statistics.playsCount = 1;
      statistics.lastPlayedTime = today.toISOString();
    }

    this.statisticsRepository.save(statistics);
  }

  async setFavorite(trackId: number, favorite: boolean) {
    const track = await this.tracksRepository.findOneBy({ id: trackId });

    let statistics = await this.statisticsRepository.findOneBy({
      track: track,
    });

    if (statistics) {
      statistics.isFavorite = favorite;
      this.statisticsRepository.save(statistics);
    }
  }
}
