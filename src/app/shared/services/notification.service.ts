import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../components/dialog/dialog.component";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    constructor(private matDialog: MatDialog) {}
 
    openWarningDialog(messages: string[]): void {
        this.matDialog.open(DialogComponent, {
          panelClass: 'custom-dialog-container',
          width: '80%',
          maxWidth: '350px',
          data: {
            title: 'Atención!',
            messages,
            canCancel: false,
            actions: [{}],
          },
        });
      }
}