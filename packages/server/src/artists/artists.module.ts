import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Artist } from './artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  exports: [ArtistsService],
  providers: [ArtistsService],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
