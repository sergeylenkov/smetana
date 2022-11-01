import { Injectable } from '@angular/core';
import { Album } from '../dto/album';
import { AlbumsAPI } from '../api/albums.api';

@Injectable({
  providedIn: 'root',
 })
export class AlbumsService {
  constructor(private api: AlbumsAPI) {}

  public async getAlbums(): Promise<Album[]> {
    return this.api.getAlbums();
  }

  public async getTracks(id: number): Promise<Album | undefined> {
    return this.api.getTracks(id);
  }
}
