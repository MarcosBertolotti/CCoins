import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private matDialog: MatDialog) {}

  openWarningDialog(messages: string[], title = 'Atención!'): void {
    this.matDialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '80%',
      maxWidth: '350px',
      data: {
        title,
        messages,
        canCancel: false,
        actions: [{}],
      },
    });
  }

  openDialog(messages: string[], title = 'Atención!', canCancel = true, actions = [{}]): void {
    this.matDialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '80%',
      maxWidth: '350px',
      data: {
        title,
        messages,
        canCancel,
        actions,
      },
    });
  }
}