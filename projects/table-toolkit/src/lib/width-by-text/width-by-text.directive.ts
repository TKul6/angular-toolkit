import { ANGULAR_TOOLKIT_EMIT_ISSUES } from '../../global-tokens';
import { Directive, ElementRef, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { ANGULAR_TOOLKIT_WIDTH_BY_TEXT_CONFIGURATION, PartialWithByTextConfiguration, WidthByTextConfiguration } from './width-by-text.configuration';
import { DataRefreshStrategy } from './data-refresh-strategy';

@Directive({
  selector: '[atWidthByText]',
  exportAs: 'atWidthByText'
})
export class WidthByTextDirective<T extends object> {


//#region Data members

  private _data: Array<T> = [];
  private _canvas: HTMLCanvasElement = null;
  private _headerText: string = '';
  private _config: WidthByTextConfiguration;

  //#endregion


  // #region Default configuration
  private readonly DEFAULT_CONFIGURATION: WidthByTextConfiguration = {
    font: '14px Roboto',
    headerFont: 'bold 14px Roboto',
    refreshStrategy: DataRefreshStrategy.Ignore,
    paddingLeft: 20,
    paddingRight: 0
  };
  // #endregion


  // #region Properties
  @Input()
  set data(value: Array<T>) {
    this.refreshWidthIfRequired(value);
  }

  @Input('atWidthByText')
  memberName = '';

  @Input()
  transformer: (data: any) => string;

  @Input()
  set headerText(value: string) {
     this._headerText = value;
     this.updateLength();
  }
  // #endregion

  constructor(private element: ElementRef, private renderer: Renderer2,
    @Optional() @Inject(ANGULAR_TOOLKIT_WIDTH_BY_TEXT_CONFIGURATION) config: PartialWithByTextConfiguration,
    @Optional() @Inject(ANGULAR_TOOLKIT_EMIT_ISSUES) private _emitErrors = false) {
if (config) {
this._config = {...this.DEFAULT_CONFIGURATION, ...config};
} else {
this._config = this.DEFAULT_CONFIGURATION;
}

}


// #region Private Methods
private refreshWidthIfRequired(data: Array<T>) {

const isDataCurrentlyEmpty = this._data.length === 0;

this._data = data;

if (isDataCurrentlyEmpty || this._config.refreshStrategy === DataRefreshStrategy.Update) {
this.updateLength();
}

}

private updateLength() {

if (!this.validate()) {
return;
}

const maxLength = this.getMaxLength() + this._config.paddingLeft + this._config.paddingRight;

this.renderer.setStyle(this.element.nativeElement, 'width', `${maxLength}px`);
}

private validate(): boolean {

if (!this._data || this._data.length === 0) {
if (this._emitErrors) {
console.warn(`Can't calculate column width, data is null or empty`);
}
return false;
}
if (!this.memberName || this.memberName === '') {

if (this._emitErrors) {
console.warn(`Can't calculate column width, memberName is not initialized.`);
}
return false;
}

if (!(this.memberName in this._data[0])) {

if (this._emitErrors) {
console.error(`The memberName ${this.memberName} is not a property of the provided data.`);
}
return false;
}

return true;
}

private getMaxLength() {
if (!this._canvas) {
this._canvas = document.createElement('canvas');
}

const textContext = this._canvas.getContext('2d');

textContext.font = this._config.headerFont;

const textsToExamine = this._data.map((item: T) => {

if (this.transformer) {
return this.transformer(item[this.memberName]);
}
return item[this.memberName].toString();
})
.sort((text1: string, text2: string) => text2.length - text1.length)
.slice(0, 5);

let maxLength = Math.round(textContext.measureText(this._headerText).width);

textContext.font = this._config.font;

for (const text of textsToExamine) {

const size = Math.round(textContext.measureText(text).width);

if (size > maxLength) {
maxLength = size;
}
}
return maxLength;
}
// #endregion

}
