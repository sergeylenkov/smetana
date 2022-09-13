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
  getById(@Param() params): Promise<Album> {
    return this.albumsService.findById(params.id);
  }
}
