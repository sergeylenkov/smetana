import { join } from 'path';
import { PowerShell } from 'node-powershell';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track } from '../tracks/track.entity';

@Injectable()
export class PlayerService {
  private _volume = 0.1;
  private _shell = new PowerShell();

  constructor() {
    this.initPlayer();
  }

  public set volume(value: number) {
    this._volume = value;
    this._shell.invoke(`$player.Volume = ${this._volume};`);
  }

  public async play(track: Track): Promise<void> {
    try {
      const path = join(track.path, track.fileName).replace(/'/g, "''");
      console.log('Play', path);
      await this._shell.invoke('$player.Play();');
      await this._shell.invoke(`$player.Open('${path}');`);
      await this._shell.invoke('$player.Play();');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public pause(): void {
    this._shell.invoke('$player.Pause();');
  }

  public resume(): void {
    this._shell.invoke('$player.Play();');
  }

  public seek(seconds: number): void {
    this._shell.invoke(
      `$player.Position=New-Object System.TimeSpan(0, 0, 0, ${seconds}, 0);`,
    );
  }

  private async initPlayer(): Promise<void> {
    await this._shell.invoke('Add-Type -AssemblyName presentationCore;');
    await this._shell.invoke(
      '$player = New-Object system.windows.media.mediaplayer;',
    );
  }
}
