import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './albums/album.entity';
import { Artist } from './artists/artist.entity';
import { Genre } from './genres/genre.entity';
import { Cover } from './cover/cover.entity';
import { Track } from './tracks/track.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '.\\test\\test.db',
      logging: false,
      entities: [Album, Artist, Genre, Cover, Track],
    }),
  ],
})
export class TestModule {}
