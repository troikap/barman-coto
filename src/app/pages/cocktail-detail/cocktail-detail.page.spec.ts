import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailDetailPage } from './cocktail-detail.page';

describe('CocktailDetailPage', () => {
  let component: CocktailDetailPage;
  let fixture: ComponentFixture<CocktailDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
