[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/utils/text-utils](../README.md) / TextUtils

# Class: TextUtils

Defined in: src/app/core/utils/text-utils.ts:4

In charge to handle search text

## Constructors

### Constructor

> **new TextUtils**(): `TextUtils`

#### Returns

`TextUtils`

## Methods

### capitalizeFirstLetter()

> `static` **capitalizeFirstLetter**(`word`): `any`

Defined in: src/app/core/utils/text-utils.ts:30

Mets le premier caractère du mot en majuscule

#### Parameters

##### word

`any`

#### Returns

`any`

***

### hasSearchText()

> `static` **hasSearchText**(`text`, `searchText`): `boolean`

Defined in: src/app/core/utils/text-utils.ts:15

Utils in charge search text with normalize

#### Parameters

##### text

`string`

main text

##### searchText

`string`

search text

#### Returns

`boolean`

***

### removeDiacritics()

> `static` **removeDiacritics**(`str`): `string`

Defined in: src/app/core/utils/text-utils.ts:6

Removes all special characters from a string (ex: 'é' => 'e')

#### Parameters

##### str

`string`

#### Returns

`string`
