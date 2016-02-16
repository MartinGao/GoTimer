import mongoose from 'mongoose';
// const Achievement = mongoose.model('Achievement');

module.exports = (app) => {

  //Frontend Route
  app.get('/achievement/week', (req, res) => {
    res.render('Achievement/week.html');
  });

  app.get('/achievement/month', (req, res) => {
    res.render('Achievement/month.html');
  });



};
