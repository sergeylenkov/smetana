import { exec } from 'child_process';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { Track } from '../tracks/track.entity';

const addPresentationCore = `Add-Type -AssemblyName presentationCore;`;
const createMediaPlayer = `$player = New-Object system.windows.media.mediaplayer;`;
const playAudio = `$player.Play();`;
const stopAudio = `Start-Sleep 1; Start-Sleep -s $player.NaturalDuration.TimeSpan.TotalSeconds;Exit;`;

@Injectable()
export class PlayerService {
  private _volume = 0.1;

  constructor() {
    console.log('PlayerService');
  }
  set volume(value: number) {
    this._volume = value;
  }

  play(track: Track): void {
    const path = join(track.path, track.fileName);
    const command = `powershell -c ${addPresentationCore} ${createMediaPlayer} $player.open('${path}'); $player.Volume = ${this._volume}; ${playAudio} ${stopAudio}`;

    exec(command);
  }
}
