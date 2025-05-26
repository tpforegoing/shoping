import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListHeaderComponent } from './category-list-header.component';

describe('CategoryListHeaderComponent', () => {
  let component: CategoryListHeaderComponent;
  let fixture: ComponentFixture<CategoryListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
