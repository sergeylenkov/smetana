import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
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
    try {
      const cover = await this.coversService.findById(id);

      if (existsSync(cover.file)) {
        const file = createReadStream(cover.file);
        return new StreamableFile(file);
      } else {
        throw new HttpException('File not exists', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
