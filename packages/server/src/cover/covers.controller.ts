import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { Cover } from './cover.entity';
import { CoversService } from './covers.service';

@Controller('covers')
export class CoversController {
  constructor(private readonly coversService: CoversService) {}

  @Get()
  getAll(): Promise<Cover[]> {
    return this.coversService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id): Promise<Cover> {
    return this.coversService.findById(id);
  }

  @Get(':id/file')
  async getFile(@Param('id') id): Promise<StreamableFile> {
    const cover = await this.coversService.findById(id);

    const file = createReadStream(cover.file);
    return new StreamableFile(file);
  }
}
