import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@shared/services/user.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, NgClass } from '@angular/common';
import { User } from '@shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { SearchBox } from '@shared/components/search-box/search-box';

@Component({
  selector: 'app-user-index',
  imports: [
    MatTableModule,
    DatePipe,
    NgClass,
    SearchBox,
  ],
  templateUrl: './user-index.html',
  styleUrl: './user-index.css',
})
export class UserIndex implements OnInit {

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public headers = signal<{field: keyof User; header: string; type?: string}[]>([]);
  public users = signal<User[]>([]);
  public filteredUsers = signal<User[]>([]);
  public searchTerm = signal<string>('');
  public currentPage = signal<number>(1);
  public itemsPerPage = signal<number>(3);
  public sortColumn = signal<keyof User | ''>('');
  public sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.getUsers();
    this.setHeaders();
  }

  getUsers(){
    this.userService.getUsers().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
    
    this.userService.users$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (users) => {
        this.users.set(users);
        this.applyFilterAndSort();
      }
    });
  }

  setHeaders(): void {
    const headers: {field: keyof User; header: string; type?: string}[] = [
      {
        field: 'id',
        header: 'Id',
      },
      {
        field: 'name',
        header: 'Nombre',
      },
      {
        field: 'last_name',
        header: 'Apellido',
      },
      {
        field: 'email',
        header: 'Email',
      },
      {
        field: 'country',
        header: 'País',
      },
      {
        field: 'date_birthday',
        header: 'Fecha de Nacimiento',
        type: 'fecha'
      },
      {
        field: 'City',
        header: 'Ciudad',
      },
    ];
    this.headers.set(headers);
  }

  onSearch(searchTerm: string): void {
    this.searchTerm.set(searchTerm.toLowerCase());
    this.currentPage.set(1);
    this.applyFilterAndSort();
  }

  sortBy(column: keyof User): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.applyFilterAndSort();
  }

  applyFilterAndSort(): void {
    let result = this.users();

    if (this.searchTerm()) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(this.searchTerm()) ||
        user.last_name.toLowerCase().includes(this.searchTerm()) ||
        user.email.toLowerCase().includes(this.searchTerm()) ||
        user.country.toLowerCase().includes(this.searchTerm())
      );
    }

    if (this.sortColumn()) {
      result.sort((a, b) => {
        const valA = String(a[this.sortColumn() as keyof User]).toLowerCase();
        const valB = String(b[this.sortColumn() as keyof User]).toLowerCase();
        
        if (valA < valB) return this.sortDirection() === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.filteredUsers.set(result);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredUsers().slice(start, start + this.itemsPerPage());
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage());
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) this.currentPage.set(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  editOption(user: User): void {
    if (user.id) {
      this.router.navigate([`/dashboard/users/edit-user/${user.id}`]);
    }
  }

}
