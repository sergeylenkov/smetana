import { Injectable } from '@angular/core';
import { SearchAPI } from '../api/search.api';
import { Album } from '../dto/album';
import { Track } from '../dto/track';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private api: SearchAPI) {
  }

  public async search(query: string): Promise<Array<Album | Track>> {
    const albums = this.api.searchAlbums({ q: query });
    const tracks = this.api.searchTracks({ q: query });

    return Promise.all([albums, tracks]).then(data => data.flat());
  }
}
