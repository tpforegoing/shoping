import { Pipe, PipeTransform } from '@angular/core';

// +--------------------+----------------------------------------------------------------------- 
// |Частина	            |         Пояснення
// |--------------------+-----------------------------------------------------------------------         
// |if (!value)	        | якщо тексту немає — повертаємо порожній рядок
// |escapeHtml(value)	  | екранізуємо весь текст, щоб хтось не вставив <script> або іншу атаку
// |escapeHtml(search)	| екранізуємо й пошуковий текст
// |RegExp + replace	  | підсвічуємо результат без порушення безпеки
 
@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  transform(value: string | null | undefined, search: string): string {
    if (!value) return '';
    if (!search) return this.escapeHtml(value);

    const escapedValue = this.escapeHtml(value);
    const escapedSearch = this.escapeHtml(search);

    const re = new RegExp(escapedSearch, 'gi');
    return escapedValue.replace(re, match => `<mark>${match}</mark>`);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}