# `i18next-intervalPlural-postProcessor`

## Introduction
This is i18next plugin enabling advanced translations, required by some languages. 

## Getting started

```sh
# npm package
$ npm install i18next-countable-postprocessor

# bower
$ bower install i18next-countable-postprocessor
```

- If you don't use a module loader it will be added to `window.i18nextCountablePostProcessor`

Wiring up:

```js
import i18next from 'i18next';
import countable from 'i18next-countable-postprocessor';

i18next
  .use(intervalPlural)
  .init(i18nextOptions);
```

## Usage translation resource
Create additional rule keys in translation resource for language that requires more that one plural form.
Example in Polish laguage, when we use 2 FORMS for plural version, and the rules are:
* FORM 1: when number ends with digit 2, 3 or 4 digit, except when it ens with 12, 13 and 14. Eg. 2, 11, 22, 142, 1054, and so on.
* FORM 2: when number don't end with 2, 3 or 4 digit, except for 12, 13, 14. Eg. 5, 113, 5528.

```js
{
    "records_found_0": "Nie znaleziono rekordów",
    "records_found_1": "Znaleziono 1 rekord",

    // (1) rule for count numbers ending with "2"
    "records_found_*2": "Znaleziono {{count}} rekordy",
    // (2) rule for count numbers ending with "3"     
    "records_found_*3": "Znaleziono {{count}} rekordy",
    // (3) rule for count numbers ending with "4"   
    "records_found_*4": "Znaleziono {{count}} rekordy", 
    // (4) exception from rule (1) for count numbers ending with "12"     
    "records_found_*12": "Znaleziono {{count}} rekordów",
    // (5) exception from rule (2) for count numbers ending with "13" 
    "records_found_*13": "Znaleziono {{count}} rekordów",
    // (6) exception from rule (3) for count numbers ending with "14"  
    "records_found_*14": "Znaleziono {{count}} rekordów",    
    
    // additionally at least one of following fallback rules for other numbers should be defined
    "records_found_plural": "Znaleziono {{count}} rekordów", // higher priority fallback translation, only for numbers > 2
    "records_found": "Znaleziono {{count}} rekordów",        // lower priority fallback translation, but will handle 0 and 1 if no specific rule for those numbers is provided
}
```

## Minimal configuration
```js
import i18next from 'i18next';
import countable from 'i18next-countable-postprocessor';

i18next
  .use(countable)
  .init({ /* your i18next configuration */ });

```
## Translating using native `t` function 
```js
import i18next from "i18next";

const translation = i18next.t('records_found', { postProcess: 'countable', count: 5 }); 
```

## Translating using react-i18next
```js
import { useTranslation } from "react-i18next";

const { t } = useTranslation(); 
const translation = t('records_found', { postProcess: 'countable', count: 5 });
```

## Extended configuration
```js
import i18next from 'i18next';
import countable from 'i18next-countable-postprocessor';

countable.setOptions({
  variantSeparator: "-",
  countVariableName: "number"
});

i18next
  .use(countable)
  .init({ /* your i18next configuration */ });
```

### Options available
* **variantSeparator** - 
  separator between resource key and number rule suffix. Define "-" for example to replace pattern "key_*1" with "key-*1"

* **countVariableName** -
  postProcessor will "active" only if count variable is provided as option for "t" function, but it doesn't need to be named "count". Define other string, e.g. "number" to resorve translation like "Znaleziono {{number}} rekordy" from example above.


## Credits
This project's structure is based on great <a href="https://github.com/i18next/i18next-intervalPlural-postProcessor" target="_blank">intervalPlural processor</a> library.