import { NgxNumberFormatService } from './ngx-number-format.service';
import { Renderer2 } from '@angular/core';

export class InputHandler {

    private _numberFormatService: NgxNumberFormatService;
    private _onModelChange: Function;
    private _onModelTouched: Function;

    constructor(_formElement: HTMLInputElement, _renderer2: Renderer2 , _format: string) {
        this._numberFormatService = new NgxNumberFormatService(_formElement, _renderer2, _format);
    }

    handleKeyDown(event: KeyboardEvent) {
        this._numberFormatService.manageEventKey(event);
    }

}