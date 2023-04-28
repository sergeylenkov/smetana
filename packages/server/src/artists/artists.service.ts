import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../albums/album.entity';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { ArtistDto } from './artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  public async findAll(): Promise<ArtistDto[]> {
    const results = await this.artistsRepository.find({
      relations: {
        albums: {
          covers: true,
        },
      },
    });

    return results.map((result) => {
      const dto: ArtistDto = {
        id: result.id,
        name: result.name,
      };

      let cover;

      if (result.albums.length > 0 && result.albums[0].covers.length > 0) {
        cover = result.albums[0].covers.find((c) => c.main);
      }

      if (cover) {
        dto.cover = cover.id;
      }

      return dto;
    });
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
