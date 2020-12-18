import { NgxNumberFormatService } from './ngx-number-format.service';
import { Renderer2 } from '@angular/core';

export class InputHandler {

    private _nfs: NgxNumberFormatService;
    private _onModelChange: Function;
    private _onModelTouched: Function;

    private _formElement: HTMLInputElement;
    private _renderer: Renderer2;
    private _triggerBackspace: boolean;
    private _triggerDelete: boolean;

    private _pastSelectionStart: number;
    private _pastValue: string;
    private _pastValueDOM: string;

    private _rawFormat: string;
    private _formatComma: boolean;
    private _maxDigit: number;
    private _maxDecimal: number;
    private _allowNegative: boolean = false;

    private _regEx: RegExp;
    private _regExNumber: RegExp = new RegExp(/^[0-9]*$/g);
    private _regExNumberAndDecimal: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
    private _regExNumberForNegative: RegExp = new RegExp(/^-?[0-9]*$/g);
    private _regExNumberAndDecimalForNegative: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);

    constructor(_formElement: HTMLInputElement, _renderer: Renderer2) {
        this._nfs = new NgxNumberFormatService();
        this._formElement = _formElement;
        this._renderer = _renderer;
    }

    setFormat(_value: string) {
        this._rawFormat = _value;
        this._formatComma = this._nfs.detectComma(_value);
        this.setMaxDigitAndMaxDecimal(this._nfs.removeComma(_value));
    }

    setAllowNegative(_value: boolean) {
        this._allowNegative = _value;
        this.setMaxDigitAndMaxDecimal(this._nfs.removeComma(this._rawFormat));
    }

    handleKeyDown(_event: KeyboardEvent) {
        if (_event.key != ',' && _event.key != '-') {
            this._triggerBackspace = this.manageBackspaceKey(_event);
            this._triggerDelete = this.manageDeleteKey(_event);
            if (this._nfs.checkSpecialKey(_event)) return;
            if (_event.key == '.' && this._nfs.getLastCharacterFromCursorAtBackDirection(this._formElement) == '.' && this._nfs.checkCursorAtSamePlace(this._formElement)) {
                this.setCursorAt(this._formElement.selectionEnd + 1);
                _event.preventDefault();
                return;
            }
            if (this.validateByRegEx(_event.key)) {
                this.setPastValue();
                if (
                    ((this._formElement.selectionStart == 0 && this._formElement.selectionEnd == 0) || (this._formElement.selectionStart == 1 && this._formElement.selectionEnd == 1)) && this._nfs.getNumericPart(this._nfs.getRawValue(this._formElement.value)) == '0') {
                    _event.preventDefault();
                    this.processFirstNumberWhenValueAtZero(_event);
                } else if (this._nfs.checkCursorAtSamePlace(this._formElement) && this._nfs.detectDecimalPoint(this._formElement.value.substring(0, this._formElement.selectionStart)) && this._nfs.detectDecimalPoint(this._formElement.value) && this._formElement.selectionStart < this._formElement.value.length) {
                    _event.preventDefault();
                    this.processDecimalValue(_event);
                }
            } else {
                _event.preventDefault();
            }
        } else if (_event.key == '-' && this._allowNegative) {
            if (!this._formElement.value) {
                this.setFormElementProperty(['value', '-']);
            } else if (this._formElement.selectionStart == 0 && this._formElement.selectionEnd == this._formElement.value.length) {
                this.setFormElementProperty(['value', '-']);
                this._onModelChange('');
            } else if (this._nfs.checkCursorAtSamePlace(this._formElement) && this._formElement.selectionStart == 0 && !this._nfs.detectMinusSignOnFirst(this._formElement.value)) {
                let value = '-' + this._formElement.value;
                this.applyMask(value);
                this._onModelChange(this._nfs.getRawValue(value));
                this.setCursorAt(1);
            }
            _event.preventDefault();
        } else {
            _event.preventDefault();
        }
    }

    handleClick(_event: Event) {
        this.setPastValue(_event);
    }

    handleInput(_event: Event) {
        let value = (<HTMLInputElement>_event.target).value;
        if ((value && !Number(this._nfs.removeComma(value)).toString().match(this._regEx)) || value.substr(0, 2) == '-0' || value.substr(0, 2) == '-.') {
            this.setFormElementProperty(['value', '']);
            this._onModelChange('');
        } else {
            if (this._triggerBackspace || this._triggerDelete) {
                this._pastSelectionStart = this._formElement.selectionStart - 1;
                this._pastValue = this._formElement.value;
            }
            this.processCursorPosition(this.applyMask(value));
            this._onModelChange(this._nfs.getRawValue(value));
        }
    }

    handleBlur(_event: Event) {
        let value = (<HTMLInputElement>event.target).value;
        if (value.length > 0 && value != '-') {
            this.setFormElementProperty(['value', this._nfs.autoFillDecimal(value, this._maxDecimal, this._formatComma)]);
        } else if (value == '-') {
            this.setFormElementProperty(['value', '']);
        }
        this._onModelTouched();
        if (value != this._pastValueDOM) this.fixBugOnMicrosoftEdgeAndIE(_event);
    }

    handleWriteValue(_value: string | number) {
        if (_value != null && _value !== '') {
            let valStr: string = '';
            if (typeof (_value) === 'string') valStr = this._nfs.removeComma(_value);
            else if (typeof (_value) === 'number') valStr = _value.toString();
            this.applyMask(valStr);
        } else if (typeof(_value) == 'object' || typeof(_value) == 'string') {
            this.setFormElementProperty(['value', _value]);
        }
    }

    applyMask(_value: string): string {
        if (_value) {
            _value = this._nfs.getRawValue(_value);
            _value = this._nfs.autoFillDecimal(_value, this._maxDecimal, this._formatComma);
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
            let char: string = this._nfs.getLastCharacterFromCursorAtFrontDirection(this._formElement);
            if (this._nfs.checkCursorAtSamePlace(this._formElement) && (char == ',' || char == '.')) {
                this.setCursorAt(this._formElement.selectionStart - 1);
                _event.preventDefault();
            }
            return true;
        }
        return false;
    }

    private manageDeleteKey(_event: KeyboardEvent): boolean {
        if (_event.key == 'Delete') {
            let char: string = this._nfs.getLastCharacterFromCursorAtBackDirection(this._formElement);
            if (this._nfs.checkCursorAtSamePlace(this._formElement) && (char == ',' || char == '.')) {
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
        if (this._allowNegative && this._nfs.detectMinusSignOnFirst(firstPart)) firstPart = this._nfs.removeMinusSign(firstPart);
        let positionForSecondPart: number = (this._nfs.detectDecimalPoint(current) && this._nfs.detectDecimalPoint(firstPart)) ? this._formElement.selectionEnd + 1 : this._formElement.selectionEnd;
        let secondPart: string = current.substring(positionForSecondPart);
        let next: string = this._nfs.removeComma(firstPart.concat(_key) + secondPart);

        let value = next.split('.');
        let minusSign: boolean = this._allowNegative && _key == '-' && this._formElement.selectionStart == 0 && this._formElement.selectionEnd == 0 && !this._nfs.detectMinusSignOnFirst(current);
        if ((next && !String(next).match(this._regEx) || 
        (value[0].length > this._maxDigit && this._formElement.selectionStart == this._formElement.selectionEnd) || (this._maxDecimal > 0 && value.length == 2 && (value[1].length > this._maxDecimal && this._formElement.selectionStart == this._formElement.selectionEnd))) && !minusSign) {
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
        if (this._nfs.detectDecimalPoint(_value)) {
            let splitValue: string[] = _value.split('.');
            this._maxDigit = splitValue[0].length;
            this._maxDecimal = splitValue[1].length;
            this._regEx = (!this._allowNegative) ? this._regExNumberAndDecimal : this._regExNumberAndDecimalForNegative;
        } else {
            this._maxDecimal = null;
            this._maxDigit = _value.length;
            this._regEx = (!this._allowNegative) ? this._regExNumber : this._regExNumberForNegative;
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

    private processFirstNumberWhenValueAtZero(_event: KeyboardEvent) {
        let newValue: string = _event.key + this._nfs.getDecimalPart(this._formElement.value);
        this.setFormElementProperty(['value', newValue]);
        this._onModelChange(newValue);
        this.setCursorAt(1);
    }

    private processDecimalValue(_event: KeyboardEvent) {
        let selectionStart: number = this._formElement.selectionStart;
        let newValue: string = this._formElement.value.substring(0, selectionStart) + _event.key + this._formElement.value.substring(selectionStart + 1);
        this.setFormElementProperty(['value', newValue]);
        this._onModelChange(this._nfs.getRawValue(newValue));
        this.setCursorAt(selectionStart + 1);
    }

}