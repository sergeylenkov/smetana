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
import { PlayerComponent } from './components/player/player.component';
import { ApiPlayer } from './player/api.player';
import { Player } from './player/player';
import { WebPlayer } from './player/web.player';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AlbumsListComponent,
    AlbumCardComponent,
    AlbumDetailsComponent,
    NavigationComponent,
    TimeComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [{ provide: Player, useExisting: environment.useWebPlayer ? WebPlayer : ApiPlayer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
