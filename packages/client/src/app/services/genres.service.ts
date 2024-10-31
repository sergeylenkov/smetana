import { Injectable } from '@angular/core';
import { Genre } from '../dto/genre';
import { GenresAPI } from '../api/genres.api';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor(private api: GenresAPI) {}

  public async getGenres(): Promise<Genre[]> {
    return this.api.getGenres();
  }
}
