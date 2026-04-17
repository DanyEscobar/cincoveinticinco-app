import { AfterViewChecked, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from '@shared/services/loarder.service';
import { LoadingSpinner } from '@shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoadingSpinner
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy, AfterViewChecked {

  public title = signal<string>('cincoveinticinco-app');
  public loading = signal<boolean>(false);
  private subscription = new Subscription();
  private readonly loaderService = inject(LoaderService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.subscription = this.loaderService.isLoading
      .subscribe( isLoading => {
        this.loading.set(isLoading);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }
}
