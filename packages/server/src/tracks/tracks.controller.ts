import { Controller, Get, Param } from '@nestjs/common';
import { Track } from './track.entity';
import { TracksService } from './tracks.service';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  getAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id): Promise<Track> {
    return this.tracksService.findById(id);
  }
}
