import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  findAll(): Promise<Album[]> {
    return this.albumsRepository.find({
      relations: {
        artists: true,
      },
    });
  }

  findById(id: number): Promise<Album> {
    return this.albumsRepository.findOneBy({ id });
  }
}
