import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { LoadingSpinnerService } from "../shared/services/loading-spinner.service";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
 
 constructor(
  // @Inject(DISABLED_SPINNER_PATHS) private disabledSpinnerPaths: string[],
   private spinnerService: LoadingSpinnerService
 ) {}
 
 intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   const endpoint = request.url.split('/').slice().pop();
 
   if (/*this.disabledSpinnerPaths.includes(endpoint!) || */!request.url.includes(environment.API_URL)) {
     return next.handle(request);
   }
 
   this.spinnerService.toggleSpinner();
   return next.handle(request).pipe(
     finalize(() => {
       this.spinnerService.toggleSpinner();
     })
   );
 }
}
