export class NgxNumberFormatService {

    private _specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'];

    checkSpecialKey(_event: KeyboardEvent): boolean {
        return this._specialKeys.indexOf(_event.key) !== -1
            || (_event.keyCode === 65 && (_event.ctrlKey || _event.metaKey)) // Allow: Ctrl + A
            || (_event.keyCode === 67 && (_event.ctrlKey || _event.metaKey)) // Allow: Ctrl + C
            || (_event.keyCode === 86 && (_event.ctrlKey || _event.metaKey)) // Allow: Ctrl + V
            || (_event.keyCode === 88 && (_event.ctrlKey || _event.metaKey)); // Allow: Ctrl + X
    }

    checkCursorAtSamePlace(_formElement: HTMLInputElement): boolean {
        return _formElement.selectionStart == _formElement.selectionEnd;
    }

    removeLeadingZero(_value: string): string {
        return Number(_value).toString();
    }

    removeComma(_value: string): string {
        return _value.replace(/,/g, '');
    }

    removeMinusSign(_value: string): string {
        return _value.replace(/-/g, '');
    }

    applyCommaFormat(_value: string): string {
        return _value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    autoFillDecimal(_value: string, _decimal: number, _format: boolean): string {
        _value = Number(this.removeComma(_value)).toFixed(_decimal).toString();
        if (_format) _value = this.applyCommaFormat(_value);
        return _value;
    }

    getRawValue(_value: string): string {
        let returnVal: string;
        if (_value == null || _value.trim() === '') returnVal = '';
        else returnVal = this.removeLeadingZero(this.removeComma(this.getNumericPart(_value))) + this.getDecimalPart(_value);
        return returnVal;
    }

    getNumericPart(_value: string): string {
        let returnVal: string = '';
        let splitValue: string[] = _value.split('.');
        returnVal = splitValue[0];
        return returnVal;
    }

    getDecimalPart(_value: string): string {
        let returnVal: string = '';
        let splitValue: string[] = _value.split('.');
        if (splitValue.length > 1) returnVal = `.${splitValue[1]}`
        return returnVal;
    }

    getLastCharacterFromCursorAtFrontDirection(_formElement: HTMLInputElement): string {
        return _formElement.value.substring(_formElement.selectionStart - 1,_formElement.selectionStart);
    }

    getLastCharacterFromCursorAtBackDirection(_formElement: HTMLInputElement): string {
        return _formElement.value.substring(_formElement.selectionEnd, _formElement.selectionEnd + 1);
    }

    detectComma(_value: string): boolean {
        return _value.indexOf(',') !== -1;
    }

    detectDecimalPoint(_value: string): boolean {
        return _value.indexOf('.') !== -1;
    }

    detectMinusSignOnFirst(_value: string): boolean {
        return _value.indexOf('-') == 0;
    }

}
