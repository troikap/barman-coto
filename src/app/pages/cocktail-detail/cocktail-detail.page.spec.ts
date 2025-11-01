import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CocktailService } from '../../core/services/cocktail/cocktail.service';
import { ParamMap } from '@angular/router';


import { CocktailDetailPage } from './cocktail-detail.page';

describe('CocktailDetailPage', () => {
  let component: CocktailDetailPage;
  let fixture: ComponentFixture<CocktailDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailDetailPage, HttpClientTestingModule],
      providers: [
        CocktailService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'id') {
                  return '123';
                }
                return null;
              },
            } as ParamMap),
          }
        }
      ]
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
