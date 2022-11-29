import { Injectable } from '@angular/core';

enum StorageKeys {
  Volume = 'volume'
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {
  }

  public set volume(value: number) {
    localStorage.setItem(StorageKeys.Volume, String(value));
  }

  public get volume(): number {
    return Number(localStorage.getItem(StorageKeys.Volume)) || 0.5;
  }
}
