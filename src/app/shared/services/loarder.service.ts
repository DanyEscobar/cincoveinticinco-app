import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LoaderService {

  private requestsActive = 0;
  public isLoading = new BehaviorSubject<boolean>(false);

  requestStarted() {
    if ( this.requestsActive === 0 ) {
      this.isLoading.next( true );
    }
    this.requestsActive++;
  }

  requestEnded() {
    this.requestsActive--;
    if ( this.requestsActive === 0 ) {
      this.isLoading.next( false );
    }
  }
}
