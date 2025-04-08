import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsSearchInputComponent } from './columns-search-input.component';

describe('ColumnsSearchInputComponent', () => {
  let component: ColumnsSearchInputComponent;
  let fixture: ComponentFixture<ColumnsSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsSearchInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnsSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
