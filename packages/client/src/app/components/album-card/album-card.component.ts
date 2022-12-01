import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IntersectionService } from '../../services/intersection.service';
import { Album } from '../../dto/album';

@Component({
  selector: 'app-album-card',
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.scss']
})
export class AlbumCardComponent implements OnInit, AfterViewInit {
  @Input() album?: Album;
  @Input() cardSize: number = 250;
  @ViewChild('card') element?: ElementRef<HTMLDivElement>;
  cover?: string;

  constructor(private intersectionService: IntersectionService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.element) {
      this.intersectionService.add(this.element.nativeElement, (element: Element) => {
        this.loadImage();
      });
    }
  }

  private loadImage() {
    if (this.album?.coverUrl && !this.cover) {
      const image = new Image();

      image.onload = () => {
        this.cover = image.src;
      }

      image.src = this.album?.coverUrl;

      if (this.element) {
        this.intersectionService.remove(this.element.nativeElement);
      }
    }
  }
}
