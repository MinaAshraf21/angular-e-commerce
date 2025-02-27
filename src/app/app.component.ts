import { isPlatformBrowser } from '@angular/common';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'E-Commerce';

  constructor(
    private flowbiteService: FlowbiteService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     // Safe to use document or initialize Flowbite here
  //     initFlowbite();
  //   }
  //   this.flowbiteService.loadFlowbite((flowbite) => {});
  // }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }
}
