import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { AlbumCardComponent } from './components/album-card/album-card.component';
import { AlbumDetailsComponent } from './components/album-details/album-details.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { TimeComponent } from './components/time/time.component';
import { PlayerInfoComponent } from './components/player-info/player-info.component';
import { Player } from './player/player';
import { PlayerFactory } from './player/player.factory';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { VolumeComponent } from './components/volume/volume.component';
import { SearchComponent } from './components/search/search.component';
import { SearchAlbumComponent } from './components/search-album/search-album.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FormsModule } from '@angular/forms';
import { SearchArtistComponent } from './components/search-artist/search-artist.component';
import { SearchTrackComponent } from './components/search-track/search-track.component';
import { ArtistDetailsComponent } from './components/artist-details/artist-details.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { ArtistCardComponent } from './components/artist-card/artist-card.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumsListComponent,
    AlbumCardComponent,
    AlbumDetailsComponent,
    NavigationComponent,
    TimeComponent,
    PlayerInfoComponent,
    PlayerControlsComponent,
    PlayButtonComponent,
    VolumeComponent,
    SearchComponent,
    SearchAlbumComponent,
    SearchArtistComponent,
    SearchTrackComponent,
    ArtistsListComponent,
    ArtistCardComponent,
    ArtistDetailsComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    FormsModule
  ],
  providers: [{ provide: Player, useExisting: PlayerFactory.createPlayer() }],
  bootstrap: [AppComponent]
})
export class AppModule { }
