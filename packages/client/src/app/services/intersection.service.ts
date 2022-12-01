import { Injectable } from '@angular/core';

type IntersectionCallback = (element: Element) => void;

@Injectable({
  providedIn: 'root',
})
export class IntersectionService {
  private observer: IntersectionObserver;
  private observers: Map<Element, IntersectionCallback>;

  constructor() {
    this.observers = new Map();

    this.observer = new IntersectionObserver((elements) => {
      elements.forEach(element => {
        if (element.isIntersecting) {
          const callback = this.observers.get(element.target);
          callback &&  callback(element.target);
        }
      })
    },
    {
      threshold: 0.5
    });
  }

  public add(element: Element, callback: IntersectionCallback) {
    this.observer.observe(element);
    this.observers.set(element, callback);
  }

  public remove(element:Element) {
    this.observer.unobserve(element);
    this.observers.delete(element);
  }
}
