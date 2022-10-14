import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoversService } from './covers.service';
import { CoversController } from './covers.controller';
import { Cover } from './cover.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cover])],
  exports: [CoversService],
  providers: [CoversService],
  controllers: [CoversController],
})
export class CoversModule {}
