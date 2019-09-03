/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, forwardRef, ElementRef, Input, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export class NgxNumberFormatDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this._oldValueForDetectChange = null;
        this._oldValue = null;
        this._displayValue = null;
        this._max = 0;
        this._decimal = 0;
        this._format = false;
        this._specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'];
        this._regExNumber = new RegExp(/^[0-9]*$/g);
        this._regExNumberAndDecimal = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
        this._oldSelectionStart = 0;
        this._detectDelete = false;
        this._detectBackspace = false;
        this._detectSelectAll = false;
        this._process = false;
        this.onChange = (/**
         * @param {?} _
         * @return {?}
         */
        (_) => { });
        this.onTouch = (/**
         * @return {?}
         */
        () => { });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._formElement = this.el.nativeElement;
    }
    /**
     * @param {?} _value
     * @return {?}
     */
    set initialize(_value) {
        this.setFormat(_value);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyDown(event) {
        if (this._process) {
            if (event.key == 'Backspace') {
                this._detectBackspace = true;
                /** @type {?} */
                let last = this._formElement.value.substring(this._formElement.selectionStart - 1, this._formElement.selectionStart);
                if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                    this.setCursorAt(this._formElement.selectionStart - 1);
                    event.preventDefault();
                }
            }
            else {
                this._detectBackspace = false;
            }
            if (event.key == 'Delete') {
                this._detectDelete = true;
                /** @type {?} */
                let last = this._formElement.value.substring(this._formElement.selectionEnd, this._formElement.selectionEnd + 1);
                if (this._formElement.selectionStart == this._formElement.selectionEnd && last == ',') {
                    this.setCursorAt(this._formElement.selectionEnd + 1);
                    event.preventDefault();
                }
            }
            else {
                this._detectDelete = false;
            }
            if (this._specialKeys.indexOf(event.key) !== -1
                || (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + A
                || (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + C
                || (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + V
                || (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) // Allow: Ctrl + X
            ) {
                return;
            }
            /** @type {?} */
            let current = this.el.nativeElement.value;
            /** @type {?} */
            let firstPart = current.substring(0, this._formElement.selectionStart);
            /** @type {?} */
            let secondPart = current.substring(this._formElement.selectionEnd);
            /** @type {?} */
            let next = (firstPart.concat(event.key) + secondPart).replace(/,/g, '');
            /** @type {?} */
            let regEx = this.getRegEx();
            /** @type {?} */
            let value = next.split('.');
            if (next && !String(next).match(regEx) || (value[0].length > this._max && this._formElement.selectionStart == this._formElement.selectionEnd) || (this._decimal > 0 && value.length == 2 && (value[1].length > this._decimal && this._formElement.selectionStart == this._formElement.selectionEnd))) {
                event.preventDefault();
            }
            else {
                this._oldSelectionStart = this._formElement.selectionStart;
                this._oldValue = this._formElement.value;
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onClick(event) {
        this._oldSelectionStart = this._formElement.selectionStart;
        this._oldValue = this._formElement.value;
        this._oldValueForDetectChange = event.target.value;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onInput(event) {
        /** @type {?} */
        let value = event.target.value;
        if (this._process) {
            if (value && !String(value).replace(/,/g, '').match(this.getRegEx())) {
                this._formElement.value = '';
            }
            else {
                if (this._detectBackspace || this._detectDelete) {
                    this._oldSelectionStart = this._formElement.selectionStart - 1;
                    this._oldValue = this._formElement.value;
                }
                this.onValueChange(value);
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onBlur(event) {
        /** @type {?} */
        let value = event.target.value;
        if (value.length > 0 && this._decimal > 0) {
            value = value.replace(/,/g, '');
            value = Number(value).toFixed(this._decimal).toString();
            this._formElement.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        this.onTouch();
        // Fix bug on Internet Explorer and Microsoft Edge not fire change event when set value to input element by javascript.
        /** @type {?} */
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge && (value != this._oldValueForDetectChange)) {
            /** @type {?} */
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            event.target.dispatchEvent(evt);
        }
    }
    /**
     * @param {?} _oldValue
     * @param {?} _oldSelectionStart
     * @param {?} _newValue
     * @return {?}
     */
    processCursorPosition(_oldValue, _oldSelectionStart, _newValue) {
        /** @type {?} */
        let _oldTotalComma = 0;
        /** @type {?} */
        let _newTotalComma = 0;
        if (_newValue) {
            _oldValue = _oldValue.substr(0, _oldSelectionStart);
            _oldTotalComma = (_oldValue.match(/,/g) || []).length;
            _newValue = _newValue.substr(0, _oldSelectionStart + 1);
            _newTotalComma = (_newValue.match(/,/g) || []).length;
            this.setCursorAt(_oldSelectionStart + 1 + (_newTotalComma - _oldTotalComma));
        }
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setCursorAt(position) {
        if (this._formElement.setSelectionRange) {
            this._formElement.focus();
            this._formElement.setSelectionRange(position, position);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value != null && value != '') {
            if (typeof (value) === 'string') {
                value = value.replace(/,/g, '');
            }
            else {
                value = value.toString();
            }
        }
        this.onValueChange(value, false);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setDisabledState(value) {
        this._formElement.disabled = value;
    }
    /**
     * @private
     * @param {?} newValue
     * @param {?=} cursor
     * @return {?}
     */
    onValueChange(newValue, cursor = true) {
        if (newValue !== this._displayValue && this._process) {
            /** @type {?} */
            let value;
            if ((newValue == null) || (newValue.trim() === '')) {
                value = '';
            }
            else {
                value = newValue.replace(/,/g, '');
                value = this.removeLeadingZero(value);
            }
            if (this._format) {
                this._displayValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            else {
                this._displayValue = value;
            }
            this._formElement.value = this._displayValue;
            this.onChange(value);
            if (cursor) {
                this.processCursorPosition(this._oldValue, this._oldSelectionStart, this._displayValue);
            }
        }
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    removeLeadingZero(value) {
        if (value.indexOf('.') == -1) {
            /** @type {?} */
            let convertVal = +value;
            value = convertVal.toString();
        }
        return value;
    }
    /**
     * @private
     * @return {?}
     */
    getRegEx() {
        return (this._decimal > 0) ? this._regExNumberAndDecimal : this._regExNumber;
    }
    /**
     * @private
     * @param {?} _value
     * @return {?}
     */
    setFormat(_value) {
        if (_value) {
            this._process = true;
        }
        else {
            this._process = false;
        }
        if (_value.indexOf(',') !== -1) {
            this._format = true;
        }
        else {
            this._format = false;
        }
        _value = _value.replace(/,/g, '');
        /** @type {?} */
        let data = _value.split('.');
        if (data.length == 1) {
            this._max = data[0].length;
        }
        else if (data.length == 2) {
            this._max = data[0].length;
            this._decimal = data[1].length;
        }
    }
}
NgxNumberFormatDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxNumberFormat]',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => NgxNumberFormatDirective)),
                        multi: true
                    }
                ]
            },] }
];
/** @nocollapse */
NgxNumberFormatDirective.ctorParameters = () => [
    { type: ElementRef }
];
NgxNumberFormatDirective.propDecorators = {
    initialize: [{ type: Input, args: ['ngxNumberFormat',] }],
    onKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }],
    onInput: [{ type: HostListener, args: ['input', ['$event'],] }],
    onBlur: [{ type: HostListener, args: ['blur', ['$event'],] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._oldValueForDetectChange;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._oldValue;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._displayValue;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._max;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._decimal;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._format;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._formElement;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._specialKeys;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._regExNumber;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._regExNumberAndDecimal;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._oldSelectionStart;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._detectDelete;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._detectBackspace;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._detectSelectAll;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype._process;
    /** @type {?} */
    NgxNumberFormatDirective.prototype.onChange;
    /** @type {?} */
    NgxNumberFormatDirective.prototype.onTouch;
    /**
     * @type {?}
     * @private
     */
    NgxNumberFormatDirective.prototype.el;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW51bWJlci1mb3JtYXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW51bWJlci1mb3JtYXQvIiwic291cmNlcyI6WyJsaWIvbmd4LW51bWJlci1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxVQUFVLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFZekUsTUFBTSxPQUFPLHdCQUF3Qjs7OztJQXFCakMsWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFuQjFCLDZCQUF3QixHQUFXLElBQUksQ0FBQztRQUN4QyxjQUFTLEdBQVcsSUFBSSxDQUFDO1FBQ3pCLGtCQUFhLEdBQVcsSUFBSSxDQUFDO1FBQzdCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLGlCQUFZLEdBQWtCLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEksaUJBQVksR0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMvQywyQkFBc0IsR0FBVyxJQUFJLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3hFLHVCQUFrQixHQUFXLENBQUMsQ0FBQztRQUMvQixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFFM0IsYUFBUTs7OztR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QkFBbUI7Z0JBQzdCLFNBQVMsRUFBRTtvQkFDUDt3QkFDSSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVTs7O3dCQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixFQUFDO3dCQUN2RCxLQUFLLEVBQUUsSUFBSTtxQkFDZDtpQkFDSjthQUNKOzs7O1lBWnVDLFVBQVU7Ozt5QkF3QzdDLEtBQUssU0FBQyxpQkFBaUI7d0JBS3ZCLFlBQVksU0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7c0JBc0RsQyxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO3NCQU9oQyxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO3FCQWtCaEMsWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzs7Ozs7OztJQTdHaEMsNERBQWdEOzs7OztJQUNoRCw2Q0FBaUM7Ozs7O0lBQ2pDLGlEQUFxQzs7Ozs7SUFDckMsd0NBQXlCOzs7OztJQUN6Qiw0Q0FBNkI7Ozs7O0lBQzdCLDJDQUFpQzs7Ozs7SUFDakMsZ0RBQXVDOzs7OztJQUN2QyxnREFBZ0o7Ozs7O0lBQ2hKLGdEQUF1RDs7Ozs7SUFDdkQsMERBQWdGOzs7OztJQUNoRixzREFBdUM7Ozs7O0lBQ3ZDLGlEQUF1Qzs7Ozs7SUFDdkMsb0RBQTBDOzs7OztJQUMxQyxvREFBMEM7Ozs7O0lBQzFDLDRDQUFrQzs7SUFFbEMsNENBQWtDOztJQUNsQywyQ0FBMkI7Ozs7O0lBRWYsc0NBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBPbkluaXQsIEVsZW1lbnRSZWYsIElucHV0LCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbbmd4TnVtYmVyRm9ybWF0XScsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4TnVtYmVyRm9ybWF0RGlyZWN0aXZlKSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neE51bWJlckZvcm1hdERpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQge1xuXG4gICAgcHJpdmF0ZSBfb2xkVmFsdWVGb3JEZXRlY3RDaGFuZ2U6IHN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfb2xkVmFsdWU6IHN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfZGlzcGxheVZhbHVlOiBzdHJpbmcgPSBudWxsO1xuICAgIHByaXZhdGUgX21heDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9kZWNpbWFsOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX2Zvcm1hdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2Zvcm1FbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgX3NwZWNpYWxLZXlzOiBBcnJheTxzdHJpbmc+ID0gWydCYWNrc3BhY2UnLCAnVGFiJywgJ0VuZCcsICdIb21lJywgJ0Fycm93VXAnLCAnQXJyb3dEb3duJywgJ0Fycm93TGVmdCcsICdBcnJvd1JpZ2h0JywgJ0VudGVyJywgJ0RlbGV0ZSddO1xuICAgIHByaXZhdGUgX3JlZ0V4TnVtYmVyOiBSZWdFeHAgPSBuZXcgUmVnRXhwKC9eWzAtOV0qJC9nKTtcbiAgICBwcml2YXRlIF9yZWdFeE51bWJlckFuZERlY2ltYWw6IFJlZ0V4cCA9IG5ldyBSZWdFeHAoL15bMC05XSsoXFwuWzAtOV0qKXswLDF9JC9nKTtcbiAgICBwcml2YXRlIF9vbGRTZWxlY3Rpb25TdGFydDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIF9kZXRlY3REZWxldGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9kZXRlY3RCYWNrc3BhY2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9kZXRlY3RTZWxlY3RBbGw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9wcm9jZXNzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7IH07XG4gICAgcHVibGljIG9uVG91Y2ggPSAoKSA9PiB7IH07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7IH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLl9mb3JtRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ25neE51bWJlckZvcm1hdCcpXG4gICAgcHVibGljIHNldCBpbml0aWFsaXplKF92YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0Rm9ybWF0KF92YWx1ZSk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gICAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Byb2Nlc3MpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gJ0JhY2tzcGFjZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRlY3RCYWNrc3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBsYXN0OiBzdHJpbmcgPSB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZS5zdWJzdHJpbmcodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgLSAxLCB0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0ID09IHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvbkVuZCAmJiBsYXN0ID09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEN1cnNvckF0KHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRlY3RCYWNrc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gJ0RlbGV0ZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRlY3REZWxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBsYXN0OiBzdHJpbmcgPSB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZS5zdWJzdHJpbmcodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kLCB0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25FbmQgKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT0gdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kICYmIGxhc3QgPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yQXQodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXRlY3REZWxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGVjaWFsS2V5cy5pbmRleE9mKGV2ZW50LmtleSkgIT09IC0xXG4gICAgICAgICAgICAgICAgfHwgKGV2ZW50LmtleUNvZGUgPT09IDY1ICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKSAvLyBBbGxvdzogQ3RybCArIEFcbiAgICAgICAgICAgICAgICB8fCAoZXZlbnQua2V5Q29kZSA9PT0gNjcgJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpIC8vIEFsbG93OiBDdHJsICsgQ1xuICAgICAgICAgICAgICAgIHx8IChldmVudC5rZXlDb2RlID09PSA4NiAmJiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSkgLy8gQWxsb3c6IEN0cmwgKyBWXG4gICAgICAgICAgICAgICAgfHwgKGV2ZW50LmtleUNvZGUgPT09IDg4ICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKSAvLyBBbGxvdzogQ3RybCArIFhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIGxldCBjdXJyZW50OiBzdHJpbmcgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICBsZXQgZmlyc3RQYXJ0OiBzdHJpbmcgPSBjdXJyZW50LnN1YnN0cmluZygwLCB0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICBsZXQgc2Vjb25kUGFydDogc3RyaW5nID0gY3VycmVudC5zdWJzdHJpbmcodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgIGxldCBuZXh0OiBzdHJpbmcgPSAoZmlyc3RQYXJ0LmNvbmNhdChldmVudC5rZXkpICsgc2Vjb25kUGFydCkucmVwbGFjZSgvLC9nLCAnJyk7XG4gICAgXG4gICAgICAgICAgICBsZXQgcmVnRXggPSB0aGlzLmdldFJlZ0V4KCk7XG4gICAgXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBuZXh0LnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiAobmV4dCAmJiAhU3RyaW5nKG5leHQpLm1hdGNoKHJlZ0V4KSB8fCAodmFsdWVbMF0ubGVuZ3RoID4gdGhpcy5fbWF4ICYmIHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0ID09IHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvbkVuZCkgfHwgKHRoaXMuX2RlY2ltYWwgPiAwICYmIHZhbHVlLmxlbmd0aCA9PSAyICYmICh2YWx1ZVsxXS5sZW5ndGggPiB0aGlzLl9kZWNpbWFsICYmIHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0ID09IHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvbkVuZCkpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2xkU2VsZWN0aW9uU3RhcnQgPSB0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbGRWYWx1ZSA9IHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uQ2xpY2soZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb2xkU2VsZWN0aW9uU3RhcnQgPSB0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgdGhpcy5fb2xkVmFsdWUgPSB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZTtcbiAgICAgICAgdGhpcy5fb2xkVmFsdWVGb3JEZXRlY3RDaGFuZ2UgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignaW5wdXQnLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBvbklucHV0KGV2ZW50KTogdm9pZCB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fcHJvY2Vzcykge1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmICFTdHJpbmcodmFsdWUpLnJlcGxhY2UoLywvZywgJycpLm1hdGNoKHRoaXMuZ2V0UmVnRXgoKSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGV0ZWN0QmFja3NwYWNlIHx8IHRoaXMuX2RldGVjdERlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbGRTZWxlY3Rpb25TdGFydCA9IHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb2xkVmFsdWUgPSB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignYmx1cicsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uQmx1cihldmVudCk6IHZvaWQge1xuICAgICAgICBsZXQgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDAgJiYgdGhpcy5fZGVjaW1hbCA+IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvLC9nLCAnJyk7XG4gICAgICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSkudG9GaXhlZCh0aGlzLl9kZWNpbWFsKS50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy5fZm9ybUVsZW1lbnQudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblRvdWNoKCk7XG5cbiAgICAgICAgLy8gRml4IGJ1ZyBvbiBJbnRlcm5ldCBFeHBsb3JlciBhbmQgTWljcm9zb2Z0IEVkZ2Ugbm90IGZpcmUgY2hhbmdlIGV2ZW50IHdoZW4gc2V0IHZhbHVlIHRvIGlucHV0IGVsZW1lbnQgYnkgamF2YXNjcmlwdC5cbiAgICAgICAgbGV0IGlzSUVPckVkZ2UgPSAvbXNpZVxcc3x0cmlkZW50XFwvfGVkZ2VcXC8vaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgaWYgKGlzSUVPckVkZ2UgJiYgKHZhbHVlICE9IHRoaXMuX29sZFZhbHVlRm9yRGV0ZWN0Q2hhbmdlKSkge1xuICAgICAgICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKTtcbiAgICAgICAgICAgIGV2dC5pbml0RXZlbnQoXCJjaGFuZ2VcIiwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb2Nlc3NDdXJzb3JQb3NpdGlvbihfb2xkVmFsdWU6IHN0cmluZywgX29sZFNlbGVjdGlvblN0YXJ0OiBudW1iZXIsIF9uZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBfb2xkVG90YWxDb21tYSA9IDA7XG4gICAgICAgIGxldCBfbmV3VG90YWxDb21tYSA9IDA7XG4gICAgICAgIGlmIChfbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIF9vbGRWYWx1ZSA9IF9vbGRWYWx1ZS5zdWJzdHIoMCwgX29sZFNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIF9vbGRUb3RhbENvbW1hID0gKF9vbGRWYWx1ZS5tYXRjaCgvLC9nKSB8fCBbXSkubGVuZ3RoO1xuICAgICAgICAgICAgX25ld1ZhbHVlID0gX25ld1ZhbHVlLnN1YnN0cigwLCBfb2xkU2VsZWN0aW9uU3RhcnQgKyAxKTtcbiAgICAgICAgICAgIF9uZXdUb3RhbENvbW1hID0gKF9uZXdWYWx1ZS5tYXRjaCgvLC9nKSB8fCBbXSkubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JBdChfb2xkU2VsZWN0aW9uU3RhcnQgKyAxICsgKF9uZXdUb3RhbENvbW1hIC0gX29sZFRvdGFsQ29tbWEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvckF0KHBvc2l0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1FbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5fZm9ybUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UocG9zaXRpb24sIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8sL2csICcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlKHZhbHVlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Ub3VjaCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGU/KHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2Zvcm1FbGVtZW50LmRpc2FibGVkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblZhbHVlQ2hhbmdlKG5ld1ZhbHVlOiBzdHJpbmcsIGN1cnNvcjogYm9vbGVhbiA9IHRydWUpIHtcblxuICAgICAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc3BsYXlWYWx1ZSAmJiB0aGlzLl9wcm9jZXNzKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWU7XG5cbiAgICAgICAgICAgIGlmICgobmV3VmFsdWUgPT0gbnVsbCkgfHwgKG5ld1ZhbHVlLnRyaW0oKSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuZXdWYWx1ZS5yZXBsYWNlKC8sL2csICcnKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVtb3ZlTGVhZGluZ1plcm8odmFsdWUpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9mb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwbGF5VmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIixcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgdGhpcy5fZm9ybUVsZW1lbnQudmFsdWUgPSB0aGlzLl9kaXNwbGF5VmFsdWU7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChjdXJzb3IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NDdXJzb3JQb3NpdGlvbih0aGlzLl9vbGRWYWx1ZSwgdGhpcy5fb2xkU2VsZWN0aW9uU3RhcnQsIHRoaXMuX2Rpc3BsYXlWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUxlYWRpbmdaZXJvKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAodmFsdWUuaW5kZXhPZignLicpID09IC0xKSB7XG4gICAgICAgICAgICBsZXQgY29udmVydFZhbCA9ICt2YWx1ZTtcbiAgICAgICAgICAgIHZhbHVlID0gY29udmVydFZhbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJlZ0V4KCk6IFJlZ0V4cCB7XG4gICAgICAgIHJldHVybiAodGhpcy5fZGVjaW1hbCA+IDApID8gdGhpcy5fcmVnRXhOdW1iZXJBbmREZWNpbWFsIDogdGhpcy5fcmVnRXhOdW1iZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRGb3JtYXQoX3ZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAoX3ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdmFsdWUuaW5kZXhPZignLCcpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fZm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm1hdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIF92YWx1ZSA9IF92YWx1ZS5yZXBsYWNlKC8sL2csICcnKTtcbiAgICAgICAgbGV0IGRhdGEgPSBfdmFsdWUuc3BsaXQoJy4nKTtcblxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5fbWF4ID0gZGF0YVswXS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgdGhpcy5fbWF4ID0gZGF0YVswXS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLl9kZWNpbWFsID0gZGF0YVsxXS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgIH1cbn0iXX0=