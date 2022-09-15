import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { Album } from '../dto/album';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
  public album?: Album;

  constructor(private service: AlbumsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTracks();
  }

  async getTracks() {
    const id = this.route.snapshot.params['id'];
    this.album = await this.service.getTracks(id);
  }
}
