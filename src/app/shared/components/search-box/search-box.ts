import { Component, ElementRef, input, output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-box',
  imports: [],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBox implements OnInit, OnDestroy {

  private readonly debouncer: Subject<string> = new Subject<string>();
  private debouncerSuscription?: Subscription;

  public disabled = input.required<boolean>();
  public placeholder = input.required<string>();
  public initialValue = input<string>();
  public debounce = output<string>();
  @ViewChild( 'txtInput' )
  public tagInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.debouncerSuscription = this.debouncer
      .pipe(
        debounceTime( 300 )
      )
      .subscribe( value => {
        this.debounce.emit( value );
      } );
  }

  ngOnDestroy(): void {
    this.debouncerSuscription?.unsubscribe();
  }

  onKeyPress( searchTerm: string ): void {
    this.debouncer.next( searchTerm.trimStart() );
  }

  resetSearch(): void {
    this.tagInput.nativeElement.value = '';
  }
}
