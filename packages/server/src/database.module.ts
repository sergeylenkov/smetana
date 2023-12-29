import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './albums/album.entity';
import { Artist } from './artists/artist.entity';
import { Genre } from './genres/genre.entity';
import { Cover } from './cover/cover.entity';
import { Track } from './tracks/track.entity';
import { Statistics } from './statistics/statistics.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '..\\..\\library\\library.db',
      logging: false,
      entities: [Album, Artist, Genre, Cover, Track, Statistics],
    }),
  ],
})
export class DatabaseModule {}
