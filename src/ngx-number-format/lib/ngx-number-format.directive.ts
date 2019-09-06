import { Directive, forwardRef, ElementRef, Input, HostListener, Renderer2, DoCheck } from '@angular/core';
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
export class NgxNumberFormatDirective implements ControlValueAccessor {

    private inputHandler: InputHandler;

    constructor(private _el: ElementRef, private _renderer: Renderer2) {
        this.inputHandler = new InputHandler(this._el.nativeElement, this._renderer);
    }

    @Input('ngxNumberFormat')
    public set initialize(_format: string) {
        this.inputHandler.setFormat(_format);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(_event: KeyboardEvent) {
        this.inputHandler.handleKeyDown(_event);
    }

    @HostListener('click', ['$event'])
    onClick(_event: Event) {
        this.inputHandler.handleClick(_event);
    }

    @HostListener('input', ['$event'])
    onInput(_event: Event): void {
        this.inputHandler.handleInput(_event);
    }

    @HostListener('blur', ['$event'])
    onBlur(_event: Event): void {
        this.inputHandler.handleBlur(_event);
    }

    writeValue(_value: string | number): void {
        this.inputHandler.handleWriteValue(_value);
    }

    registerOnChange(_cb: Function): void {
        this.inputHandler.setOnModelChange(_cb);
    }

    registerOnTouched(_cb: Function): void {
        this.inputHandler.setOnModelTouched(_cb);
    }

    setDisabledState?(value: boolean): void {
        this._el.nativeElement.disabled = value;
    }

}