import { Injectable } from '@angular/core';
import { Album } from '../dto/album';
import { Track } from '../dto/track';
import { StatisticsAPI } from '../api/statistics.api';
import { Artist } from '../dto/artist';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private api: StatisticsAPI) {
  }

  public async add(track: Track, album: Album, artist: Artist): Promise<void> {    
    return this.api.add({ trackId: track.id, albumId: album.id, artistId: artist.id });
  }
}
