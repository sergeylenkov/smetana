import { Injectable } from '@angular/core';
import { Genre } from '../dto/genre';
import { GenresAPI } from '../api/genres.api';
import { Track } from '../dto/track';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor(private api: GenresAPI) {}

  public async getGenres(): Promise<Genre[]> {
    return this.api.getGenres();
  }

  public async getTracks(id: number): Promise<Track[]> {
    return this.api.getTracks(id);
  }
}
