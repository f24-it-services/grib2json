# grib2json

A simple wrapper around the [grib2json](https://github.com/cambecc/grib2json) command line tool. Allows you to call the grib2 converter directly from your nodejs code.

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Usage](#usage)
	- [Setting the grib2json path](#setting-the-grib2json-path)
	- [Filtering grib2 files](#filtering-grib2-files)
- [License](#license)

<!-- /TOC -->

## Installation

    npm i --save grib2json

You also need to have the [grib2json](https://github.com/cambecc/grib2json) command installed somewhere on your machine. See [Installation](https://github.com/cambecc/grib2json#installation) for instructions on how to install grib2json.

## Usage

```javascript
var grib2json = require('grib2json')

grib2json('/path/to/grib2-file', {/* options */}, function (err, json) {
  if (err) return console.error(err)

  console.log(json)
})
```

This will output the entire grib2 file as json. The default mode is to just return the headers - the same behaviour as the original grib2json utility.

### Setting the grib2json path

If grib2json is installed in your system path, there is nothing to do here. Otherwise, there are multiple options for providing the path to grib2json:

 1. **Using environment variables**: we look for an environment variable called `GRIB2JSON_PATH` and use it as a path to the grib2json utility.
 1. **Using options**: you can provide the path to grib2json via the options object:
    ```javascript
    grib2json('/path/to/grib2-file',{
      scriptPath: '/home/me/grib2json/bin/grib2json'
    }, function (err, json) {

    })
    ```

### Filtering grib2 files

You can filter the grib2 file with the same parameters the original grib2json utility accepts by using the options object:

```javascript
var grib2json = require('grib2json')

// Print the v-component of wind at 10 meters above surface
// Includes header names and data
grib2json('/path/to/grib2-file', {
  names: true, // (default false): Return descriptive names too
  data: true, // (default false): Return data, not just headers
  category: 2, // Grib2 category number, equals to --fc 1
  parameter: 3, // Grib2 parameter number, equals to --fp 7
  surfaceType: 103, // Grib2 surface type, equals to --fs 103
  surfaceValue: 10, // Grib2 surface value, equals to --fv 10
}, function (err, json) {
  if (err) return console.error(err)

  console.log(json)
})
```

## License

This package is licensed under the MIT license. See [MIT](LICENSE.md) for details.
