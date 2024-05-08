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
    const id = this.route.snapshot.params['id']; 
    this.isAlbumVisible = id != undefined;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = this.route.snapshot.params['id'];
        this.isAlbumVisible = id != undefined;
      }
    });
  }

  ngOnInit(): void {
  }
}
