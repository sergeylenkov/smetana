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
    console.log('play', track);
    this.playerService.play(track);

    if (track.isMultitrack) {
      this.playerService.seek(track.start);
    }
  }

  @Get('track/:id/pause')
  async pause(@Param('id') id) {
    this.playerService.pause();
  }

  @Get('track/:id/resume')
  async resume(@Param('id') id) {
    this.playerService.resume();
  }

  @Get('volume')
  volume(@Query('value') value) {
    this.playerService.volume = value;
  }

  @Get('seek')
  seek(@Query('value') value) {
    this.playerService.seek(value);
  }
}
