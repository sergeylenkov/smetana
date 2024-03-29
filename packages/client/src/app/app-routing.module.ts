import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumDetailsComponent } from './components/album-details/album-details.component';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { ArtistDetailsComponent } from './components/artist-details/artist-details.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/albums'
  },
  { path: 'albums', component: AlbumsListComponent },
  { path: 'album/:id', component: AlbumDetailsComponent },
  { path: 'artists', component: ArtistsListComponent },
  { path: 'artist/:id', component: ArtistDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
