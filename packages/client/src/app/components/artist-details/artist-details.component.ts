import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Album } from 'src/app/dto/album';
import { Artist } from '../../dto/artist';
import { ArtistsService } from '../../services/artists.service';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss'],
})
export class ArtistDetailsComponent implements OnInit {
  public artist?: Artist;
  public albums: Album[] = [];

  constructor(private service: ArtistsService, private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = this.route.snapshot.params['id'];
        this.loadArtist(id);
      }
    });
  }

  ngOnInit(): void {
  }

  private async loadArtist(id: number) {
    this.artist = await this.service.getArtist(id);
    const albums = await this.service.getAlbums(id);

    this.albums = albums.sort((a, b) => {
      return a.year - b.year;
    })
  }
}
