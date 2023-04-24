import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingSpinnerService } from 'src/app/shared/services/loading-spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription = new Subscription;

  constructor(
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private socialAuthService: SocialAuthService,
    private loadingSpinnerService: LoadingSpinnerService
  ) { 
    this.loadingSpinnerService.showSpinner();
    this.registerIcons();
    localStorage.clear();
  }

  ngOnInit(): void {
    this.subscription.add(this.socialAuthService.initState.subscribe(() => {
      this.loadingSpinnerService.hideSpinner();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  registerIcons(): void {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg')
    ).addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
    )
  }

  signWithGoogle():void {
    this.authService.socialLogin(GoogleLoginProvider.PROVIDER_ID);
  }

  signWithFacebook():void {
    this.authService.socialLogin(FacebookLoginProvider.PROVIDER_ID);
  }
}
