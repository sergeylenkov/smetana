import { Injectable } from '@angular/core';
import { API } from './api.service';
import { Album } from './dto/album';

@Injectable({
  providedIn: 'root',
 })
export class AlbumsService {
  constructor(private api: API) {}

  public async getAlbums(): Promise<Album[]> {
    return this.api.getAlbums();
  }

  public async getTracks(id: number): Promise<Album | undefined> {
    return this.api.getTracks(id);
  }
}
