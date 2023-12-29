import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { GenresModule } from './genres/genres.module';
import { CoversModule } from './cover/covers.module';
import { TracksModule } from './tracks/tracks.module';
import { PlayerModule } from './player/player.module';
import { SearchModule } from './search/search.module';
import { StatisticsModule } from './statistics/statistics.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    AlbumsModule,
    ArtistsModule,
    GenresModule,
    CoversModule,
    TracksModule,
    PlayerModule,
    SearchModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
