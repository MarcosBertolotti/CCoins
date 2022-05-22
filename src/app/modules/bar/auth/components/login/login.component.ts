import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 //userLogged!: SocialUser;
 // isLogged!: boolean;

  constructor(
    private authService: AuthService,
   // private socialAuthService: SocialAuthService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
  ) { 
    this.registerIcons();
  }

  ngOnInit(): void {/*
    this.socialAuthService.authState.subscribe(
      (data: SocialUser) => {
        this.userLogged = data;
        this.isLogged = this.userLogged !== null;
      }
    )*/
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
