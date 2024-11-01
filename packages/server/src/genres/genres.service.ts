import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { Track } from '../tracks/track.entity';

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

  public async getTracks(id: number): Promise<Track[]> {
    const genre = await this.genresRepository.findOne({
      where: { id: id },
      relations: {
        tracks: true,
      },
    });

    return genre.tracks;
  }
}
