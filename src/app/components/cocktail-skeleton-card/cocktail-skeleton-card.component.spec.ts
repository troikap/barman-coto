import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CocktailSkeletonCardComponent } from './cocktail-skeleton-card.component';

describe('CocktailSkeletonCardComponent', () => {
  let component: CocktailSkeletonCardComponent;
  let fixture: ComponentFixture<CocktailSkeletonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailSkeletonCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailSkeletonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
