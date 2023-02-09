import { Injectable } from '@angular/core';
import { Get, Http, HttpResponseType, JSONObject, Response, Query } from '@serglenkov/http-client';
import { JsonSerializer } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { Album } from '../dto/album';
import { Artist } from '../dto/artist';
import { Track } from '../dto/track';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
export class SearchAPI {
  @Get('search/albums')
  public async searchAlbums(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Album[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Album>(Album, obj);
      })
    }

    return [];
  }

  @Get('search/tracks')
  public async searchTracks(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Track[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Track>(Track, obj);
      })
    }

    return [];
  }

  @Get('search/artists')
  public async searchArtists(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Artist[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Artist>(Artist, obj);
      })
    }

    return [];
  }
}
