import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  inject,
  EventEmitter,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<DialogComponent>);

  @Input() title: string = 'Confirm';
  @Input() confirmBtnText: string = 'OK';
  @Input() cancelBtnText: string = 'Cancel';
  @Input() content: string = 'Are you sure to do this action?';
  
  @Output() sendingSubmitSignal = new EventEmitter<any>();

  ngOnInit(): void {}

  onConfirm() {
    this.sendingSubmitSignal.emit(true);
  }

  onClose() {
    this.sendingSubmitSignal.emit(false);
    this.dialogRef.close();
  }
}
