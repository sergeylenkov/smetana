import { Injectable } from '@angular/core';
import {
  Get,
  Http,
  HttpResponseType,
  JSONObject,
  Cache,
  Response,
  Param,
} from '@serglenkov/http-client';
import { JsonSerializer } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { Genre } from '../dto/genre';
import { Track } from '../dto/track';

@Injectable({
  providedIn: 'root',
})
@Http(environment.apiUrl)
export class GenresAPI {
  @Get('genres')
  @Cache(3600)
  public async getGenres(
    @Response(HttpResponseType.Json) response?: JSONObject
  ): Promise<Genre[]> {
    if (Array.isArray(response)) {
      return response.map((obj) => {
        return JsonSerializer.Deserialize<Genre>(Genre, obj);
      });
    }

    return [];
  }

  @Get('genres/:id/tracks')
  @Cache(3600)
  public async getTracks(@Param('id') id: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Track[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Track>(Track, obj);
      })
    }

    return [];
  }
}
