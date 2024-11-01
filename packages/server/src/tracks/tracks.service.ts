import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { Album } from '../albums/album.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  public findAll(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  public findById(id: number): Promise<Track> {
    return this.tracksRepository.findOneBy({ id });
  }

  public async getAlbums(id: number): Promise<Album[]> {
    const result = await this.tracksRepository.findOne({
      where: { id: id },
      relations: {
        albums: {
          covers: true,
          artists: true,
        },
      },
    });

    return result.albums;
  }
}
