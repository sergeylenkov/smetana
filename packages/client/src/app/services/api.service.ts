import { Injectable } from '@angular/core';
import { Get, Http, HttpResponseType, JSONObject, Param, Query, Response } from '@serglenkov/http-client';
import { JsonSerializer } from '@serglenkov/json-serializer';
import { environment } from '../../environments/environment';
import { Album } from '../dto/album';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
export class API {
  @Get('albums')
  public async getAlbums(@Response(HttpResponseType.Json) response?: JSONObject): Promise<Album[]> {
    if (Array.isArray(response)) {
      return response.map(obj => {
        return JsonSerializer.Deserialize<Album>(Album, obj);
      })
    }

    return [];
  }

  @Get('albums/:id/tracks')
  public async getTracks(@Param('id') id: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<Album | undefined> {
    if (response) {
      return JsonSerializer.Deserialize<Album>(Album, response);
    }

    return undefined;
  }

  @Get('player/track/:id/play')
  public async playTrack(@Param('id') id: number): Promise<number> {
    return id;
  }

  @Get('player/track/:id/stop')
  public async stopTrack(@Param('id') id: number): Promise<number> {
    return id;
  }

  @Get('player/track/:id/pause')
  public async pauseTrack(@Param('id') id: number): Promise<number> {
    return id;
  }

  @Get('player/volume')
  public async volume(@Query() query?: JSONObject | string): Promise<void> {
  }
}
