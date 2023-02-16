import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IntersectionService } from '../../services/intersection.service';
import { Artist } from '../../dto/artist';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit, AfterViewInit {
  @Input() artist?: Artist;
  @Input() cardSize: number = 230;
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
    if (this.artist?.coverUrl && !this.cover) {
      const image = new Image();

      image.onload = () => {
        this.cover = image.src;
      }

      image.src = this.artist?.coverUrl;

      if (this.element) {
        this.intersectionService.remove(this.element.nativeElement);
      }
    }
  }
}
