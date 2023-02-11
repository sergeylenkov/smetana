import { Component, Input, OnInit } from '@angular/core';
import { SearchArtist } from '../../dto/search-artist';

@Component({
  selector: 'app-search-artist',
  templateUrl: './search-artist.component.html',
  styleUrls: ['./search-artist.component.scss']
})
export class SearchArtistComponent implements OnInit {
  @Input() artist?: SearchArtist;

  ngOnInit(): void {
  }
}
