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

const { BAR, TABLES, PRIZES, ACTIVITIES, UPDATE, LIST } = AppPaths;

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  items: { route: string, title: string, icon: string, display: boolean }[] = [];

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
    this.getCurrentBar();
    this.buildPaths();
    this.handleSpotifyLogin();
    this.subscription.add(this.spotifyPlayerInterval$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCurrentBar(): void {
    this.currentBar = this.barService.currentBar;
    this.subscription.add(this.barService.currentBar$?.subscribe((currentBar: Bar) => {
      if(currentBar) {
        this.currentBar = currentBar;
        this.buildPaths();
      }
    }));
  }

  buildPaths(): void {
    this.items = [
      {
        route: `${BAR}/${LIST}`,
        title: 'Home',
        icon: 'grid_view', // dashboard
        display: true
      },
      {
        route: `${BAR}/${UPDATE}/${this.currentBar?.id}`,
        title: this.currentBar?.name,
        icon: 'local_bar', // info
        display: !!this.currentBar?.id
      },
      {
        route: `${BAR}/${this.currentBar?.id}/${TABLES}`,
        title: 'Mesas',
        icon: 'table_bar',
        display: !!this.currentBar?.id
      },
      {
        route: `${BAR}/${this.currentBar?.id}/${ACTIVITIES}`,
        title: 'Actividades',
        icon: 'emoji_objects',
        display: !!this.currentBar?.id
      },
      {
        route: `${BAR}/${this.currentBar?.id}/${PRIZES}`,
        title: 'Premios',
        icon: 'emoji_events',
        display: !!this.currentBar?.id
      }
    ];
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
    .catch((error: HttpErrorResponse) => console.error(error));
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
