import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-data-found',
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './no-data-found.component.html',
  styleUrl: './no-data-found.component.scss',
})
export class NoDataFoundComponent {
  @Input() panelId: string = 'app-no-data-found';
}
