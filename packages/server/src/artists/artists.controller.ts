import { Controller, Get, Param } from '@nestjs/common';
import { Artist } from './artist.entity';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  getAll(): Promise<Artist[]> {
    return this.artistsService.findAll();
  }

  @Get(':id')
  getById(@Param() params): Promise<Artist> {
    return this.artistsService.findById(params.id);
  }
}
