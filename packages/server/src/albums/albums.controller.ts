import { Controller, Get, Param } from '@nestjs/common';
import { Track } from 'src/tracks/track.entity';
import { Album } from './album.entity';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  public getAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  public getById(@Param('id') id): Promise<Album> {
    return this.albumsService.findById(id);
  }

  @Get(':id/tracks')
  public getTracks(@Param('id') id): Promise<Track[]> {
    return this.albumsService.getTracks(id);
  }
}
