import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './interceptors/auth.interceptor';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { ToastService } from './shared/services/toast.services';
import { SharedModule } from './shared/shared.module';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';

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
              { scope: "email", plugin_name:'App Name that you used in google developer console API' }
            )
          }
        ],
        onError: (err: any) => {
          console.error("auth social error: ", err);
        }
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
