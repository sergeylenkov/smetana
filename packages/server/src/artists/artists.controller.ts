import { Controller, Get, Param } from '@nestjs/common';
import { Album } from '../albums/album.entity';
import { Artist } from './artist.entity';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  public getAll(): Promise<Artist[]> {
    return this.artistsService.findAll();
  }

  @Get(':id')
  public getById(@Param('id') id): Promise<Artist> {
    return this.artistsService.findById(id);
  }

  @Get(':id/albums')
  public getAlbums(@Param('id') id): Promise<Album[]> {
    return this.artistsService.getAlbums(id);
  }
}
