import { Controller, Get, Param } from '@nestjs/common';
import { Genre } from './genre.entity';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getAll(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  getById(@Param() params): Promise<Genre> {
    return this.genresService.findById(params.id);
  }
}
