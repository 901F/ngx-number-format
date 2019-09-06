import { Renderer2 } from '@angular/core';

export class NgxNumberFormatService {

    private _formElement: HTMLInputElement;
    private _triggerBackspace: boolean;
    private _triggerDelete: boolean;
    private _specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'];
    private _renderer2: Renderer2;

    private _formatComma: boolean;
    private _maxDigit: number;
    private _maxDecimal: number;

    private _regEx: RegExp;
    private _regExNumber: RegExp = new RegExp(/^[0-9]*$/g);
    private _regExNumberAndDecimal: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

    private _pastSelectionStart: number;
    private _pastValue: string;

    constructor(_el: HTMLInputElement, _renderer2: Renderer2 , _format: string) {
        this._formElement = _el;
        this._renderer2 = _renderer2;
        this.setFormat(_format);
    }

    manageEventKey(event: KeyboardEvent) {

        this._triggerBackspace = this.manageBackspaceKey(event);
        this._triggerDelete = this.manageDeleteKey(event);

        if (this.manageSpecialKey(event)) return;

        if (!this.validateByRegEx(event.key)) event.preventDefault();
    }

    setCursorAt(position: number): void {
        if (this._formElement.setSelectionRange) {
            this._formElement.focus();
            this._formElement.setSelectionRange(position, position);
        }
    }

    private manageBackspaceKey(event: KeyboardEvent): boolean {
        if (event.key == 'Backspace') {
            let last: string = this._formElement.value.substring(this._formElement.selectionStart - 1, this._formElement.selectionStart);
            if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                this.setCursorAt(this._formElement.selectionStart - 1);
                event.preventDefault();
            }
            return true;
        }
        return false;
    }

    private manageDeleteKey(event: KeyboardEvent): boolean {
        if (event.key == 'Delete') {
            let last: string = this._formElement.value.substring(this._formElement.selectionEnd, this._formElement.selectionEnd + 1);
            if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                this.setCursorAt(this._formElement.selectionEnd + 1);
                event.preventDefault();
            }
            return true;
        }
        return false;
    }

    private manageSpecialKey(event: KeyboardEvent): boolean {
        return this._specialKeys.indexOf(event.key) !== -1
            || (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + A
            || (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + C
            || (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + V
            || (event.keyCode === 88 && (event.ctrlKey || event.metaKey)); // Allow: Ctrl + X
    }

    private validateByRegEx(key: string): boolean {
        let current: string = this._formElement.value;
        let firstPart: string = current.substring(0, this._formElement.selectionStart);
        let secondPart: string = current.substring(this._formElement.selectionEnd);
        let next: string = (firstPart.concat(key) + secondPart).replace(/,/g, '');

        let value = next.split('.');
        if (next && !String(next).match(this._regEx) || (value[0].length > this._maxDigit && this._formElement.selectionStart == this._formElement.selectionEnd) || (this._maxDecimal > 0 && value.length == 2 && (value[1].length > this._maxDecimal && this._formElement.selectionStart == this._formElement.selectionEnd))) {
            return false
        }
        this._pastSelectionStart = this._formElement.selectionStart;
        this._pastValue = this._formElement.value;
        return true;
    }

    private setFormat(_value: string) {
        this._formatComma = _value.indexOf(',') !== -1;
        this.findMaxDigitAndMaxDecimal(_value.replace(/,/g, ''));
    }

    private findMaxDigitAndMaxDecimal(_value: string) {
        if (_value.indexOf('.') !== -1) {
            let splitValue: string[] = _value.split('.');
            this._maxDigit = splitValue[0].length;
            this._maxDecimal = splitValue[1].length;
            this._regEx = this._regExNumberAndDecimal;
        } else {
            this._maxDigit = _value.length;
            this._regEx = this._regExNumber;
        }
    }

}
