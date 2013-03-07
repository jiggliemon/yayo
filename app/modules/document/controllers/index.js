var Controller = require('yayo/controller')
var DocumentControllerIndex = Controller.create({

  // GET /document/index || /document
  "index": function (req, res, app) {
    var layout = app.getLayout()
    res.end(layout.toHtml())
  }

})