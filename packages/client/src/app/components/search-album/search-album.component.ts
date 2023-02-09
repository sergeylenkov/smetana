import { Component, Input, OnInit } from '@angular/core';
import { Album } from '../../dto/album';

@Component({
  selector: 'app-search-album',
  templateUrl: './search-album.component.html',
  styleUrls: ['./search-album.component.scss']
})
export class SearchAlbumComponent implements OnInit {
  @Input() album?: Album;
  public name: string = '';
  public artists: string = '';

  ngOnInit(): void {
    if (this.album) {
      this.name = this.album.name;
      this.artists = this.album?.artists.map(artist => artist.name).join(', ') || '';
    }
  }
}
