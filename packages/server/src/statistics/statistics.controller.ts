import { Body, Controller, Post } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsDto } from './statistics.dto';
import { FavoriteDto } from './favorite.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post()
  create(@Body() statistics: StatisticsDto): Promise<void> {
    return this.statisticsService.create(statistics.trackId);
  }

  @Post('favorite')
  favorite(@Body() favorite: FavoriteDto): Promise<void> {
    return this.statisticsService.setFavorite(
      favorite.trackId,
      favorite.favorite,
    );
  }
}
