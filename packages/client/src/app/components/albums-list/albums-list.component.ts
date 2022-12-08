import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { AlbumsService } from '../../services/albums.service';
import { Album } from '../../dto/album';
import { SettingsService } from 'src/app/services/settings.service';

const DEFAULT_CARD_SIZE = 200;

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
  providers:  [ AlbumsService ]
})
export class AlbumsListComponent implements OnInit, AfterViewInit {
  albums: Album[] = [];
  cardSize: number = DEFAULT_CARD_SIZE;
  @ViewChild('list') listElement?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;

  constructor(private service: AlbumsService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.getAlbums();
  }

  ngAfterViewInit() {
    if (this.listElement) {
      const width = this.listElement.nativeElement.getBoundingClientRect().width;
      let maxCount = Math.floor(width / DEFAULT_CARD_SIZE);

      const freeSpace = width - maxCount * DEFAULT_CARD_SIZE;

      if (freeSpace < 100) {
        maxCount = maxCount - 1;
      }

      this.cardSize = Math.floor(width / maxCount);
    }

    requestAnimationFrame(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTo(0, this.settingsService.scrollPosition);
      }
    });
  }

  async getAlbums() {
    this.albums = await this.service.getAlbums();
  }

  onScroll(e: Event): void {
    this.settingsService.scrollPosition = (e.target as HTMLDivElement)?.scrollTop || 0;
  }
}
