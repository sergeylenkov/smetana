import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Album } from './albums/album.entity';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { Artist } from './artists/artist.entity';
import { Genre } from './genres/genre.entity';
import { GenresModule } from './genres/genres.module';
import { Cover } from './cover/cover.entity';
import { CoversModule } from './cover/covers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '..\\..\\library.db',
      logging: true,
      entities: [Album, Artist, Genre, Cover],
    }),
    AlbumsModule,
    ArtistsModule,
    GenresModule,
    CoversModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
