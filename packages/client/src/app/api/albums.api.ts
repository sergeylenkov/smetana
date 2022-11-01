import { Injectable } from '@angular/core';
import { Get, Http, HttpResponseType, JSONObject, Cache, Param, Response } from '@serglenkov/http-client';
import { JsonSerializer } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { Album } from '../dto/album';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
export class AlbumsAPI {
  @Get('albums')
  @Cache(3600)
  public async getAlbums(@Response(HttpResponseType.Json) response?: JSONObject): Promise<Album[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        const album = JsonSerializer.Deserialize<Album>(Album, obj);
        album.updateCoverUrl();

        return album;
      })
    }

    return [];
  }

  @Get('albums/:id/tracks')
  @Cache(3600)
  public async getTracks(@Param('id') id: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Album | undefined> {
    if (response) {
      const album = JsonSerializer.Deserialize<Album>(Album, response);
      album.updateCoverUrl();

      return album;
    }

    return undefined;
  }
}
