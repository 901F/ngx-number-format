<h1 align="center">ngx-number-format</h1>

<p align="center">
Simple number format for input element in <a href="https://angular.io/">Angular</a>
</p>


<p align="center">
<a href="https://www.npmjs.com/package/ngx-number-format"><img src="https://img.shields.io/badge/dynamic/json?color=brightgreen&label=npm%20package&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fzmadcatz%2Fngx-number-format%2Fdevelopment%2Fpackage.json&style=for-the-badge"></a>
<a href="https://github.com/zMADCATz/ngx-number-format/blob/development/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/zMADCATz/ngx-number-format?color=%23f86a08&style=for-the-badge"></a>
</p>


## Table of contents
- [Table of contents](#table-of-contents)
- [Versions](#versions)
- [Installation instructions](#installation-instructions)
- [Demo](#demo)
- [API](#api)

## Versions

| Angular| ngx-number-format|
| ------|:------:| 
| >=14.0.0 <15.0.0 | v14.x |
| >=13.0.0 <14.0.0 | v13.x |
| >=12.0.0 <13.0.0 | v12.x |
| >=11.0.0 <12.0.0 | v11.x |
| >=10.0.0 <11.0.0 | v3.x |
| >=6.0.0 <10.0.0  | v2.x |

---

## Installation instructions
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

## API
 Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [allowNegative] | `boolean`  | `false` | no | Allows to negative numbers. |