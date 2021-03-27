import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pop-autocomplete',
  templateUrl: './pop-autocomplete.component.html',
  styleUrls: ['./pop-autocomplete.component.scss']
})
export class PopAutocompleteComponent implements OnInit {

  @Input('column') prodCodeColumn;
  @Input('dataSource') fillterProduct;
  @Input('headerCol') prodCodeHeaders;
  @ViewChild('dpanels') public panels;

  @Output() popvalueChange: EventEmitter<any> = new EventEmitter();

  rowId: number = 0;
  constructor() { }

  ngOnInit(): void {
    this.rowId = null;
  }

  popRowClick(row) {
    this.popvalueChange.emit(row)
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.keyCode) {

      case 40:
        // ArrowDown
        if (this.rowId == this.fillterProduct.length - 1) {
          return
        }
        this.rowId += 1;
        let length = this.fillterProduct.length - 1;
        if (length >= 8) {
          length = 8;
        }

        if (this.rowId >= length) {
          this.panels.nativeElement.scrollTop += 28;
        }
      break;

      case 38:
        // ArrowUp
        if (this.rowId === 0) {
          return;
        }
        this.rowId -= 1;
        this.panels.nativeElement.scrollTop -= 28;
      break;

      case 13:
        // Enter
        this.popRowClick(this.fillterProduct[this.rowId]);
        event.preventDefault();
        event.stopPropagation();
        break;

      default:
        if (this.panels) {
          this.rowId = 0;
          this.panels.nativeElement.scrollTop = 0;
        }
        break;
    }
  }

}
