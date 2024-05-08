import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  public isAlbumVisible = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.checkAlbumVisibility();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkAlbumVisibility();
      }
    });
  }

  ngOnInit(): void {
  }

  private checkAlbumVisibility() {
    const id = this.route.snapshot.params['id']; 
    this.isAlbumVisible = id != undefined;
  }
}
