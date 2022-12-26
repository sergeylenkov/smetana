import { Injectable } from '@angular/core';
import { SearchAPI } from '../api/search.api';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private api: SearchAPI) {
  }

  public async search(query: string) {
    const albums = this.api.searchAlbums({ q: query });
    const tracks = this.api.searchTracks({ q: query });

    const result = Promise.all([albums, tracks]);

    return result;
  }
}
