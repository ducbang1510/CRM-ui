import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingService } from '~shared/services/loading.service';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.scss',
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class ProgressSpinnerComponent {
  @Input() progressSpinnerId: string = 'app-progress-spinner';

  constructor(protected loadingService: LoadingService) {}
}
