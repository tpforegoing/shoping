import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListMainComponent } from './price-list-main.component';

describe('PriceListMainComponent', () => {
  let component: PriceListMainComponent;
  let fixture: ComponentFixture<PriceListMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceListMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceListMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
