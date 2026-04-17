import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Sidebar } from '@dashboard/components/sidebar/sidebar';
import { DashboardNavbar } from '../components/navbar/navbar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    Sidebar,
    DashboardNavbar
  ],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent {
  public isSidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update((prev: boolean) => !prev);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
