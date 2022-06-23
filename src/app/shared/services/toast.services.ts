import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

constructor(private snackBar: MatSnackBar) {}
 
  openToast(message: string, action: string | undefined = undefined, config?: MatSnackBarConfig<TextOnlySnackBar>): MatSnackBarRef<TextOnlySnackBar> {
    config = { ...config, duration: 4000 };
    return this.snackBar.open(message, action, config);
  }

  openErrorToast(message: string = "Ha ocurrido un error", action: string | undefined = undefined, config?: MatSnackBarConfig<TextOnlySnackBar>): MatSnackBarRef<TextOnlySnackBar> {
    config = { ...config, panelClass: ['toast', 'toast-error'] }
    return this.openToast(message, action, config);
  }

  openSuccessToast(message: string, action: string | undefined = undefined, config?: MatSnackBarConfig<TextOnlySnackBar>): MatSnackBarRef<TextOnlySnackBar> {
    config = { ...config, panelClass: ['toast', 'toast-success'] }
    return this.openToast(message, action, config);
  }
}