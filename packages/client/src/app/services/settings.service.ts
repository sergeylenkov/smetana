import { Injectable } from '@angular/core';

enum StorageKeys {
  Volume = 'Volume',
  ScrollPosition = 'ScrollPosition'
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

  public set scrollPosition(value: number) {
    localStorage.setItem(StorageKeys.ScrollPosition, String(value));
  }

  public get scrollPosition(): number {
    return Number(localStorage.getItem(StorageKeys.ScrollPosition)) || 0;
  }
}
