import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'psi-tools-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss'],
})
export class QrcodeDialogComponent implements OnInit {
  url: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.url = `${environment.PWA_URL}/login/${data.qrCode}`;
  }

  ngOnInit(): void {}
}
