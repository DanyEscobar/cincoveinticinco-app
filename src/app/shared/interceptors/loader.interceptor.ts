import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize } from 'rxjs/operators';
import { LoaderService } from '@shared/services/loarder.service';

export const httpLoaderInterceptor: HttpInterceptorFn = ( req, next ) => {

  const loaderService = inject( LoaderService );
  loaderService.requestStarted();

  return next( req ).pipe(
    delay(1000),
    finalize( () => loaderService.requestEnded() )
  );
}
