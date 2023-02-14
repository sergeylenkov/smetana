import { Injectable } from '@angular/core';
import { Album } from '../dto/album';
import { AlbumsAPI } from '../api/albums.api';
import { Track } from '../dto/track';

@Injectable({
  providedIn: 'root',
 })
export class AlbumsService {
  constructor(private api: AlbumsAPI) {}

  public async getAlbums(): Promise<Album[]> {
    return this.api.getAlbums();
  }

  public async getAlbum(id: number): Promise<Album | undefined> {
    return this.api.getAlbum(id);
  }

  public async getTracks(id: number): Promise<Track[]> {
    return this.api.getTracks(id);
  }
}
