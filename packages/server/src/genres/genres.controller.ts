import { Controller, Get, Param } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from './genre.entity';
import { Track } from '../tracks/track.entity';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  public getAll(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  public getById(@Param('id') id): Promise<Genre> {
    return this.genresService.findById(id);
  }

  @Get(':id/tracks')
  public getTracks(@Param('id') id): Promise<Track[]> {
    return this.genresService.getTracks(id);
  }
}
