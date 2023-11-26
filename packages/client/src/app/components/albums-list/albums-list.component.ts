import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { SettingsService } from '../../services/settings.service';
import { CARD_MARGIN, DEFAULT_CARD_SIZE } from '../album-card/album-card.component';
import { IPageInfo, VirtualScrollerComponent } from '@iharbeck/ngx-virtual-scroller';
import { AlbumsRow } from './types';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
  providers:  [AlbumsService]
})
export class AlbumsListComponent implements OnInit, AfterViewInit {
  albums: Album[] = [];
  rows: AlbumsRow[] = [];
  cardSize: number = DEFAULT_CARD_SIZE;
  columnsCount: number =  0;

  @ViewChild('list') listElement?: ElementRef<HTMLDivElement>;
  @ViewChild('scroll') virtualScroll?: VirtualScrollerComponent;

  constructor(private service: AlbumsService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.getAlbums().then(() => {
      this.calculateColumns();
			this.calculateRows();
    })
  }

  ngAfterViewInit() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToPosition(this.settingsService.scrollPosition);
    }

		requestAnimationFrame(() => {
			this.calculateColumns();
			this.calculateRows();
		});    
  }

  public async getAlbums() {
    this.albums = await this.service.getAlbums();    
  }

  public onScroll(e: IPageInfo): void {
    this.settingsService.scrollPosition = e.scrollStartPosition;
  }

  public albumTrackBy(index: number, album: Album) {
    return album.id;
  }

  private calculateColumns() {
    if (this.listElement) {
        const width = this.listElement.nativeElement.getBoundingClientRect().width - 20;
        this.columnsCount = Math.floor(width / (DEFAULT_CARD_SIZE + CARD_MARGIN));
  
        const freeSpace = width - this.columnsCount * (DEFAULT_CARD_SIZE + CARD_MARGIN);
  
        if (freeSpace < 100) {
          this.columnsCount = this.columnsCount - 1;
        }
  
        this.cardSize = Math.floor(width / this.columnsCount) - CARD_MARGIN;
      }
  }

  private calculateRows() {
    this.rows = [];

    const rowsCount = Math.floor(this.albums.length / this.columnsCount);    

    for (let i = 0; i < rowsCount; i++) {
      const index = i * this.columnsCount;
      const row: AlbumsRow = {
        id: i,
        albums: this.albums.slice(index, index + this.columnsCount)
      }

      this.rows.push(row);
    }
  }
}
