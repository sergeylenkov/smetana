import { Component, Input, OnInit } from '@angular/core';
import { Album } from '../dto/album';
import { Artist } from '../dto/artist';
import { Cover } from '../dto/cover';

@Component({
  selector: 'app-album-item',
  templateUrl: './album-item.component.html',
  styleUrls: ['./album-item.component.scss']
})
export class AlbumItemComponent implements OnInit {
  @Input()
  album?: Album;

  constructor() { }

  ngOnInit(): void {
  }
}
