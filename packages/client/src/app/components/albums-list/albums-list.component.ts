import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { SettingsService } from '../../services/settings.service';
import { DEFAULT_CARD_SIZE } from '../album-card/album-card.component';

type AlbumsRow = {
  id: number;
  albums: Album[];
}

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
  providers:  [ AlbumsService ]
})
export class AlbumsListComponent implements OnInit, AfterViewInit, AfterViewChecked {
  albums: Album[] = [];
  rows: AlbumsRow[] = [];
  cardSize: number = DEFAULT_CARD_SIZE;
  columnsCount: number =  0;

  @ViewChild('list') listElement?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;

  constructor(private service: AlbumsService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.getAlbums();
  }

  ngAfterViewInit() {
    if (this.listElement) {
      const width = this.listElement.nativeElement.getBoundingClientRect().width;
      this.columnsCount = Math.floor(width / DEFAULT_CARD_SIZE);
      console.log(width, this.columnsCount);
      const freeSpace = width - this.columnsCount * DEFAULT_CARD_SIZE;

      if (freeSpace < 100) {
        this.columnsCount = this.columnsCount - 1;
      }

      this.cardSize = Math.floor(width / this.columnsCount);
    }
  }

  ngAfterViewChecked() {
    requestAnimationFrame(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTo(0, this.settingsService.scrollPosition);
      }
    });
  }

  public async getAlbums() {
    this.albums = await this.service.getAlbums();
    this.rows = [];
    
    const rowsCount = Math.floor(this.albums.length / this.columnsCount);    
    console.log(this.cardSize, this.columnsCount, rowsCount);
    for (let i = 0; i < rowsCount; i++) {
      const index = i * this.columnsCount;
      const row: AlbumsRow = {
        id: i,
        albums: this.albums.slice(index, index + this.columnsCount)
      }

      this.rows.push(row);
    }
  }

  public onScroll(e: Event): void {
    this.settingsService.scrollPosition = (e.target as HTMLDivElement)?.scrollTop || 0;
  }

  public albumTrackBy(index: number, album: Album) {
    return album.id;
  }
}
