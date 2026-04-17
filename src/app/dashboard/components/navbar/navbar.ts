import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class DashboardNavbar {
  @Output() onToggleSidebar = new EventEmitter<void>();

  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }
}
