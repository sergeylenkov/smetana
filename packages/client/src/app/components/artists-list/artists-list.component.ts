import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ArtistsService } from '../../services/artists.service';
import { Artist } from '../../dto/artist';

const DEFAULT_CARD_SIZE = 180;

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss'],
  providers:  [ ArtistsService ]
})
export class ArtistsListComponent implements OnInit, AfterViewInit, AfterViewChecked {
  artists: Artist[] = [];
  cardSize: number = DEFAULT_CARD_SIZE;
  @ViewChild('list') listElement?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;

  constructor(private service: ArtistsService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.getArtists();
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
  }

  ngAfterViewChecked() {
    requestAnimationFrame(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTo(0, this.settingsService.scrollPosition);
      }
    });
  }

  async getArtists() {
    this.artists = await this.service.getArtists();
  }

  onScroll(e: Event): void {
    this.settingsService.scrollPosition = (e.target as HTMLDivElement)?.scrollTop || 0;
  }
}
