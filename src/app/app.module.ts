import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';

import { MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { ClientInterceptor } from './interceptors/client.interceptor';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { ToastService } from './shared/services/toast.services';
import { SharedModule } from './shared/shared.module';
import { DISABLED_SPINNER_PATHS } from './tokens/disabled-spinner-paths.token';
import { DISABLED_SPINNER_ENDPOINTS } from './const/disabled-spinner-endpoints.const';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './models/customize/customPaginator';
import { LoadingSpinnerService } from './shared/services/loading-spinner.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    SharedModule,
  ],
  providers: [
    ToastService,
    LoadingSpinnerService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.AUTH_GOOGLE_CLIENT_ID,
              { scope: "email", plugin_name:'App Name that you used in google developer console API' }
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.AUTH_FACEBOOK_APPLICATION_ID,
              { scope: "email", plugin_name:'App Name that you used in facebook developer console API' }
            )
          }
        ],
        onError: (err: any) => {
          const error = err?.error?.message ?? err?.error ?? err;
          console.error("auth social error: ", error);
        }
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ClientInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: DISABLED_SPINNER_PATHS, useValue: DISABLED_SPINNER_ENDPOINTS },
    { provide: MatPaginatorIntl, useClass: CustomPaginator },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        autoFocus: false,
        restoreFocus: false,
      } as MatDialogConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
