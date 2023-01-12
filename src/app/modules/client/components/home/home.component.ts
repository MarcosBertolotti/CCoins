import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  openedWelcomeDialogKey = 'openedWelcomeDialog';
  me: ClientTableDTO;

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastService,
    private clientService: ClientService,
  ) { 
    this.me = this.clientService.clientTable;
  }

  ngOnInit(): void {
    this.checkWelcomeDialog();
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
