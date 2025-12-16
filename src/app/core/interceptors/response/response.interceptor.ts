import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          console.log('  API Response:', {
            url: event.url,
            status: event.status,
            statusText: event.statusText,
            body: event.body
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ API Error:', {
          url: error.url,
          status: error.status,
          message: error.message,
          error: error.error
        });
      }
    })
  );
};
