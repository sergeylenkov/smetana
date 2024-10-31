import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  public findAll(): Promise<Genre[]> {
    return this.genresRepository
      .createQueryBuilder('genres')
      .leftJoin('genres.tracks', 'tracks')
      .loadRelationCountAndMap('genres.tracksCount', 'genres.tracks')
      .groupBy('genres.id')
      .addGroupBy('genres.name')
      .getMany();
  }

  public findById(id: number): Promise<Genre> {
    return this.genresRepository.findOneBy({ id });
  }
}
