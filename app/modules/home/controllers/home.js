module.exports = {
  doSomething: function (req, res) {
    console.log('did something')
  }
  ,index: function (req, res) {
    res.send('Index called')
  }
}