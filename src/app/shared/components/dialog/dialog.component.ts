import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, title: string, closeMessage: string, canCancel: boolean, canClose: boolean, actions: any }) 
    {
      this.data.canClose = this.data.canClose ?? true
    }

  ngOnInit(): void {
  }

  cancel(){
    this.dialogRef.close()
  }

  execute(action: () => void){
    action()
    if(this.data.canClose)
      this.dialogRef.close()
  }

}
