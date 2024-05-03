import { Injectable } from '@angular/core';
import { Post, Http, Body, HttpHeader, Header } from '@serglenkov/http-client';
import { environment } from '../../environments/environment';
import { StatisticsDto } from '../dto/statistics.dto';
import { FavoriteDto } from '../dto/favorite.dto';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
@Header(HttpHeader.ContentType, 'application/json')
export class StatisticsAPI {
  @Post('statistics')
  public async add(@Body() statistics: StatisticsDto): Promise<void> {    
  }
  @Post('statistics/favorite')
  public async setFavorite(@Body() favorite: FavoriteDto): Promise<void> {    
  }
}
