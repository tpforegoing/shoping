import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MATERIAL_ICONS } from './material-icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-icon-picker-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule,
    MatButtonModule, 
    MatIconModule, 
    MatInputModule,
  ],
  templateUrl: './icon-picker-dialog.component.html',
  styleUrl: './icon-picker-dialog.component.scss'
})
export class IconPickerDialogComponent {
  icons = MATERIAL_ICONS;
  filter = '';

  constructor(
    private dialogRef: MatDialogRef<IconPickerDialogComponent>
  ) {}

  selectIcon(icon: string) {
    this.dialogRef.close(icon);
  }

  get filteredIcons() {
    const value = this.filter.toLowerCase();
    return this.icons.filter((icon: string) => icon.includes(value));
  }
}
