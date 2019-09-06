export class NgxNumberFormatService {

    private _specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'];

    checkSpecialKey(_event: KeyboardEvent): boolean {
        return this._specialKeys.indexOf(_event.key) !== -1
            || (_event.keyCode === 65 && (_event.ctrlKey || _event.metaKey)) // Allow: Ctrl + A
            || (_event.keyCode === 67 && (_event.ctrlKey || _event.metaKey)) // Allow: Ctrl + C
            || (_event.keyCode === 86 && (_event.ctrlKey || _event.metaKey)) // Allow: Ctrl + V
            || (_event.keyCode === 88 && (_event.ctrlKey || _event.metaKey)); // Allow: Ctrl + X
    }

    removeLeadingZero(_value: string): string {
        return Number(_value).toString();
    }

    removeComma(_value: string): string {
        return _value.replace(/,/g, '');
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
        if (_value == null || _value.trim() === '') _value = '';
        else _value = this.removeLeadingZero(this.removeComma(_value));
        return _value;
    }

}
