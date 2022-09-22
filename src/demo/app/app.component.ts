import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    version: string = environment.version;
    example1: number;
    example2: number;
    example3: string  = '#,###,###.##';
    config: string;
    configInput: string;
    control: UntypedFormControl;
    controlForNegative: UntypedFormControl;
    allowNegative: boolean = true;
    allowNegativeSelect: string = '1';

    constructor(private fb: UntypedFormBuilder) {
        this.setConfig();
        this.control = this.fb.control(0);
        this.controlForNegative = this.fb.control('');
    }

    setConfig() {
        this.config = this.example3;
        this.configInput = null;
    }

    allowNegativeChange() {
        this.allowNegative = this.allowNegativeSelect == '1';
    }

}
