import cp from 'child_process'
import which from 'which'

let __scriptPath
/**
 * Determine the path to the grib2json launcher. Will look for the key
 * 'scriptPath' in the options object first, then for an env variable called
 * GRIB2JSON_PATH and last but not least search the system PATH.
 * @param {object} options
 * @param  {Function} cb
 * @return {void}
 */
function getScriptPath (options, cb) {
  if (__scriptPath !== undefined) {
    process.nextTick(() => cb(null, __scriptPath))
  } else {
    if ('scriptPath' in options) {
      __scriptPath = options.scriptPath
      process.nextTick(() => cb(null, __scriptPath))
    } else if (process.env.GRIB2JSON_PATH) {
      __scriptPath = process.env.GRIB2JSON_PATH
      process.nextTick(() => cb(null, __scriptPath))
    } else {
      which('grib2json', (err, res) => {
        __scriptPath = res || null

        if (err) return cb(err)
        cb(null, __scriptPath)
      })
    }
  }
}

/**
 * Sets the path to the grib2json launcher.
 * @param {string} scriptPath
 */
export function setScriptPath (scriptPath) {
  __scriptPath = scriptPath
}

/**
 * Converts grib file contents to JSON.
 * @param  {string}   file
 * @param  {object}   options
 * @param  {Function} cb
 * @return {void}
 */
export default function grib2json (file, options, cb) {
  const names = options.names !== undefined ? !!options.names : false
  const data = options.data !== undefined ? !!options.data : false

  getScriptPath(options, (err, path) => {
    if (err) return cb(err)

    let args = ['-c']
    if (names) args.push('--names')
    if (data) args.push('--data')
    if (options.category !== undefined) args.push('--fc', parseInt(options.category))
    if (options.parameter !== undefined) args.push('--fp', parseInt(options.parameter))
    if (options.surfaceType !== undefined) args.push('--fs', parseInt(options.surfaceType))
    if (options.surfaceValue !== undefined) args.push('--fv', parseInt(options.surfaceValue))
    args.push(file)

    let stdout = ''
    let stderr = ''
    let child = cp.spawn(path, args)
    child.stdout.on('data', (data) => { stdout += data })
    child.stderr.on('data', (data) => { stderr += data })
    child.on('close', (code) => {
      if (code !== 0) {
        return cb(new Error(stderr))
      }
      cb(null, JSON.parse(stdout))
    })
  })
}
