
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event on input change', fakeAsync(() => {
    spyOn(component.search, 'emit');
    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'margarita';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();
    expect(component.search.emit).toHaveBeenCalledWith('margarita');
  }));
});
