import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistDetailsComponent } from './components/artist-details/artist-details.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { GenresComponent } from './components/genres/genres.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/albums',
  },
  { path: 'albums', component: AlbumsComponent },
  { path: 'album/:id', component: AlbumsComponent },
  { path: 'artists', component: ArtistsListComponent },
  { path: 'artist/:id', component: ArtistDetailsComponent },
  { path: 'genres', component: GenresComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
