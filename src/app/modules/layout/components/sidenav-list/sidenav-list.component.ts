import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { SpotifyCredentials } from 'src/app/models/spotify-credentials.model';
import { SpotifyPlayer } from 'src/app/models/spotify-player-model';
import { AuthService } from 'src/app/services/auth.service';
import { BarService } from 'src/app/services/bar.service';
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

  currentBar!: Bar;
  spotifyPlayer!: SpotifyPlayer;
  subscription: Subscription = new Subscription();
  spotifyPlayerInterval$ = interval(5000).pipe(
    tap(() => this.getMeSpotifyPlayer())
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService,
    private spotifyService: SpotifyService,
    public barService: BarService,
  ) { 
    this.registerIcons();
  }

  ngOnInit(): void {
    this.handleSpotifyLogin();
    this.subscription.add(this.spotifyPlayerInterval$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleSpotifyLogin(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (code && !this.spotifyService.isLoggedIn()) { 
        this.getCredentials(code);
        // remove code from params
        const newUrl = this.router.createUrlTree([], { queryParams: {} }).toString();
        window.history.replaceState({}, '', newUrl);
      } else 
        this.getMeSpotifyPlayer();
    });
  }

  getCredentials(code: string): void {
    this.spotifyService.getCredentials()
    .then((response: SpotifyCredentials) => {
      this.spotifyService.spotifyCredentials = response;
      this.spotifyService.getAccessToken(code).subscribe((response) => {
        this.spotifyService.saveTokens(response.access_token, response.expires_in, response.refresh_token);
        this.getMeSpotifyPlayer();
      });
    })
    .catch((error: HttpErrorResponse) => console.log(error));
  }

  getMeSpotifyPlayer(): void {
    this.spotifyService.mePlayer()
    .then((response: SpotifyPlayer) => {
      this.spotifyPlayer = response;
      if(response)
        this.spotifyService.sendSong(response);
    })
    .catch((error: HttpErrorResponse) => console.error(error.error?.message));
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
