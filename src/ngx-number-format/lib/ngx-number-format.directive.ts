import { Directive, forwardRef, OnInit, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputHandler } from './input.handler';

@Directive({
    selector: '[ngxNumberFormat]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxNumberFormatDirective),
            multi: true
        }
    ]
})
export class NgxNumberFormatDirective implements ControlValueAccessor, OnInit {

    private _oldValueForDetectChange: string = null;
    private _oldValue: string = null;
    private _displayValue: string = null;
    private _max: number = 0;
    private _decimal: number = 0;
    private _format: boolean = false;
    private _formElement: HTMLInputElement;
    private _specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'];
    private _regExNumber: RegExp = new RegExp(/^[0-9]*$/g);
    private _regExNumberAndDecimal: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
    private _oldSelectionStart: number = 0;
    private _detectDelete: boolean = false;
    private _detectBackspace: boolean = false;
    private _process: boolean = false;

    public onChange = (_: any) => { };
    public onTouch = () => { };

    @Input('ngxNumberFormat') format: string;
    public inputHandler: InputHandler;

    constructor(private _el: ElementRef, private _renderer: Renderer2) { }

    ngOnInit() {
        this.inputHandler = new InputHandler(this._el.nativeElement, this._renderer , this.format);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.inputHandler.handleKeyDown(event);
    }

    @HostListener('click', ['$event'])
    public onClick(event: Event): void {
        this._oldSelectionStart = this._formElement.selectionStart;
        this._oldValue = this._formElement.value;
        this._oldValueForDetectChange = (<HTMLInputElement>event.target).value;
    }

    @HostListener('input', ['$event'])
    public onInput(event: Event): void {

        let value = (<HTMLInputElement>event.target).value;

        if (this._process) {
            if (value && !String(value).replace(/,/g, '').match(this.getRegEx())) {
                this._formElement.value = '';
            } else {
                if (this._detectBackspace || this._detectDelete) {
                    this._oldSelectionStart = this._formElement.selectionStart - 1;
                    this._oldValue = this._formElement.value;
                }
                this.onValueChange(value);
            }
        }

    }

    @HostListener('blur', ['$event'])
    public onBlur(event: Event): void {
        let value = (<HTMLInputElement>event.target).value;

        if (value.length > 0 && this._decimal > 0) {
            value = value.replace(/,/g, '');
            value = Number(value).toFixed(this._decimal).toString();
            this._formElement.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        this.onTouch();

        // Fix bug on Internet Explorer and Microsoft Edge not fire change event when set value to input element by javascript.
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge && (value != this._oldValueForDetectChange)) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            event.target.dispatchEvent(evt);
        }
    }

    processCursorPosition(_oldValue: string, _oldSelectionStart: number, _newValue: string) {
        let _oldTotalComma = 0;
        let _newTotalComma = 0;
        if (_newValue) {
            _oldValue = _oldValue.substr(0, _oldSelectionStart);
            _oldTotalComma = (_oldValue.match(/,/g) || []).length;
            _newValue = _newValue.substr(0, _oldSelectionStart + 1);
            _newTotalComma = (_newValue.match(/,/g) || []).length;
            this.setCursorAt(_oldSelectionStart + 1 + (_newTotalComma - _oldTotalComma));
        }
    }

    setCursorAt(position: number): void {
        if (this._formElement.setSelectionRange) {
            this._formElement.focus();
            this._formElement.setSelectionRange(position, position);
        }
    }

    writeValue(value: string | number): void {

        let newValue: string = '';
        if (value != null && value !== '') {
            if (typeof(value) === 'string') {
                newValue = value.replace(/,/g, '');
            } else if (typeof(value) === 'number') {
                newValue = value.toString();
            }
        }
        this.onValueChange(newValue, false, false);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState?(value: boolean): void {
        this._formElement.disabled = value;
    }

    private formElementProperty([name, value]: [string, string | boolean]) {
        this._renderer.setProperty(this._formElement, name, value);
    }

    private onValueChange(newValue: string, cursor: boolean = true, triggerChange: boolean = true) {

        if (this._process) {
            let value: string;

            if ((newValue == null) || (newValue.trim() === '')) {
                value = '';
            } else {
                value = newValue.replace(/,/g, '');
                value = this.removeLeadingZero(value);
            }

            if (this._format) {
                this._displayValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                this._displayValue = value;
            }

            this.formElementProperty(['value', this._displayValue]);
            if (triggerChange) this.onChange(value);
            if (cursor) {
                this.processCursorPosition(this._oldValue, this._oldSelectionStart, this._displayValue);
            }
        }
    }

    private removeLeadingZero(value: string): string {
        if (value.indexOf('.') == -1) {
            let convertVal = +value;
            value = convertVal.toString();
        }
        return value;
    }

    private getRegEx(): RegExp {
        return (this._decimal > 0) ? this._regExNumberAndDecimal : this._regExNumber;
    }

}