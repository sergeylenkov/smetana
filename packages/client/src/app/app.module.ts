import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsListComponent } from './albums-list/albums-list.component';
import { AlbumItemComponent } from './album-item/album-item.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumsListComponent,
    AlbumItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
