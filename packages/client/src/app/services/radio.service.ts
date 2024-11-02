import { Injectable } from '@angular/core';
import { Track } from '../dto/track';
import { TracksAPI } from '../api/tracks.api';
import { Album } from '../dto/album';

@Injectable({
  providedIn: 'root',
})
export class RadioService {
  constructor(private api: TracksAPI) {}

  public async getTracks(): Promise<Track[]> {
    return this.api.getTracks();
  }

  public async getTrackAlbums(id: number): Promise<Album[]> {
    return this.api.getAlbums(id);
  }
}
