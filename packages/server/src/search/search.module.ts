import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from '../artists/artist.entity';
import { Track } from '../tracks/track.entity';
import { Album } from '../albums/album.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track, Artist])],
  exports: [SearchService],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
