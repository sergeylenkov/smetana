import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../tracks/track.entity';
import { Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  public findAll(): Promise<Album[]> {
    return this.albumsRepository.find({
      relations: {
        artists: true,
        genres: true,
        covers: true,
      },
    });
  }

  public findById(id: number): Promise<Album> {
    return this.albumsRepository.findOne({
      where: { id: id },
      relations: {
        artists: true,
        genres: true,
        covers: true,
      },
    });
  }

  public async getTracks(id: number): Promise<Track[]> {
    const album = await this.albumsRepository.findOne({
      where: { id: id },
      relations: {
        tracks: true,
      },
    });

    return album.tracks;
  }
}
