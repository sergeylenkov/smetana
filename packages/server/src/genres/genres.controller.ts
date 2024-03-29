import { Controller, Get, Param } from '@nestjs/common';
import { Genre } from './genre.entity';
import { GenresService } from './genres.service';

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
}
