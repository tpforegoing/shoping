import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListFooterComponent } from './category-list-footer.component';

describe('CategoryListFooterComponent', () => {
  let component: CategoryListFooterComponent;
  let fixture: ComponentFixture<CategoryListFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
