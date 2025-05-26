import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCardListComponent } from './products-card-list.component';

describe('ProductsCardListComponent', () => {
  let component: ProductsCardListComponent;
  let fixture: ComponentFixture<ProductsCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
