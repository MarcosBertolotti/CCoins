import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartialObserver, Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { SpotifySong } from '../../models/spotifySong.model';
import { ClientService } from '../../services/client.service';
import { SpotifyService } from '../../services/spotify.service';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  openedWelcomeDialogKey = 'openedWelcomeDialog';
  me: ClientTableDTO;
  currentSong!: SpotifySong;
  subscription = new Subscription();

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private clientService: ClientService,
    private spotifyService: SpotifyService,
  ) { 
    this.me = this.clientService.clientTable;
  }

  ngOnInit(): void {
    this.checkWelcomeDialog();

    this.currentSong = this.spotifyService.spotifySong;

    this.subscription.add(this.spotifyService.currentSong$.subscribe((value) =>
      this.currentSong = value
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkWelcomeDialog(): void {
    const openedWelcomeDialog = localStorage.getItem(this.openedWelcomeDialogKey);
    
    if(!openedWelcomeDialog) {
      const dialogRef = this.matDialog.open(WelcomeComponent, {
        width: '80%',
        backdropClass: 'back-drop-dialog',
        panelClass: 'custom-dialog-container-dark',
        disableClose: true,
        data: this.me,
      });

      dialogRef.beforeClosed().subscribe(() => {
        localStorage.setItem(this.openedWelcomeDialogKey, JSON.stringify(true));
        this.me = this.clientService.clientTable;
      });
    }
  }

  openMenu(): void {
    const MenuBarObserver: PartialObserver<{ text: string}> = {
      next: (menu: { text: string}) => {
        if(menu?.text?.length > 0)
          window.open(menu.text, "_blank");
        else
          this.toastService.openErrorToast('El menú no esta disponible');
      },
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message)
    };
    this.clientService.getBarMenu().subscribe(MenuBarObserver);
  }

  goToBarPrizes(): void {
    this.router.navigate([ClientPaths.BAR_PRIZES]);
  }
}
