import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { User } from '@shared/interfaces/user.interface';
import { Option } from '@shared/interfaces/option.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  public readonly users$ = this.usersSubject.asObservable();

  public readonly genders: Option[] = [
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Mujer', label: 'Mujer' },
  ];

  public readonly countries: Option[] = [
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Mexico', label: 'México' }
  ];

  public readonly departments: Option[] = [
    { value: 'Cundinamarca', label: 'Cundinamarca' },
    { value: 'Antioquia', label: 'Antioquia' },
    { value: 'Valle', label: 'Valle' },
    { value: 'Caldas', label: 'Caldas' },
  ];

  public readonly cities: Record<string, Option[]> = {
    // Departments of Colombia
    'Cundinamarca': [
      { value: 'Bogota', label: 'Bogotá' },
      { value: 'Soacha', label: 'Soacha' },
      { value: 'Chia', label: 'Chía' }
    ],
    'Antioquia': [
      { value: 'Medellin', label: 'Medellín' },
      { value: 'Bello', label: 'Bello' },
      { value: 'Itagui', label: 'Itagüí' }
    ],
    'Valle': [
      { value: 'Cali', label: 'Cali' },
      { value: 'Palmira', label: 'Palmira' },
      { value: 'Yumbo', label: 'Yumbo' }
    ],
    'Caldas': [
      { value: 'Manizales', label: 'Manizales' },
      { value: 'Pereira', label: 'Pereira' },
      { value: 'Armenia', label: 'Armenia' }
    ],
    // Countries for direct selection
    'Argentina': [
      { value: 'Buenos Aires', label: 'Buenos Aires' },
      { value: 'Córdoba', label: 'Córdoba' },
      { value: 'Rosario', label: 'Rosario' }
    ],
    'Mexico': [
      { value: 'Ciudad de México', label: 'Ciudad de México' },
      { value: 'Guadalajara', label: 'Guadalajara' },
      { value: 'Monterrey', label: 'Monterrey' }
    ]
  };
    

  getUsers(): Observable<User[]> {
    return this.httpClient.get<{users: User[]}>('https://cincoveinticinco.com/users.json').pipe(
      map((response) => {
        const currentUsers = this.usersSubject.getValue();
        const serverUsers = response.users;

        const updatedUsersList = serverUsers.map(su => {
          const localMatch = currentUsers.find(u => u.id === su.id);
          return localMatch ? localMatch : su;
        });

        const onlyLocalUsers = currentUsers.filter(u => !serverUsers.some(su => su.id === u.id));
        const finalMergedList = [...updatedUsersList, ...onlyLocalUsers];

        this.usersSubject.next(finalMergedList);
        return finalMergedList;
      }),
      catchError((error) => {
        console.error('Error fetching users', error);
        return of(this.usersSubject.getValue());
      })
    );
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.getUsers().pipe(
      map(users => users.find(u => u.id === id))
    );
  }

  addUser(user: User): void {
    const currentUsers = this.usersSubject.getValue();
    const maxId = currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id || 0)) : 0;
    const newUser = { ...user, id: maxId + 1 };
    
    this.usersSubject.next([...currentUsers, newUser]);
  }

  updateUser(updatedUser: User): void {
    const currentUsers = this.usersSubject.getValue();
    const index = currentUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      const updatedList = [...currentUsers];
      updatedList[index] = updatedUser;
      this.usersSubject.next(updatedList);
    }
  }

  // deleteUser(userId: number): void {
  //   const currentUsers = this.usersSubject.getValue();
  //   this.usersSubject.next(currentUsers.filter(u => u.id !== userId));
  // }
}
