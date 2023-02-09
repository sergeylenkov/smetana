import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAlbumComponent } from './search-album.component';

describe('SearchAlbumComponent', () => {
  let component: SearchAlbumComponent;
  let fixture: ComponentFixture<SearchAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAlbumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
