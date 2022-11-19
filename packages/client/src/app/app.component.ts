import { Component, OnInit } from '@angular/core';
import { PlayerState } from './models/player';
import { HotkeysService } from './services/hotkeys.service';
import { PlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private playerService: PlayerService, private hotkeysService: HotkeysService) {}

  ngOnInit(): void {
    this.hotkeysService.onKey('Space', undefined, () => {
      if (this.playerService.track) {
        this.playerService.state === PlayerState.Playing ? this.playerService.pause() : this.playerService.resume();
      }
    })

    this.hotkeysService.onKey('KeyP', undefined, () => {
      this.playerService.previousTrack();
    })

    this.hotkeysService.onKey('KeyN', undefined, () => {
      this.playerService.nextTrack();
    })
  }
}
