import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from './statistics.entity';
import { Track } from '../tracks/track.entity';
import { Album } from '../albums/album.entity';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async create(trackId: number, albumId: number, artistId: number) {
    const today = new Date();
    const track = await this.tracksRepository.findOneBy({ id: trackId });
    const album = await this.albumsRepository.findOneBy({ id: albumId });
    const artist = await this.artistsRepository.findOneBy({ id: artistId });

    let statistics = await this.statisticsRepository.findOneBy({
      track: track,
    });

    if (statistics) {
      statistics.lastPlayedTime = today.toISOString();
      statistics.playsCount = statistics.playsCount + 1;
    } else {
      statistics = new Statistics();

      statistics.track = track;
      statistics.album = album;
      statistics.artist = artist;
      statistics.isFavorite = false;
      statistics.playsCount = 1;
      statistics.lastPlayedTime = today.toISOString();
    }

    this.statisticsRepository.save(statistics);
  }
}
