import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceHeaderComponent } from './price-header.component';

describe('PriceHeaderComponent', () => {
  let component: PriceHeaderComponent;
  let fixture: ComponentFixture<PriceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
