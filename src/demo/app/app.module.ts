import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxNumberFormatModule } from 'ngx-number-format';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxNumberFormatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
