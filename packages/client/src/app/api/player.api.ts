import { Injectable } from '@angular/core';
import { Get, Http, JSONObject, Param, Query } from '@serglenkov/http-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
export class PlayerAPI {
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

  @Get('player/track/:id/resume')
  public async resumeTrack(@Param('id') id: number): Promise<number> {
    return id;
  }

  @Get('player/volume')
  public async volume(@Query() query?: JSONObject | string): Promise<void> {
  }

  @Get('player/seek')
  public async seek(@Query() query?: JSONObject | string): Promise<void> {
  }

  @Get('player/forceStop')
  public async forceStop(): Promise<void> {
  }
}
