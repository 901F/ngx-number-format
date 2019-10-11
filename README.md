<h1 align="center">ngx-number-format</h1>

<p align="center">
Simple number format for input element in <a href="https://angular.io/">Angular</a>
</p>


<p align="center">
<a href="https://www.npmjs.com/package/ngx-number-format"><img src="https://img.shields.io/badge/dynamic/json?color=brightgreen&label=npm%20package&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fzmadcatz%2Fngx-number-format%2Fdevelopment%2Fpackage.json&style=for-the-badge"></a>
<a href="https://github.com/zMADCATz/ngx-number-format/blob/development/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/zMADCATz/ngx-number-format?color=%23f86a08&style=for-the-badge"></a>
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
[demo project](https://madcaz.github.io/ngx-number-format/)
