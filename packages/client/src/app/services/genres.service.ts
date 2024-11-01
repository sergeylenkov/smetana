import { Injectable } from '@angular/core';
import { Genre } from '../dto/genre';
import { GenresAPI } from '../api/genres.api';
import { Track } from '../dto/track';
import { TracksAPI } from '../api/tracks.api';
import { Album } from '../dto/album';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor(private api: GenresAPI, private trackApi: TracksAPI) {}

  public async getGenres(): Promise<Genre[]> {
    return this.api.getGenres();
  }

  public async getTracks(id: number): Promise<Track[]> {
    return this.api.getTracks(id);
  }

  public async getTrackAlbums(id: number): Promise<Album[]> {
    return this.trackApi.getAlbums(id);
  }
}
