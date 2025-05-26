import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCardListComponent } from './category-card-list.component';

describe('CategoryCardListComponent', () => {
  let component: CategoryCardListComponent;
  let fixture: ComponentFixture<CategoryCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
