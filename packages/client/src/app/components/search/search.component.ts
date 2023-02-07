import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  public onChange(event: Event): void {
    if (event.target) {
      const element = event.target as HTMLInputElement;

      if (element.value.length > 2) {
        console.log(element.value);
        this.searchService.search(element.value);
      }
    }
  }
}
