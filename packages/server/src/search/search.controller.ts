import { Controller, Get, Query } from '@nestjs/common';
import { Artist } from 'src/artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { SearchService } from './serach.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('albums')
  async searchAlbums(@Query('q') query): Promise<Album[]> {
    return this.searchService.searchAlbums(query);
  }

  @Get('tracks')
  async searchTracks(@Query('q') query): Promise<Track[]> {
    return await this.searchService.searchTracks(query);
  }

  @Get('artists')
  async searchArtists(@Query('q') query): Promise<Artist[]> {
    return await this.searchService.searchArtists(query);
  }
}
