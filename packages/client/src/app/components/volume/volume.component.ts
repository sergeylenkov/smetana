import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ComponentChanges } from 'src/app/utils/component-changes';

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})
export class VolumeComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() volume: number = 0;
  @Output() onChange = new EventEmitter<number>();
  @ViewChild('track') trackElement!: ElementRef<HTMLDivElement>;
  private width = 0;
  private percent = 0;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: ComponentChanges<VolumeComponent>) {
    if (changes.volume) {
      this.percent = changes.volume.currentValue * 100;
    }
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.width = this.trackElement.nativeElement.getBoundingClientRect().width;
    });
  }

  public getFillPosition(): string {
    return `${this.getPosition()}px`;
  }

  public getKnobPosition(): string {
    return `translateX(${this.getPosition()}px)`;
  }

  public onClick(event: MouseEvent) {
    if (event.target === this.trackElement.nativeElement) {
      this.percent = Math.floor(event.offsetX / (this.width / 100));
      this.onChange && this.onChange.emit(this.percent / 100);
    }
  }

  private getPosition(): number {
    return this.width / 100 * this.percent;
  }
}
