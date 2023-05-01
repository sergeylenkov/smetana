import { Injectable } from '@angular/core';
import { Post, Http, Body, HttpHeader, Header } from '@serglenkov/http-client';
import { environment } from '../../environments/environment';
import { StatisticsDto } from '../dto/statistics.dto';

@Injectable({
  providedIn: 'root',
 })
@Http(environment.apiUrl)
@Header(HttpHeader.ContentType, 'application/json')
export class StatisticsAPI {
  @Post('statistics')
  public async add(@Body() statistics: StatisticsDto): Promise<void> {    
  }
}
