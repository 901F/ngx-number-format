import { NgxNumberFormatService } from './ngx-number-format.service';
import { Renderer2 } from '@angular/core';

export class InputHandler {

    private _numberFormatService: NgxNumberFormatService;
    private _onModelChange: Function;
    private _onModelTouched: Function;

    private _formElement: HTMLInputElement;
    private _renderer: Renderer2;
    private _triggerBackspace: boolean;
    private _triggerDelete: boolean;

    private _pastSelectionStart: number;
    private _pastValue: string;
    private _pastValueDOM: string;

    
    private _formatComma: boolean;
    private _maxDigit: number;
    private _maxDecimal: number;

    private _regEx: RegExp;
    private _regExNumber: RegExp = new RegExp(/^[0-9]*$/g);
    private _regExNumberAndDecimal: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);


    constructor(_formElement: HTMLInputElement, _renderer: Renderer2) {
        this._numberFormatService = new NgxNumberFormatService();
        this._formElement = _formElement;
        this._renderer = _renderer;
    }

    setFormat(_value: string) {
        this._formatComma = _value.indexOf(',') !== -1;
        this.setMaxDigitAndMaxDecimal(this._numberFormatService.removeComma(_value));
    }

    handleKeyDown(_event: KeyboardEvent) {
        this._triggerBackspace = this.manageBackspaceKey(_event);
        this._triggerDelete = this.manageDeleteKey(_event);
        if (this._numberFormatService.checkSpecialKey(_event)) return;
        if (this.validateByRegEx(_event.key)) this.setPastValue();
        else _event.preventDefault();
    }

    handleClick(_event: Event) {
        this.setPastValue(_event);
    }

    handleInput(_event: Event) {
        let value = (<HTMLInputElement>_event.target).value;

        if (value && !String(value).replace(/,/g, '').match(this._regEx)) {
            this.setFormElementProperty(['value', '']);
        } else {
            if (this._triggerBackspace || this._triggerDelete) {
                this._pastSelectionStart = this._formElement.selectionStart - 1;
                this._pastValue = this._formElement.value;
            }
            this.processCursorPosition(this.applyMask(value));
            this._onModelChange(this._numberFormatService.getRawValue(value));
        }
    }

    handleBlur(_event: Event) {
        let value = (<HTMLInputElement>event.target).value;
        if (value.length > 0) this.setFormElementProperty(['value', this._numberFormatService.autoFillDecimal(value, this._maxDecimal, this._formatComma)]);
        this._onModelTouched();
        if (value != this._pastValueDOM) this.fixBugOnMicrosoftEdgeAndIE(_event);
    }

    handleWriteValue(_value: string | number) {
        if (_value != null && _value !== '') {
            let valStr: string = '';
            if (typeof (_value) === 'string') valStr = this._numberFormatService.removeComma(_value);
            else if (typeof (_value) === 'number') valStr = _value.toString();
            this.applyMask(valStr);
        }
    }

    applyMask(_value: string): string {
        if (_value) {
            _value = this._numberFormatService.getRawValue(_value);
            _value = this._numberFormatService.autoFillDecimal(_value, this._maxDecimal, this._formatComma);
        }
        this.setFormElementProperty(['value', _value]);
        return _value;
    }

    getOnModelChange(): Function {
        return this._onModelChange;
    }

    setOnModelChange(callbackFunction: Function): void {
        this._onModelChange = callbackFunction;
    }

    getOnModelTouched(): Function {
        return this._onModelTouched;
    }

    setOnModelTouched(callbackFunction: Function) {
        this._onModelTouched = callbackFunction;
    }

    private setCursorAt(_position: number) {
        if (this._formElement.setSelectionRange) {
            this._formElement.focus();
            this._formElement.setSelectionRange(_position, _position);
        }
    }

    private processCursorPosition(_value: string) {
        let _pastValue = this._pastValue.substr(0, this._pastSelectionStart);
        let _pastTotalComma = (_pastValue.match(/,/g) || []).length;
        let _newValue = _value.substr(0, this._pastSelectionStart + 1);
        let _newTotalComma = (_newValue.match(/,/g) || []).length;
        this.setCursorAt(this._pastSelectionStart + 1 + (_newTotalComma - _pastTotalComma));
    }

    private setFormElementProperty([name, value]: [string, string | boolean]) {
        this._renderer.setProperty(this._formElement, name, value);
    }

    private manageBackspaceKey(_event: KeyboardEvent): boolean {
        if (_event.key == 'Backspace') {
            let last: string = this._formElement.value.substring(this._formElement.selectionStart - 1, this._formElement.selectionStart);
            if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                this.setCursorAt(this._formElement.selectionStart - 1);
                _event.preventDefault();
            }
            return true;
        }
        return false;
    }

    private manageDeleteKey(_event: KeyboardEvent): boolean {
        if (_event.key == 'Delete') {
            let last: string = this._formElement.value.substring(this._formElement.selectionEnd, this._formElement.selectionEnd + 1);
            if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                this.setCursorAt(this._formElement.selectionEnd + 1);
                _event.preventDefault();
            }
            return true;
        }
        return false;
    }

    private validateByRegEx(_key: string): boolean {
        let current: string = this._formElement.value;
        let firstPart: string = current.substring(0, this._formElement.selectionStart);
        let secondPart: string = current.substring(this._formElement.selectionEnd);
        let next: string = (firstPart.concat(_key) + secondPart).replace(/,/g, '');

        let value = next.split('.');
        if (next && !String(next).match(this._regEx) || (value[0].length > this._maxDigit && this._formElement.selectionStart == this._formElement.selectionEnd) || (this._maxDecimal > 0 && value.length == 2 && (value[1].length > this._maxDecimal && this._formElement.selectionStart == this._formElement.selectionEnd))) {
            return false
        }
        return true;
    }

    private setPastValue(_event?: Event) {
        this._pastSelectionStart = this._formElement.selectionStart;
        this._pastValue = this._formElement.value;
        if (_event) this._pastValueDOM = (<HTMLInputElement>_event.target).value;
    }

    private setMaxDigitAndMaxDecimal(_value: string) {
        if (_value.indexOf('.') !== -1) {
            let splitValue: string[] = _value.split('.');
            this._maxDigit = splitValue[0].length;
            this._maxDecimal = splitValue[1].length;
            this._regEx = this._regExNumberAndDecimal;
        } else {
            this._maxDecimal = null;
            this._maxDigit = _value.length;
            this._regEx = this._regExNumber;
        }
    }

    private fixBugOnMicrosoftEdgeAndIE(_event: Event) {
        // Fix bug on Internet Explorer and Microsoft Edge not fire change event when set value to input element by javascript.
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            _event.target.dispatchEvent(evt);
        }
    }

}