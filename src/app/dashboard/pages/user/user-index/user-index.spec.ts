import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { UserIndex } from './user-index';

describe('UserIndex', () => {
  let component: UserIndex;
  let fixture: ComponentFixture<UserIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIndex],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
