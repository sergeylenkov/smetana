import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
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

  @Get(':id/file')
  async getFile(@Param('id') id): Promise<StreamableFile> {
    const track = await this.tracksService.findById(id);

    const file = createReadStream(join(track.path, track.fileName));
    return new StreamableFile(file);
  }
}
