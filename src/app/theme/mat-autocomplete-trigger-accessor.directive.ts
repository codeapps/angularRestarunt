import { Directive } from '@angular/core';
import { Host, Self, Optional, Input, OnInit } from '@angular/core';
import { MatAutocompleteTrigger, AUTOCOMPLETE_OPTION_HEIGHT, AUTOCOMPLETE_PANEL_HEIGHT } from '@angular/material/autocomplete';
import {
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition
} from '@angular/material/core';


@Directive({
  selector: '[matAutocompleteTriggerAccessor]'
})
export class MatAutocompleteTriggerAccessorDirective {

    @Input() optionHeight: number = AUTOCOMPLETE_OPTION_HEIGHT;
    @Input() panelHeight: number = AUTOCOMPLETE_PANEL_HEIGHT;

    constructor(
      @Host() @Self() @Optional() public _refTrigger: MatAutocompleteTrigger
    ) { }

    public ngOnInit() {
      if (this._refTrigger === undefined || this._refTrigger === null) {
        return;
      }


      this._refTrigger['_scrollToOption'] = this._scrollToOption.bind(this._refTrigger, this.optionHeight, this.panelHeight);
    }

    private _scrollToOption(this: MatAutocompleteTrigger, optionHeight: number, panelHeight: number): void {
      const index = this.autocomplete._keyManager.activeItemIndex || 0;
      const labelCount = _countGroupLabelsBeforeOption(index, this.autocomplete.options,
        this.autocomplete.optionGroups);

      const itemlength = this.autocomplete.options.length - 1;
        console.log(index);
      console.log(itemlength);
      console.log(labelCount);
      if (index === 0 && labelCount === 1) {
        this.autocomplete._setScrollTop(0);
        return
      }  else if (index === 0 && labelCount === 0) {
        this.autocomplete._keyManager.setLastItemActive();
        return
      } else {
        const newScrollPosition = _getOptionScrollPosition(
          index + labelCount,
          optionHeight,
          this.autocomplete._getScrollTop(),
          panelHeight
        );

        this.autocomplete._setScrollTop(newScrollPosition);
      }
  }
}
