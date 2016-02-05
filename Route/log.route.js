import mongoose from 'mongoose';
const Log = mongoose.model('Log');

module.exports = (app) => {

  //Frontend Route
  app.get('/log/newGoal', (req, res) => {
    res.render('log/newGoal.html');
  });

  app.get('/log/list', (req, res) => {
    res.render('log/goalsList.html');
  });


  //Backend API
  app.route('/logs/newGoal')
    .post((req, res) => {
      console.log(req.body);

      Log.create({
        user: '507f1f77bcf86cd799439011',
        name: req.body.name,
        estimatedTime: req.body.estimatedTime,
      },(err ,newLog) => {
        if (err) {
          res.send(err);
        } else {
          res.send(newLog);
        }
      })

    });
};
