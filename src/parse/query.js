var typeOf = require('yaul/typeOf')
var trim = require('yaul/trim')

function makeMethod ( name, desc ) {

  return function ( key, value ) {
    if ( desc.validate(value, name) ) {
      var query = make(this, '__query', {})
      var prop = make(query,key,{})
      prop[desc.alias] = value
    }

    return this
  }
}

var is = {}
var methods = ['number','array','date','regex','object','function','string']
methods.forEach(function (type) {
  is[type] = function (val, method ) {
    var isType = typeOf(val,type)
    if ( isType ) {
      window.console && console.warn(err[method]['validate'])
    }
    return !isType
  }
})


var methodDictionary = {
  'lessThan':{
     token: '$lt'
    ,alias: '<'
    ,validate: is.number
  }
  ,'lessThanOrEqual':{
     token:'$lte'
    ,alias:'<='
    ,validate: is.number
  }
  ,'greaterThan':{
     token: '$gt'
    ,alias: '>'
    ,validate: is.number
  }
  ,'greaterThanOrEqual':{
     token: '$gte'
    ,alias:'>='
    ,validate: is.number
  }
  ,'doesntEqual':{
     token: '$ne'
    ,alias:'!='
  }
  ,'contains': {
    token: '$in'
  }
  ,'doesntContain':{
    token:'$nin'
  }
  ,'has':{
    token:'$exists'
  }
  ,'doesntHave': {
    token:'$exists'
  }
}

function Query () {

}

for ( var method in methodDictionary ) {
  if ( methodDictionary.hasOwnProperty(method) ) {
    Query.prototype[method] = makeMethod(method,methodDictionary[method])
  }
}


console.dir(Query)



var query = {

  lessThan: function ( key, num ) {
    if ( !isInt(num) ) {
      throw new Error(err['#lessThan']['second argument'])
    }

    var $query = make(this, '__query', {})
    $query['$lt'] = num

    return this
  }

  ,lessThanOrEqual: function ( key, num ) {
    if ( !isInt(num) ) {
      throw new Error(err['#lessThanOrEqual']['second argument'])
    }

    var $query = make(this, '__query', {})
    $query['$lte'] = num

    return this
  }

  ,greaterThan: function (key, num) {
    if ( !isInt(num) ) {
      throw new Error(err['#greaterThan']['second argument'])
    }

    var query = make(this, '__query', {})
    var prop = make(query, key, {})
    prop['$gt'] = num

    return this
  }

  ,doesntEqual: function (val) {
    var query = make(this, '__query', {})
    var prop = make(query,key,{})
    prop['$ne'] = val

    return this
  }

  ,where: function (query) {
    var queries = String(query).split('AND').map(trim)
  }

}


module.exports = Query

var errs = {
  'lessThan': {
    'validate': '`#lessThan` requires the second agrument to be an integer'
  }
  ,'lessThanOrEqual': {
    'validate': '`#lessThanOrEqual` requires the second agrument to be an integer'
  }
  ,'greaterThan': {
    'validate': '`#greaterThan` requires the second agrument to be an integer'
  }
}