import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
// import { HomeComponent } from '~features/home/home.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [TranslateModule, RouterOutlet],
})
export class AppComponent {
  title: string = 'CRM';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.loadIcons();
  }

  loadIcons() {
    const iconLabels = ['crm', 'empty-box', 'empty', 'no-data'];
    for (let icon of iconLabels) {
      const path = 'icons/icon-';
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${path}${icon}.svg`)
      );
    }
  }
}
