import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class LandingNavbar {
  public isMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuOpen.update((prev: boolean) => !prev);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
