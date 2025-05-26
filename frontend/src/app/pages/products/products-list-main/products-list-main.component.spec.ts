import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListMainComponent } from './products-list-main.component';

describe('ProductsListMainComponent', () => {
  let component: ProductsListMainComponent;
  let fixture: ComponentFixture<ProductsListMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsListMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
