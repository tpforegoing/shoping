import { Component, OnInit, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';


import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {  MatDialog } from '@angular/material/dialog';


import { IconPickerDialogComponent } from '../../../dialog/icon-picker-dialog/icon-picker-dialog.component'; // правильний шлях

import { CategoryFull } from '../categories.model';
import { CategoryActions } from '../store/category.actions';
import { selectAllCategories, selectCategoryById, selectError } from '../store/category.selectors';
import { MATERIAL_ICONS } from '../../../dialog/icon-picker-dialog/material-icon';
import { ACTION_CREATE, ACTION_UPDATE } from '../../../store/store.model';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';
import { slugFormatValidator } from '../../../share/slug.pipe';


@Component({
  selector: 'app-category-add-edit',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './category-add-edit.component.html',
  styleUrl: './category-add-edit.component.scss'
})
export class CategoryAddEditComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  readonly dialog = inject(MatDialog);
  private readonly actions$ = inject(Actions);
  queryParams = this.route.snapshot.queryParams;
  
  readonly ACTION_CREATE = ACTION_CREATE;
  readonly ACTION_UPDATE = ACTION_UPDATE;
  //  list of MATERIAL ICONS 
  maticons = MATERIAL_ICONS;
  // 
  id = signal<number | null>(null);
  // 
  selectedCategory = signal<CategoryFull | null>(null);
  // 
  allCategories = toSignal(this.store.select(selectAllCategories), { initialValue: [] });

  // readonly slug = inject(SlugPipe);
  readonly error = this.store.selectSignal(selectError);

  form = this.fb.group({
    code: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(5), slugFormatValidator()]
    }),
    title: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
    icon: this.fb.control<string | null>(''),
    parent: this.fb.control<number | null>(null),
    description: this.fb.control<string | null>(''),
  });

  // Визначаємо чи редагування
  isEdit = computed(() => this.id() !== null && this.selectedCategory() !== null);

  constructor() {
    // тут можна тільки dispatch, або effect, або інші дії
    this.store.dispatch(CategoryActions.loadAll({ page: 1}));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(+idParam);
  
      const category$ = this.store.select(selectCategoryById(+idParam));
      const categorySignal = toSignal(category$, { initialValue: null });
      // Ефект оновлення selectedCategory
      effect(() => {
        const cat = categorySignal();
        if (cat) {
          this.selectedCategory.set(cat);
          this.form.patchValue({
            title: cat.title,
            code: cat.code,
            icon: cat.icon ?? '',
            parent: cat.parent,
            description: cat.description
          });
        }
      });

    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;

    const value: Partial<CategoryFull> = {
      title: this.form.value.title!,
      code: this.form.value.code!,
      icon: this.form.value.icon ?? null,
      parent: this.form.value.parent ?? null,
      description: this.form.value.description ?? null
    };
  
    const action = this.isEdit() && this.id()
      ? CategoryActions.update({ id: this.id()!, changes: value })
      : CategoryActions.create({ category: value });

    const successType = this.isEdit()
      ? CategoryActions.updateSuccess
      : CategoryActions.createSuccess;

    this.actions$.pipe(
      ofType(successType),
      take(1)
    ).subscribe(() => this.onBack());

    this.store.dispatch(action);
  }

  onBack(): void {
    this.store.dispatch(CategoryActions.resetError());
    this.store.dispatch(CategoryActions.back({ queryParams: this.queryParams }));
  }

  openIconPicker() {
    const dialogRef = this.dialog.open(IconPickerDialogComponent,{autoFocus: false});
    dialogRef.afterClosed().subscribe((selectedIcon: string) => {
      if (selectedIcon) {
        this.form.get('icon')?.setValue(selectedIcon);
      }
    });
  }

}
