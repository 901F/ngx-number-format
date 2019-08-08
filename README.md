<h1 align="center">ngx-number-format</h1>

<p align="center">
Simple number format for input element in <a href="https://angular.io/">Angular</a>
</p>


<p align="center">
<a href="https://badge.fury.io/js/ngx-number-format"><img src="https://badge.fury.io/js/ngx-number-format.svg" alt="npm version"></a>
</p>


## Table of contents
1. [Installation instructions](#installation-instructions)
2. [Demo](#demo)


## Installation instructions
##### Method 1
Install `ngx-number-format` from `npm`:
```bash
npm install ngx-number-format --save
```

Add needed package to NgModule imports:
```
import { NgxNumberFormatModule } from 'ngx-number-format';

@NgModule({
  ...
  imports: [NgxNumberFormatModule,...]
  ...
})
```

Add `ngxNumberFormat` to your input element:
```
<input type="text" ngxNumberFormat="#,###,###" />
```
## Demo
[demo project](https://zmadcatz.github.io/ngx-number-format/)
