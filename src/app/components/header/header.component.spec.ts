
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit showAll event when onShowAll is called', () => {
    spyOn(component.showAll, 'emit');
    component.onShowAll();
    expect(component.showAll.emit).toHaveBeenCalled();
  });

  it('should emit showFavorites event when onShowFavorites is called', () => {
    spyOn(component.showFavorites, 'emit');
    component.onShowFavorites();
    expect(component.showFavorites.emit).toHaveBeenCalled();
  });

  it('should emit showFiltersChange event when onShowFilters is called', () => {
    spyOn(component.showFiltersChange, 'emit');
    component.onShowFilters();
    expect(component.showFiltersChange.emit).toHaveBeenCalled();
  });
});
