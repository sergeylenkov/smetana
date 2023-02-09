import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Artist } from 'src/app/dto/artist';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchInput') searchElement?: ElementRef<HTMLInputElement>;
  results: Array<Album | Track | Artist> = [];

  constructor(private searchService: SearchService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeList();
      }
    });
  }

  ngOnInit(): void {
  }

  public async onChange(event: Event): Promise<void> {
    if (event.target) {
      const element = event.target as HTMLInputElement;

      if (element.value.length >= 2) {
        this.results = await this.searchService.search(element.value);
      } else {
        this.results = [];
      }
    }
  }

  public onClickOutside() {
    this.closeList();
  }

  public closeList() {
    this.searchElement!.nativeElement.value = '';
    this.results = [];
  }

  public isAlbum(item: Album | Track | Artist): item is Album {
    return item instanceof Album;
  }

  public isTrack(item: Album | Track | Artist): item is Track {
    return item instanceof Track;
  }
}
