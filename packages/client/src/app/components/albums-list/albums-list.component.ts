import { Component, Input, OnInit } from '@angular/core';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
  providers:  [ AlbumsService ]
})
export class AlbumsListComponent implements OnInit {
  albums: Album[] = [];

  constructor(private service: AlbumsService) { }

  ngOnInit(): void {
    this.getAlbums();
  }

  async getAlbums() {
    this.albums = await this.service.getAlbums();
  }
}
