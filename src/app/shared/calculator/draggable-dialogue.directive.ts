import { Directive, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { Subject, fromEvent, of } from 'rxjs';
import { switchMap, map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDraggableDialogue]'
})
export class DraggableDialogueDirective {
  private _target: HTMLElement;
  private _globalview: HTMLElement;
  // Drag handle
  private _handle: HTMLElement;
  private _delta = {x: 0, y: 0};
  private _offset = {x: 0, y: 0};

  private _destroy$ = new Subject<void>();

  constructor(
    private _elementRef: ElementRef,
    private _zone: NgZone,
    private _cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    
    this._elementRef.nativeElement.style.cursor = 'default';
    this._handle = this._elementRef.nativeElement.parentElement.parentElement.parentElement;
    this._target = this._elementRef.nativeElement.parentElement.parentElement.parentElement;
   
    this._globalview = this._elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
    this._setupEvents();    
    let idpop =  parseFloat(this._elementRef.nativeElement.id || 0);    
    this._globalview.style.top = `${idpop + 2}px`;
    
  }

  public ngOnDestroy(): void {
    if (!!this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  private _setupEvents() {
    this._zone.runOutsideAngular(() => {
      
      const mousedown$ = fromEvent(this._handle, 'mousedown');
      const mousemove$ = fromEvent(document, 'mousemove');
      const mouseup$ = fromEvent(document, 'mouseup');

      const mousedrag$ = mousedown$.pipe(
        switchMap((event: MouseEvent) => {
          const classes: any = this._globalview.className;
          const classArray: any = document.getElementsByClassName(classes);
          for (const css of classArray) {
            const styles: CSSStyleDeclaration = css.style;
            styles.zIndex = '1000';
          }

          const styles: CSSStyleDeclaration = this._globalview.style;
          styles.zIndex = '1001';
          
          const startX = event.clientX;
          const startY = event.clientY;


          return mousemove$.pipe(
            map((innerEvent: MouseEvent) => {
              innerEvent.preventDefault();
              this._delta = {
                x: innerEvent.clientX - startX,
                y: innerEvent.clientY - startY,
              };
            }),
            takeUntil(mouseup$),
          );
        }),
        takeUntil(this._destroy$),
      );

      mousedrag$.subscribe(() => {
        if (this._delta.x === 0 && this._delta.y === 0) {
          return;
        }

        this._translate();
      });

    mouseup$.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._offset.x += this._delta.x;
        this._offset.y += this._delta.y;
        this._delta = {x: 0, y: 0};
        this._cd.markForCheck();
      });
    });
  }

  private _translate() {
    // this._target.style.left = `${this._offset.x + this._delta.x}px`;
    // this._target.style.top = `${this._offset.y + this._delta.y}px`;
    // this._target.style.position = 'relative';
    requestAnimationFrame(() => {
      this._target.style.transform = `
        translate(${this._offset.x + this._delta.x}px,
                  ${this._offset.y + this._delta.y}px)
      `;
    });
  }

}
