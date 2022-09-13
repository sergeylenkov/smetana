import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  findById(id: number): Promise<Artist> {
    return this.artistsRepository.findOneBy({ id });
  }
}
