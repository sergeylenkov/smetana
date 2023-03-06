import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PlayerState } from './models/player';
import { HotkeysService } from './services/hotkeys.service';
import { PlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';

  constructor(private playerService: PlayerService, private hotkeysService: HotkeysService) {}

  ngOnInit(): void {
    this.hotkeysService.onKey('Space', undefined, () => {
      if (document.activeElement && document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.blur();
      }

      if (this.playerService.track) {
        if (this.playerService.state == PlayerState.Paused) {
          this.playerService.resume();
        }

        if (this.playerService.state == PlayerState.Playing) {
          this.playerService.pause();
        }
      }
    })

    this.hotkeysService.onKey('KeyP', undefined, () => {
      this.playerService.previousTrack();
    })

    this.hotkeysService.onKey('KeyN', undefined, () => {
      this.playerService.nextTrack();
    })
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.playerService.forceStop();
  }
}
