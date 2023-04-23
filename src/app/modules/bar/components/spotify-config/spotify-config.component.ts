import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-spotify-config',
  templateUrl: './spotify-config.component.html',
  styleUrls: ['./spotify-config.component.scss']
})
export class SpotifyConfigComponent implements OnInit {

  appPaths = AppPaths;
  isConnected = false;

  constructor(
    private toastService: ToastService,
    private spotifyService: SpotifyService,
  ) { 
    this.isConnected = this.spotifyService.connected;
  }

  ngOnInit(): void {
    this.checkSpotifyIsConnected();
  }

  authorizeSpotify(): void {
    this.spotifyService.spotifyLogin();
  }

  checkSpotifyIsConnected(): void {
    const spotifyObserver: PartialObserver<boolean> = {
      next: (isConnected: boolean) => this.isConnected = isConnected,
      error: () => this.toastService.openErrorToast("Ocurrió un error al verificar si Spotify esta conectado")
    }
    this.spotifyService.checkIsConnected().subscribe(spotifyObserver);
  }

  disconnectSpotify(): void {
    const spotifyObserver: PartialObserver<void> = {
      next: () => {
        this.spotifyService.connected = false;
        this.isConnected = false;
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    }
    this.spotifyService.disconnect().subscribe(spotifyObserver);
  }

}
