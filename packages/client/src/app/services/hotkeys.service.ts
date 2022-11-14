import { Injectable } from '@angular/core';

export enum KeyboardModifier {
  Alt = 'Alt',
  Shift = 'Shift',
  Ctrl = 'Ctrl',
  Meta = 'Meta'
}

interface KeyboardListener {
  key: string;
  modifier?: KeyboardModifier;
  listener: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class HotkeysService {
  private _subscribers: KeyboardListener[] = [];

  constructor() {
    window.addEventListener('keypress', (event: KeyboardEvent) => {
      this.onKeyPress(event);
    })
  }

  public onKey(key: string, modifier: KeyboardModifier | undefined, listener: () => void) {
    const subscriber = {
      key: key,
      modifier: modifier,
      listener: listener,
    }

    this._subscribers.push(subscriber);
  }

  private onKeyPress(event: KeyboardEvent) {
    this._subscribers.forEach(subscriber => {
      if (subscriber.key == event.code && subscriber.modifier === this.getModifier(event)) {
        subscriber.listener();
      }
    });
  }

  private getModifier(event: KeyboardEvent): KeyboardModifier | undefined {
    if (event.altKey) {
      return KeyboardModifier.Alt;
    }

    if (event.shiftKey) {
      return KeyboardModifier.Shift;
    }

    if (event.ctrlKey) {
      return KeyboardModifier.Ctrl;
    }

    if (event.metaKey) {
      return KeyboardModifier.Meta;
    }

    return undefined;
  }
}
