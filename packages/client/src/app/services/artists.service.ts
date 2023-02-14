import { Injectable } from '@angular/core';
import { ArtistsAPI } from '../api/artists.api';
import { Album } from '../dto/album';
import { Artist } from '../dto/artist';

@Injectable({
  providedIn: 'root',
 })
export class ArtistsService {
  constructor(private api: ArtistsAPI) {}

  public async getArtists(): Promise<Artist[]> {
    return this.api.getArtists();
  }

  public async getArtist(id: number): Promise<Artist | undefined> {
    return this.api.getArtist(id);
  }

  public async getAlbums(id: number): Promise<Album[]> {
    return this.api.getAlbums(id);
  }
}
