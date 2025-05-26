export interface ExtractedErrors {
    fieldErrors: Record<string, string>;
    message: string;
  }
  
  /**
   * Витягує помилки з `HttpErrorResponse` після запиту до бекенду.
   * Працює з форматом Django REST Framework.
   */
  export function extractFieldErrors(error: any): ExtractedErrors {
    const fallback = 'Сталася невідома помилка';
    const data = error?.error;
    // console.log('[extractFieldErros] error:', error);
    // Якщо є словник з полями — зберігаємо як fieldErrors
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const fieldErrors: Record<string, string> = {};
  
      for (const key of Object.keys(data)) {
        const value = data[key];
        // console.log('[extractFieldErros] loop key:', key, "value: ", value)
  
        if (Array.isArray(value)) {
          fieldErrors[key] = value[0]; // Беремо лише перше повідомлення
        } else if (typeof value === 'string') {
          fieldErrors[key] = value;
        }
      }
    //   console.log('[extractFieldErros] fieldErrors:', fieldErrors);
      // Витягуємо повідомлення за замовчуванням
      const message = error.message;
    //   console.log('[extractFieldErros] message:', message)
      return { fieldErrors, message };
    }
  
    return { fieldErrors: {}, message: fallback };
  }
  