import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  constructor(
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (typeof initFlowbite === 'undefined') {
          console.error(
            'Flowbite is not loaded. Check angular.json and import.'
          );
        } else {
          initFlowbite();
          //console.log('Flowbite initialized successfully');
        }
      }, 100);
    }
  }
}
