import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFooterComponent } from './products-footer.component';

describe('ProductsFooterComponent', () => {
  let component: ProductsFooterComponent;
  let fixture: ComponentFixture<ProductsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
