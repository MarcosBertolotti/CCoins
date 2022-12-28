import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { LoadingSpinnerService } from "../shared/services/loading-spinner.service";
import { DISABLED_SPINNER_PATHS } from "../tokens/disabled-spinner-paths.token";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
 
 constructor(
   @Inject(DISABLED_SPINNER_PATHS) private disabledSpinnerPaths: RegExp[],
   private spinnerService: LoadingSpinnerService
 ) {}
 
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requestURL = request.url;
  
    if (!requestURL.includes(environment.API_URL) || this.checkDisableSpinner(requestURL)) {
      return next.handle(request);
    }
  
    this.spinnerService.toggleSpinner();
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.toggleSpinner();
      })
    );
  }

 checkDisableSpinner(requestURL: string): boolean {
  const urlPath = new URL(requestURL).pathname;

  return this.disabledSpinnerPaths.some(
    (regexpPath) => regexpPath.test(urlPath)
  );
}
}
