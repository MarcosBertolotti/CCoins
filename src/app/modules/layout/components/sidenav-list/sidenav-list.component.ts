import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver, Subscription, of } from 'rxjs';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { SpotifySong } from 'src/app/enums/spotifySong.model';
import { Bar } from 'src/app/models/bar-model';
import { SseEvents } from 'src/app/modules/bar/enums/sse-events.enum';
import { SseService } from 'src/app/modules/bar/services/sse.service';
import { AuthService } from 'src/app/services/auth.service';
import { BarService } from 'src/app/services/bar.service';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ToastService } from 'src/app/shared/services/toast.services';

const { BAR, TABLES, PRIZES, ACTIVITIES, UPDATE, LIST, SPOTIFY } = AppPaths;

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  items: { route: string, title: string, icon: string, display: boolean }[] = [];

  currentBar!: Bar;
  subscription: Subscription = new Subscription();
  spotifyConnected$ = of(false);
  currentSong!: SpotifySong;
  spotifyPath = `${BAR}/${SPOTIFY}`;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService,
    private spotifyService: SpotifyService,
    public barService: BarService,
    private toastService: ToastService,
    private sseService: SseService,
    private playerService: PlayerService,
  ) { 
    this.registerIcons();
  }

  ngOnInit(): void {
    this.getCurrentBar();
    this.buildPaths();
    this.spotifyConnected$ = this.spotifyService.connected$;
    this.handleSpotifyLogin();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCurrentBar(): void {
    this.currentBar = this.barService.currentBar;
    this.subscription.add(this.barService.currentBar$?.subscribe((currentBar: Bar) => {
      if(currentBar) {
        this.currentBar = currentBar;
        this.subscribeSSe();
        this.subscribePlayback()
        this.buildPaths();
      }
    }));
  }

  buildPaths(): void {
    this.items = [
      {
        route: `${BAR}/${LIST}`,
        title: 'Home',
        icon: 'grid_view',
        display: true
      },
      {
        route: `${BAR}/${UPDATE}/${this.currentBar?.id}`,
        title: this.currentBar?.name,
        icon: 'local_bar',
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

  startPlayback(code?: string): void {
    const spotifyObserver: PartialObserver<void> = {
      next: () => console.log("start playback successfull."),
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    }
    this.spotifyService.startPlayback(code).subscribe(spotifyObserver);
  }

  subscribePlayback(): void {
    this.currentSong = this.playerService.spotifySong!;
    this.subscription.add(this.playerService.currentSong$.subscribe((currentSong: SpotifySong) =>
      this.currentSong = currentSong
    ));
  }

  authorizeSpotify(): void {
    this.spotifyService.spotifyLogin();
  }

  handleSpotifyLogin(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if(code) {
        this.spotifyService.connected = true;
        this.startPlayback(code);
        this.removeUrlParamCode();
      }
    });
  }

  removeUrlParamCode(): void {
    const newUrl = this.router.createUrlTree([], { queryParams: {} }).toString();
    window.history.replaceState({}, '', newUrl);
  }

  subscribeSSe(): void {
    this.sseService.getServerSentEvent(this.currentBar.id as number)
    .subscribe((event: Partial<MessageEvent<any>>) => {
      switch (event?.type) {
        case SseEvents.ACTUAL_SONG_SPTF:
          if(event.data)
            this.playerService.currentSong = JSON.parse(event.data);
          break;
        case SseEvents.REQUEST_SPOTIFY_AUTHORIZATION:
          this.authorizeSpotify();
          break;
        default:
          console.log('unkown event:', event.type);
      }
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
