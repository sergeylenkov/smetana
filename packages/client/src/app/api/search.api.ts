import { Injectable } from '@angular/core';
import { Get, Http, HttpResponseType, JSONObject, Response, Query } from '@serglenkov/http-client';
import { JsonSerializer } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { SearchAlbum } from '../dto/search-album';
import { SearchArtist } from '../dto/search-artist';
import { SearchTrack } from '../dto/search-track';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
export class SearchAPI {
  @Get('search/albums')
  public async searchAlbums(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<SearchAlbum[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<SearchAlbum>(SearchAlbum, obj);
      })
    }

    return [];
  }

  @Get('search/tracks')
  public async searchTracks(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<SearchTrack[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<SearchTrack>(SearchTrack, obj);
      })
    }

    return [];
  }

  @Get('search/artists')
  public async searchArtists(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<SearchArtist[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<SearchArtist>(SearchArtist, obj);
      })
    }

    return [];
  }
}
