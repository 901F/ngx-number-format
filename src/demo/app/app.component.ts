import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
    control: FormControl;

    constructor(private fb: FormBuilder) {
        this.setConfig();
        this.control = this.fb.control(0);
    }

    setConfig() {
        this.config = this.example3;
        this.configInput = null;
    }

}
