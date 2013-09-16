/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String} path
 * @param  {Array} keys
 * @return {RegExp}
 * @api private
 */
function normalizePath ( path, keys ) {
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, parse)
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.+)')
  
  function parse ( _, slash, format, key, capture, optional ) {
      keys.push(key);
      slash = slash || '';
      return ''
      + (optional ? '' : slash)
      + '(?:'
      + (optional ? slash : '')
      + (format || '') + (capture || '([^/]+?)') + ')'
      + (optional || '');
  }

  return new RegExp('^' + path + '$', 'i')
}


function Route ( method, path, fn ) {
  if (!method) throw new Error('A route requires a method')
  if (!path) throw new Error('A route requires a path')
  if (!fn) throw new Error('A route ' + path + ' requires a callback')

  var keys = []
  this.path = (path instanceof RegExp) ? path : normalizePath(path, keys)
  this.keys = keys
  this.fn = fn
  this.ogPath = path
  this.method = method.toUpperCase()
} 

Route.prototype.normalizePath = normalizePath

module.exports = Route


