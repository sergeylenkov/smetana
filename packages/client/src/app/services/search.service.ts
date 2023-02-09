import { Injectable } from '@angular/core';
import { SearchAPI } from '../api/search.api';
import { Album } from '../dto/album';
import { Artist } from '../dto/artist';
import { Track } from '../dto/track';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private api: SearchAPI) {
  }

  public async search(query: string): Promise<Array<Album | Track | Artist>> {
    const albums = this.api.searchAlbums({ q: query });
    const tracks = this.api.searchTracks({ q: query });
    const artists = this.api.searchArtists({ q: query });

    return Promise.all([albums, tracks, artists]).then(data => data.flat());
  }
}
