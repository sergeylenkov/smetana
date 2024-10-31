import { Component, OnInit } from '@angular/core';
import { Genre } from '../../dto/genre';
import { GenresService } from '../../services/genres.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
  providers: [GenresService],
})
export class GenresComponent implements OnInit {
  genres: Genre[] = [];

  constructor(private service: GenresService) {}

  ngOnInit(): void {
    this.getGenres();
  }

  public async getGenres() {
    this.genres = await this.service.getGenres();
  }
}
