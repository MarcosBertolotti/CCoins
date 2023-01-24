import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { SpotifyPlayer } from 'src/app/models/spotify-player-model';
import { AuthService } from 'src/app/services/auth.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  items = [
    {
      route: AppPaths.BAR,
      title: 'Mis bares',
      icon: 'grid_view', // dashboard
    },
    {
      route: '#',
      title: 'Sección 2',
      icon: 'article',
    },
    {
      route: '#',
      title: 'Sección 3',
      icon: 'article',
    },
    {
      route: '#',
      title: 'Sección 4',
      icon: 'article',
    },
  ];

  paths = AppPaths;

  spotifyPlayer!: SpotifyPlayer;
  subscription: Subscription = new Subscription();
  spotifyPlayerInterval$ = interval(10000).pipe(
    tap(() => this.getMeSpotifyPlayer())
  );

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService,
    private spotifyService: SpotifyService,
  ) { 
    this.registerIcons();
  }

  ngOnInit(): void {
    this.getMeSpotifyPlayer();
    this.subscription.add(this.spotifyPlayerInterval$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMeSpotifyPlayer(): void {
    const hash = this.spotifyService.getHashUrlParam();

    this.spotifyService.mePlayer(hash?.token)
    .then((response: SpotifyPlayer) => {
      this.spotifyPlayer = response;
      if(response)
        this.spotifyService.sendSong(response);
    })
    .catch((error: HttpErrorResponse) => {
      if(error.status === 401) {
        console.error("token expirado: WIP refresh token");
      }
      console.error(error.error?.message);
    });
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
