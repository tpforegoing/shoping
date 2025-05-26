import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


// +--------------------+----------------------------------------------------------------------- 
// |Частина	            |         Пояснення
// |--------------------+-----------------------------------------------------------------------         
// |if (!value)	        | якщо тексту немає — повертаємо порожній рядок
// |escapeHtml(value)	  | екранізуємо весь текст, щоб хтось не вставив <script> або іншу атаку
// |escapeHtml(search)	| екранізуємо й пошуковий текст
// |RegExp + replace	  | підсвічуємо результат без порушення безпеки
 
@Pipe({
    name: 'slug',
    standalone: true, // якщо standalone проект
  })
  export class SlugPipe implements PipeTransform {
    transform(value: string): string {
      return value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }

  export function slugFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (typeof value !== 'string') return null;
  
      const slugified = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
  
      return slugified === value ? null : { invalidSlug: true };
    };
  }