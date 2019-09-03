/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, forwardRef, ElementRef, Input, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
var NgxNumberFormatDirective = /** @class */ (function () {
    function NgxNumberFormatDirective(el) {
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
        function (_) { });
        this.onTouch = (/**
         * @return {?}
         */
        function () { });
    }
    /**
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._formElement = this.el.nativeElement;
    };
    Object.defineProperty(NgxNumberFormatDirective.prototype, "initialize", {
        set: /**
         * @param {?} _value
         * @return {?}
         */
        function (_value) {
            this.setFormat(_value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.onKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this._process) {
            if (event.key == 'Backspace') {
                this._detectBackspace = true;
                /** @type {?} */
                var last = this._formElement.value.substring(this._formElement.selectionStart - 1, this._formElement.selectionStart);
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
                var last = this._formElement.value.substring(this._formElement.selectionEnd, this._formElement.selectionEnd + 1);
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
            var current = this.el.nativeElement.value;
            /** @type {?} */
            var firstPart = current.substring(0, this._formElement.selectionStart);
            /** @type {?} */
            var secondPart = current.substring(this._formElement.selectionEnd);
            /** @type {?} */
            var next = (firstPart.concat(event.key) + secondPart).replace(/,/g, '');
            /** @type {?} */
            var regEx = this.getRegEx();
            /** @type {?} */
            var value = next.split('.');
            if (next && !String(next).match(regEx) || (value[0].length > this._max && this._formElement.selectionStart == this._formElement.selectionEnd) || (this._decimal > 0 && value.length == 2 && (value[1].length > this._decimal && this._formElement.selectionStart == this._formElement.selectionEnd))) {
                event.preventDefault();
            }
            else {
                this._oldSelectionStart = this._formElement.selectionStart;
                this._oldValue = this._formElement.value;
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.onClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._oldSelectionStart = this._formElement.selectionStart;
        this._oldValue = this._formElement.value;
        this._oldValueForDetectChange = event.target.value;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.onInput = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var value = event.target.value;
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.onBlur = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var value = event.target.value;
        if (value.length > 0 && this._decimal > 0) {
            value = value.replace(/,/g, '');
            value = Number(value).toFixed(this._decimal).toString();
            this._formElement.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        this.onTouch();
        // Fix bug on Internet Explorer and Microsoft Edge not fire change event when set value to input element by javascript.
        /** @type {?} */
        var isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if (isIEOrEdge && (value != this._oldValueForDetectChange)) {
            /** @type {?} */
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            event.target.dispatchEvent(evt);
        }
    };
    /**
     * @param {?} _oldValue
     * @param {?} _oldSelectionStart
     * @param {?} _newValue
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.processCursorPosition = /**
     * @param {?} _oldValue
     * @param {?} _oldSelectionStart
     * @param {?} _newValue
     * @return {?}
     */
    function (_oldValue, _oldSelectionStart, _newValue) {
        /** @type {?} */
        var _oldTotalComma = 0;
        /** @type {?} */
        var _newTotalComma = 0;
        if (_newValue) {
            _oldValue = _oldValue.substr(0, _oldSelectionStart);
            _oldTotalComma = (_oldValue.match(/,/g) || []).length;
            _newValue = _newValue.substr(0, _oldSelectionStart + 1);
            _newTotalComma = (_newValue.match(/,/g) || []).length;
            this.setCursorAt(_oldSelectionStart + 1 + (_newTotalComma - _oldTotalComma));
        }
    };
    /**
     * @param {?} position
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.setCursorAt = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this._formElement.setSelectionRange) {
            this._formElement.focus();
            this._formElement.setSelectionRange(position, position);
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value != null && value != '') {
            if (typeof (value) === 'string') {
                value = value.replace(/,/g, '');
            }
            else {
                value = value.toString();
            }
        }
        this.onValueChange(value, false);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouch = fn;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.setDisabledState = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._formElement.disabled = value;
    };
    /**
     * @private
     * @param {?} newValue
     * @param {?=} cursor
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.onValueChange = /**
     * @private
     * @param {?} newValue
     * @param {?=} cursor
     * @return {?}
     */
    function (newValue, cursor) {
        if (cursor === void 0) { cursor = true; }
        if (newValue !== this._displayValue && this._process) {
            /** @type {?} */
            var value = void 0;
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
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.removeLeadingZero = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value.indexOf('.') == -1) {
            /** @type {?} */
            var convertVal = +value;
            value = convertVal.toString();
        }
        return value;
    };
    /**
     * @private
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.getRegEx = /**
     * @private
     * @return {?}
     */
    function () {
        return (this._decimal > 0) ? this._regExNumberAndDecimal : this._regExNumber;
    };
    /**
     * @private
     * @param {?} _value
     * @return {?}
     */
    NgxNumberFormatDirective.prototype.setFormat = /**
     * @private
     * @param {?} _value
     * @return {?}
     */
    function (_value) {
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
        var data = _value.split('.');
        if (data.length == 1) {
            this._max = data[0].length;
        }
        else if (data.length == 2) {
            this._max = data[0].length;
            this._decimal = data[1].length;
        }
    };
    NgxNumberFormatDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxNumberFormat]',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return NgxNumberFormatDirective; })),
                            multi: true
                        }
                    ]
                },] }
    ];
    /** @nocollapse */
    NgxNumberFormatDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    NgxNumberFormatDirective.propDecorators = {
        initialize: [{ type: Input, args: ['ngxNumberFormat',] }],
        onKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
        onClick: [{ type: HostListener, args: ['click', ['$event'],] }],
        onInput: [{ type: HostListener, args: ['input', ['$event'],] }],
        onBlur: [{ type: HostListener, args: ['blur', ['$event'],] }]
    };
    return NgxNumberFormatDirective;
}());
export { NgxNumberFormatDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW51bWJlci1mb3JtYXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LW51bWJlci1mb3JtYXQvIiwic291cmNlcyI6WyJsaWIvbmd4LW51bWJlci1mb3JtYXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxVQUFVLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFekU7SUErQkksa0NBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBbkIxQiw2QkFBd0IsR0FBVyxJQUFJLENBQUM7UUFDeEMsY0FBUyxHQUFXLElBQUksQ0FBQztRQUN6QixrQkFBYSxHQUFXLElBQUksQ0FBQztRQUM3QixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixpQkFBWSxHQUFrQixDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hJLGlCQUFZLEdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0MsMkJBQXNCLEdBQVcsSUFBSSxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUN4RSx1QkFBa0IsR0FBVyxDQUFDLENBQUM7UUFDL0Isa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFDL0IscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBRTNCLGFBQVE7Ozs7UUFBRyxVQUFDLENBQU0sSUFBTyxD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IGZvcndhcmRSZWYsIE9uSW5pdCwgRWxlbWVudFJlZiwgSW5wdXQsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tuZ3hOdW1iZXJGb3JtYXRdJyxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hOdW1iZXJGb3JtYXREaXJlY3RpdmUpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4TnVtYmVyRm9ybWF0RGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG5cbiAgICBwcml2YXRlIF9vbGRWYWx1ZUZvckRldGVjdENoYW5nZTogc3RyaW5nID0gbnVsbDtcbiAgICBwcml2YXRlIF9vbGRWYWx1ZTogc3RyaW5nID0gbnVsbDtcbiAgICBwcml2YXRlIF9kaXNwbGF5VmFsdWU6IHN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfbWF4OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX2RlY2ltYWw6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBfZm9ybWF0OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfZm9ybUVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfc3BlY2lhbEtleXM6IEFycmF5PHN0cmluZz4gPSBbJ0JhY2tzcGFjZScsICdUYWInLCAnRW5kJywgJ0hvbWUnLCAnQXJyb3dVcCcsICdBcnJvd0Rvd24nLCAnQXJyb3dMZWZ0JywgJ0Fycm93UmlnaHQnLCAnRW50ZXInLCAnRGVsZXRlJ107XG4gICAgcHJpdmF0ZSBfcmVnRXhOdW1iZXI6IFJlZ0V4cCA9IG5ldyBSZWdFeHAoL15bMC05XSokL2cpO1xuICAgIHByaXZhdGUgX3JlZ0V4TnVtYmVyQW5kRGVjaW1hbDogUmVnRXhwID0gbmV3IFJlZ0V4cCgvXlswLTldKyhcXC5bMC05XSopezAsMX0kL2cpO1xuICAgIHByaXZhdGUgX29sZFNlbGVjdGlvblN0YXJ0OiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgX2RldGVjdERlbGV0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2RldGVjdEJhY2tzcGFjZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2RldGVjdFNlbGVjdEFsbDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgX3Byb2Nlc3M6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHsgfTtcbiAgICBwdWJsaWMgb25Ub3VjaCA9ICgpID0+IHsgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuX2Zvcm1FbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIEBJbnB1dCgnbmd4TnVtYmVyRm9ybWF0JylcbiAgICBwdWJsaWMgc2V0IGluaXRpYWxpemUoX3ZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRGb3JtYXQoX3ZhbHVlKTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcblxuICAgICAgICBpZiAodGhpcy5fcHJvY2Vzcykge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSAnQmFja3NwYWNlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RldGVjdEJhY2tzcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IGxhc3Q6IHN0cmluZyA9IHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlLnN1YnN0cmluZyh0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25TdGFydCAtIDEsIHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT0gdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kICYmIGxhc3QgPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3Vyc29yQXQodGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RldGVjdEJhY2tzcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSAnRGVsZXRlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RldGVjdERlbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IGxhc3Q6IHN0cmluZyA9IHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlLnN1YnN0cmluZyh0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25FbmQsIHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvbkVuZCArIDEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25TdGFydCA9PSB0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25FbmQgJiYgbGFzdCA9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRDdXJzb3JBdCh0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25FbmQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RldGVjdERlbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuX3NwZWNpYWxLZXlzLmluZGV4T2YoZXZlbnQua2V5KSAhPT0gLTFcbiAgICAgICAgICAgICAgICB8fCAoZXZlbnQua2V5Q29kZSA9PT0gNjUgJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpIC8vIEFsbG93OiBDdHJsICsgQVxuICAgICAgICAgICAgICAgIHx8IChldmVudC5rZXlDb2RlID09PSA2NyAmJiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSkgLy8gQWxsb3c6IEN0cmwgKyBDXG4gICAgICAgICAgICAgICAgfHwgKGV2ZW50LmtleUNvZGUgPT09IDg2ICYmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpKSAvLyBBbGxvdzogQ3RybCArIFZcbiAgICAgICAgICAgICAgICB8fCAoZXZlbnQua2V5Q29kZSA9PT0gODggJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpIC8vIEFsbG93OiBDdHJsICsgWFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgbGV0IGN1cnJlbnQ6IHN0cmluZyA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIGxldCBmaXJzdFBhcnQ6IHN0cmluZyA9IGN1cnJlbnQuc3Vic3RyaW5nKDAsIHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgIGxldCBzZWNvbmRQYXJ0OiBzdHJpbmcgPSBjdXJyZW50LnN1YnN0cmluZyh0aGlzLl9mb3JtRWxlbWVudC5zZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgbGV0IG5leHQ6IHN0cmluZyA9IChmaXJzdFBhcnQuY29uY2F0KGV2ZW50LmtleSkgKyBzZWNvbmRQYXJ0KS5yZXBsYWNlKC8sL2csICcnKTtcbiAgICBcbiAgICAgICAgICAgIGxldCByZWdFeCA9IHRoaXMuZ2V0UmVnRXgoKTtcbiAgICBcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG5leHQuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChuZXh0ICYmICFTdHJpbmcobmV4dCkubWF0Y2gocmVnRXgpIHx8ICh2YWx1ZVswXS5sZW5ndGggPiB0aGlzLl9tYXggJiYgdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT0gdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kKSB8fCAodGhpcy5fZGVjaW1hbCA+IDAgJiYgdmFsdWUubGVuZ3RoID09IDIgJiYgKHZhbHVlWzFdLmxlbmd0aCA+IHRoaXMuX2RlY2ltYWwgJiYgdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT0gdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uRW5kKSkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbGRTZWxlY3Rpb25TdGFydCA9IHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX29sZFZhbHVlID0gdGhpcy5fZm9ybUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25DbGljayhldmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbGRTZWxlY3Rpb25TdGFydCA9IHRoaXMuX2Zvcm1FbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICB0aGlzLl9vbGRWYWx1ZSA9IHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlO1xuICAgICAgICB0aGlzLl9vbGRWYWx1ZUZvckRldGVjdENoYW5nZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdpbnB1dCcsIFsnJGV2ZW50J10pXG4gICAgcHVibGljIG9uSW5wdXQoZXZlbnQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcm9jZXNzKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgIVN0cmluZyh2YWx1ZSkucmVwbGFjZSgvLC9nLCAnJykubWF0Y2godGhpcy5nZXRSZWdFeCgpKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kZXRlY3RCYWNrc3BhY2UgfHwgdGhpcy5fZGV0ZWN0RGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29sZFNlbGVjdGlvblN0YXJ0ID0gdGhpcy5fZm9ybUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgLSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbGRWYWx1ZSA9IHRoaXMuX2Zvcm1FbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2UodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCdibHVyJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMgb25CbHVyKGV2ZW50KTogdm9pZCB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCAmJiB0aGlzLl9kZWNpbWFsID4gMCkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8sL2csICcnKTtcbiAgICAgICAgICAgIHZhbHVlID0gTnVtYmVyKHZhbHVlKS50b0ZpeGVkKHRoaXMuX2RlY2ltYWwpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uVG91Y2goKTtcblxuICAgICAgICAvLyBGaXggYnVnIG9uIEludGVybmV0IEV4cGxvcmVyIGFuZCBNaWNyb3NvZnQgRWRnZSBub3QgZmlyZSBjaGFuZ2UgZXZlbnQgd2hlbiBzZXQgdmFsdWUgdG8gaW5wdXQgZWxlbWVudCBieSBqYXZhc2NyaXB0LlxuICAgICAgICBsZXQgaXNJRU9yRWRnZSA9IC9tc2llXFxzfHRyaWRlbnRcXC98ZWRnZVxcLy9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgICBpZiAoaXNJRU9yRWRnZSAmJiAodmFsdWUgIT0gdGhpcy5fb2xkVmFsdWVGb3JEZXRlY3RDaGFuZ2UpKSB7XG4gICAgICAgICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJIVE1MRXZlbnRzXCIpO1xuICAgICAgICAgICAgZXZ0LmluaXRFdmVudChcImNoYW5nZVwiLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICBldmVudC50YXJnZXQuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvY2Vzc0N1cnNvclBvc2l0aW9uKF9vbGRWYWx1ZTogc3RyaW5nLCBfb2xkU2VsZWN0aW9uU3RhcnQ6IG51bWJlciwgX25ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IF9vbGRUb3RhbENvbW1hID0gMDtcbiAgICAgICAgbGV0IF9uZXdUb3RhbENvbW1hID0gMDtcbiAgICAgICAgaWYgKF9uZXdWYWx1ZSkge1xuICAgICAgICAgICAgX29sZFZhbHVlID0gX29sZFZhbHVlLnN1YnN0cigwLCBfb2xkU2VsZWN0aW9uU3RhcnQpO1xuICAgICAgICAgICAgX29sZFRvdGFsQ29tbWEgPSAoX29sZFZhbHVlLm1hdGNoKC8sL2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgICAgICBfbmV3VmFsdWUgPSBfbmV3VmFsdWUuc3Vic3RyKDAsIF9vbGRTZWxlY3Rpb25TdGFydCArIDEpO1xuICAgICAgICAgICAgX25ld1RvdGFsQ29tbWEgPSAoX25ld1ZhbHVlLm1hdGNoKC8sL2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLnNldEN1cnNvckF0KF9vbGRTZWxlY3Rpb25TdGFydCArIDEgKyAoX25ld1RvdGFsQ29tbWEgLSBfb2xkVG90YWxDb21tYSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q3Vyc29yQXQocG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fZm9ybUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm1FbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLl9mb3JtRWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT0gJycpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLywvZywgJycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2UodmFsdWUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vblRvdWNoID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZT8odmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZm9ybUVsZW1lbnQuZGlzYWJsZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uVmFsdWVDaGFuZ2UobmV3VmFsdWU6IHN0cmluZywgY3Vyc29yOiBib29sZWFuID0gdHJ1ZSkge1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZGlzcGxheVZhbHVlICYmIHRoaXMuX3Byb2Nlc3MpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKChuZXdWYWx1ZSA9PSBudWxsKSB8fCAobmV3VmFsdWUudHJpbSgpID09PSAnJykpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlLnJlcGxhY2UoLywvZywgJycpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yZW1vdmVMZWFkaW5nWmVybyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHRoaXMuX2Zvcm1hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlWYWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiLFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGxheVZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICB0aGlzLl9mb3JtRWxlbWVudC52YWx1ZSA9IHRoaXMuX2Rpc3BsYXlWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgICAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc0N1cnNvclBvc2l0aW9uKHRoaXMuX29sZFZhbHVlLCB0aGlzLl9vbGRTZWxlY3Rpb25TdGFydCwgdGhpcy5fZGlzcGxheVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlTGVhZGluZ1plcm8odmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmICh2YWx1ZS5pbmRleE9mKCcuJykgPT0gLTEpIHtcbiAgICAgICAgICAgIGxldCBjb252ZXJ0VmFsID0gK3ZhbHVlO1xuICAgICAgICAgICAgdmFsdWUgPSBjb252ZXJ0VmFsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UmVnRXgoKTogUmVnRXhwIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9kZWNpbWFsID4gMCkgPyB0aGlzLl9yZWdFeE51bWJlckFuZERlY2ltYWwgOiB0aGlzLl9yZWdFeE51bWJlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEZvcm1hdChfdmFsdWU6IHN0cmluZykge1xuXG4gICAgICAgIGlmIChfdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3MgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcHJvY2VzcyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF92YWx1ZS5pbmRleE9mKCcsJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtYXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZm9ybWF0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgX3ZhbHVlID0gX3ZhbHVlLnJlcGxhY2UoLywvZywgJycpO1xuICAgICAgICBsZXQgZGF0YSA9IF92YWx1ZS5zcGxpdCgnLicpO1xuXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXggPSBkYXRhWzBdLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXggPSBkYXRhWzBdLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuX2RlY2ltYWwgPSBkYXRhWzFdLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgfVxufSJdfQ==