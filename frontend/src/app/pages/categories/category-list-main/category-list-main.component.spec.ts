import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListMainComponent } from './category-list-main.component';

describe('CategoryListMainComponent', () => {
  let component: CategoryListMainComponent;
  let fixture: ComponentFixture<CategoryListMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
