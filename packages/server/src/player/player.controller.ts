import { Controller, Get, Param, Query } from '@nestjs/common';
import { TracksService } from 'src/tracks/tracks.service';
import { PlayerService } from '../player/player.service';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly playerService: PlayerService,
  ) {}

  @Get('track/:id/play')
  async play(@Param('id') id) {
    const track = await this.tracksService.findById(id);
    this.playerService.play(track);
  }

  @Get('volume')
  volume(@Query('value') value) {
    this.playerService.volume = value;
  }
}
