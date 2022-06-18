import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  items = [
    {
      route: AppPaths.BAR,
      title: 'Home',
    },
    {
      route: '#',
      title: 'Section 2',
    },
    {
      route: '#',
      title: 'Section 3',
    },
    {
      route: '#',
      title: 'Section 4',
    },
  ];

  paths = AppPaths;

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService,
  ) { 
    this.registerIcons();
  }

  ngOnInit(): void {
  }

  registerIcons(): void {
    this.matIconRegistry.addSvgIcon(
      'logo-beer',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo-beer.svg')
    ).addSvgIcon(
      'logo-beer-barrel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo-beer-barrel.svg')
    ).addSvgIcon(
      'beer-empty',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/beer-empty.svg')
    ).addSvgIcon(
      'beer-fill',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/beer-fill.svg')
    ).addSvgIcon(
      'chopp-coins-logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/chopp-coins-logo.svg')
    ).addSvgIcon(
      'chopp coins',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/chopp coins.svg')
    ).addSvgIcon(
      'chopp_coins',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/chopp_coins.svg')
    )
  }
  
  logOut(): void {
    this.authService.logOut();
  }
}
