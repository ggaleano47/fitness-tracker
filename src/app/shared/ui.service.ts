import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class UIService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, { duration });
  }
}
