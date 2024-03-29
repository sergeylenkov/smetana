import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SearchArtist } from '../../dto/search-artist';
import { SearchService } from '../../services/search.service';
import { SearchAlbum } from '../../dto/search-album';
import { SearchTrack } from 'src/app/dto/search-track';
import { HttpException } from '@serglenkov/http-client';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchInput') searchElement?: ElementRef<HTMLInputElement>;
  searchUpdate = new Subject<string>();
  searchString: string = '';
  albums: SearchAlbum[] = [];
  artists: SearchArtist[] = [];
  tracks: SearchTrack[] = [];
  isListVisible = false;
  error?: string;

  constructor(private searchService: SearchService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeList();
      }
    });

    this.searchUpdate.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.onInputChange(value);
    });
  }

  ngOnInit(): void {
  }

  public async onInputChange(value: string): Promise<void> {
    if (value.length >= 2) {
      this.error = undefined;

      try {
        const results = await this.searchService.search(value);

        this.albums = results.filter(result => this.isAlbum(result)) as SearchAlbum[];
        this.artists = results.filter(result => this.isArtist(result)) as SearchArtist[];
        this.tracks = results.filter(result => this.isTrack(result)) as SearchTrack[];

        this.isListVisible = true;
      } catch (error) {
        if (error instanceof HttpException) {
          this.error = error.message;
          this.isListVisible = true;
        }
      }
    } else {
      this.isListVisible = false;
    }
  }

  public onClickOutside() {
    this.closeList();
  }

  public onClear() {
    this.closeList();
  }

  public closeList() {
    this.searchString = '';
    this.error = undefined;
    this.isListVisible = false;
  }

  public isArtist(item: unknown): item is SearchArtist {
    return item instanceof SearchArtist;
  }

  public isAlbum(item: unknown): item is SearchAlbum {
    return item instanceof SearchAlbum;
  }

  public isTrack(item: unknown): item is SearchTrack {
    return item instanceof SearchTrack;
  }

  public artistTrackBy(index: number, artist: SearchArtist) {
    return artist.id;
  }

  public albumTrackBy(index: number, album: SearchAlbum) {
    return album.id;
  }

  public trackTrackBy(index: number, track: SearchTrack) {
    return track.id;
  }
}
