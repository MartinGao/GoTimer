import mongoose from 'mongoose';
const Log = mongoose.model('Log');

module.exports = (app) => {

  //Frontend Route
  app.get('/history/index', (req, res) => {
    res.render('history/index.html');
  });



};
