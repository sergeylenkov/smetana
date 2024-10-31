import { Injectable } from '@angular/core';
import { Track } from '../dto/track';
import { StatisticsAPI } from '../api/statistics.api';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private api: StatisticsAPI) {}

  public async add(track: Track): Promise<void> {
    return this.api.add({ trackId: track.id });
  }
}
