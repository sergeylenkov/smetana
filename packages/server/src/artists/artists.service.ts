import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../albums/album.entity';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  public findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  public findById(id: number): Promise<Artist> {
    return this.artistsRepository.findOneBy({ id });
  }

  public async getAlbums(id: number): Promise<Album[]> {
    const album = await this.artistsRepository.findOne({
      where: { id: id },
      relations: {
        albums: {
          covers: true,
        },
      },
    });

    return album.albums;
  }
}
