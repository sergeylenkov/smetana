import { Component, Input, OnInit } from '@angular/core';
import { SearchAlbum } from '../../dto/search-album';

@Component({
  selector: 'app-search-album',
  templateUrl: './search-album.component.html',
  styleUrls: ['./search-album.component.scss']
})
export class SearchAlbumComponent implements OnInit {
  @Input() album?: SearchAlbum;
  public artists: string = '';

  ngOnInit(): void {
    if (this.album) {
      this.artists = this.album.artists.join(', ');
    }
  }
}
