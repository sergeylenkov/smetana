import { Injectable } from '@angular/core';
import { Get, Http, HttpResponseType, JSONObject, Cache, Param, Response } from '@serglenkov/http-client';
import { JsonSerializer } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { Album } from '../dto/album';
import { Artist } from '../dto/artist';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
export class ArtistsAPI {
  @Get('artists')
  @Cache(3600)
  public async getArtists(@Response(HttpResponseType.Json) response?: JSONObject): Promise<Artist[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Artist>(Artist, obj);
      })
    }

    return [];
  }

  @Get('artists/:id')
  @Cache(3600)
  public async getArtist(@Param('id') id: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Artist | undefined> {
    if (response) {
      return JsonSerializer.Deserialize<Artist>(Artist, response);
    }

    return undefined;
  }

  @Get('artists/:id/albums')
  @Cache(3600)
  public async getAlbums(@Param('id') id: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Album[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Album>(Album, obj);
      })
    }

    return [];
  }
}
