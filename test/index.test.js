process.env.PATH = `${__dirname}/../grib2json/grib2json-0.8.0-SNAPSHOT/bin:${process.env.PATH}`

const assert = require('assert')
const grib2json = require('..').default

grib2json(`${__dirname}/file.grib`, {/* data: true */}, function (err, json) {
  assert.ok(!err)
  assert.ok(typeof json === 'object')
  console.log(json)
})
