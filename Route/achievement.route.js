import mongoose from 'mongoose';
// const Achievement = mongoose.model('Achievement');

module.exports = (app) => {

  //Frontend Route
  app.get('/achievement/friends', (req, res) => {
    res.render('Achievement/friends.html');
  });



};
