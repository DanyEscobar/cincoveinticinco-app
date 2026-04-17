import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.css',
})
export class Breadcrumbs {

  public page = input<string>('');
  public titulo = input<string>('');
  public url = input<string>('');

}
