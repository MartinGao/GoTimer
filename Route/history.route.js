import mongoose from 'mongoose';
const Log = mongoose.model('Log');

module.exports = (app) => {

  //Frontend Route
  app.get('/history/list', (req, res) => {
    res.render('History/list.html');
  });


  app.get('/history/charts', (req, res) => {
    res.render('History/charts.html');
  });

  app.get('/history/my24h', (req, res) => {
    res.render('History/my24h.html');
  });



};
