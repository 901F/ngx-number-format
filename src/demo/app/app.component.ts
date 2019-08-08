import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'number-format-base';
    example1: number;
    example2: number;
    example3: string  = '#,###,###.##';
    config: string;
    configInput: string;

    constructor() {
        this.setConfig();
    }

    setConfig() {
        this.config = this.example3;
        this.configInput = null;
    }

}
