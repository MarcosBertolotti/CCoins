import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { messages: string[], title: string, closeMessage: string, canCancel: boolean, canClose: boolean, actions: { action?: () => void , message?: string }[] }) 
    {
      this.data.canClose = this.data.canClose ?? true
    }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close(false)
  }

  execute(action: () => void){
    if(action)
      action();
      
    if(this.data.canClose)
      this.dialogRef.close(true)
  }

}
