import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
  providers:  [ AlbumsService ]
})
export class AlbumsListComponent implements OnInit, AfterViewInit {
  albums: Album[] = [];
  cardSize: number = 250;
  @ViewChild('list') listElement?: ElementRef<HTMLDivElement>;

  constructor(private service: AlbumsService) { }

  ngOnInit(): void {
    this.getAlbums();
  }

  ngAfterViewInit() {
    if (this.listElement) {
      const width = this.listElement.nativeElement.getBoundingClientRect().width;
      let maxCount = Math.floor(width / 250);

      const freeSpace = width - maxCount * 250;

      if (freeSpace < 100) {
        maxCount = maxCount - 1;
      }

      this.cardSize = Math.floor(width / maxCount);
    }
  }

  async getAlbums() {
    this.albums = await this.service.getAlbums();
  }
}
