import { Controller, Get, Param } from '@nestjs/common';
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
  getById(@Param() params): Promise<Cover> {
    return this.coversService.findById(params.id);
  }
}
