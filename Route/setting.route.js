import mongoose from 'mongoose';
// const Achievement = mongoose.model('Achievement');

module.exports = (app) => {

  //Frontend Route
  app.get('/setting/profile', (req, res) => {
    res.render('Setting/profile.html');
  });



};
