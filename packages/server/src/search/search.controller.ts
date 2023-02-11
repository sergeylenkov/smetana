import { Controller, Get, Query } from '@nestjs/common';
import { SearchAlbumDto } from './search-album.dto';
import { SearchArtistDto } from './search-artist.dto';
import { SearchTrackDto } from './search-track.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('albums')
  async searchAlbums(@Query('q') query): Promise<SearchAlbumDto[]> {
    return this.searchService.searchAlbums(query);
  }

  @Get('tracks')
  async searchTracks(@Query('q') query): Promise<SearchTrackDto[]> {
    return await this.searchService.searchTracks(query);
  }

  @Get('artists')
  async searchArtists(@Query('q') query): Promise<SearchArtistDto[]> {
    return await this.searchService.searchArtists(query);
  }
}
