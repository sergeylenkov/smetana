import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  @Input() time: number = 0;
  date: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.date = new Date(this.time * 1000);
  }
}
