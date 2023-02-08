import { Component, OnInit } from '@angular/core';
import { Album } from '../../dto/album';
import { Track } from '../../dto/track';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  constructor(private searchService: SearchService) { }
  results: Array<Album | Track> = [];

  ngOnInit(): void {
  }

  public async onChange(event: Event): Promise<void> {
    if (event.target) {
      const element = event.target as HTMLInputElement;

      if (element.value.length >= 2) {
        console.log(element.value);
        this.results = await this.searchService.search(element.value);
        console.log(this.results);
      } else {
        this.results = [];
      }
    }
  }

  public isAlbum(item: Album | Track): item is Album {
    return item instanceof Album;
  }

  public isTrack(item: Album | Track): item is Track {
    return item instanceof Track;
  }
}
