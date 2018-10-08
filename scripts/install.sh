#!/bin/bash
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

cd $CWD/..
git clone --depth 1 https://github.com/cambecc/grib2json
cd grib2json
mvn package
tar xzf target/grib2json-0.8.0-SNAPSHOT.tar.gz
cd $CWD/..
