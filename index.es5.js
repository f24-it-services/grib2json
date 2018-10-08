'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setScriptPath = setScriptPath;
exports.default = grib2json;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _which = require('which');

var _which2 = _interopRequireDefault(_which);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __scriptPath = void 0;
/**
 * Determine the path to the grib2json launcher. Will look for the key
 * 'scriptPath' in the options object first, then for an env variable called
 * GRIB2JSON_PATH and last but not least search the system PATH.
 * @param {object} options
 * @param  {Function} cb
 * @return {void}
 */
function getScriptPath(options, cb) {
  if (__scriptPath !== undefined) {
    process.nextTick(function () {
      return cb(null, __scriptPath);
    });
  } else {
    if ('scriptPath' in options) {
      __scriptPath = options.scriptPath;
      process.nextTick(function () {
        return cb(null, __scriptPath);
      });
    } else if (process.env.GRIB2JSON_PATH) {
      __scriptPath = process.env.GRIB2JSON_PATH;
      process.nextTick(function () {
        return cb(null, __scriptPath);
      });
    } else {
      (0, _which2.default)('grib2json', function (err, res) {
        __scriptPath = res || null;

        if (err) return cb(err);
        cb(null, __scriptPath);
      });
    }
  }
}

/**
 * Sets the path to the grib2json launcher.
 * @param {string} scriptPath
 */
function setScriptPath(scriptPath) {
  __scriptPath = scriptPath;
}

/**
 * Converts grib file contents to JSON.
 * @param  {string}   file
 * @param  {object}   options
 * @param  {Function} cb
 * @return {void}
 */
function grib2json(file, options, cb) {
  var names = options.names !== undefined ? !!options.names : false;
  var data = options.data !== undefined ? !!options.data : false;

  getScriptPath(options, function (err, path) {
    if (err) return cb(err);

    var args = ['-c'];
    if (names) args.push('--names');
    if (data) args.push('--data');
    if (options.category !== undefined) args.push('--fc', parseInt(options.category));
    if (options.parameter !== undefined) args.push('--fp', parseInt(options.parameter));
    if (options.surfaceType !== undefined) args.push('--fs', parseInt(options.surfaceType));
    if (options.surfaceValue !== undefined) args.push('--fv', parseInt(options.surfaceValue));
    args.push(file);

    var stdout = '';
    var stderr = '';
    var child = _child_process2.default.spawn(path, args);
    child.stdout.on('data', function (data) {
      stdout += data;
    });
    child.stderr.on('data', function (data) {
      stderr += data;
    });
    child.on('close', function (code) {
      if (code !== 0) {
        return cb(new Error(stderr));
      }
      cb(null, JSON.parse(stdout));
    });
  });
}
