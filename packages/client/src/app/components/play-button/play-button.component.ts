import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-play-button',
  templateUrl: './play-button.component.html',
  styleUrls: ['./play-button.component.scss']
})
export class PlayButtonComponent implements OnInit {
  @Input() progress = 0;
  @Input() isPlaying = false;
  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }
}
