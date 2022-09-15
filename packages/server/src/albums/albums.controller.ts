import { Controller, Get, Param } from '@nestjs/common';
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id): Promise<Album> {
    return this.albumsService.findById(id);
  }

  @Get(':id/tracks')
  getTracks(@Param('id') id): Promise<Album> {
    return this.albumsService.getTracks(id);
  }
}
