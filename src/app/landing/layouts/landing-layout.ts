import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { LandingNavbar } from '../components/navbar/navbar';

@Component({
  selector: 'app-landing-layout',
  imports: [
    RouterOutlet,
    RouterModule,
    LandingNavbar
  ],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
})
export class LandingLayout {
}
