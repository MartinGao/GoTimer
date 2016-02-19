import mongoose from 'mongoose';
import async from 'async';
import moment from 'moment';
const Log = mongoose.model('Log');
const timers = require('../timer.json');
const sliders = require('../sliders.json');

module.exports = (app) => {

  //Frontend Route
  app.get('/log/newGoal', (req, res) => {
    res.render('Log/newGoal.html');
  });

  app.get('/log/list', (req, res) => {

    Log.find({
      user: '507f1f77bcf86cd799439011',
    },(err ,logs) => {
      if (err) {
        res.render('Log/goalsList.html', {
          items : logs
        });
      } else {

        let newLogs = [];

        async.each(logs,(log,cb) => {

          let temp = JSON.parse(JSON.stringify(log));

          temp.onGoingDuration = moment().unix() - moment(temp.started).unix();

          newLogs.push(temp);
          cb();

        },() => {
          console.log(newLogs);
          res.render('Log/goalsList.html', {
            items: newLogs
          });
        });

      }
    })

  });

  app.get('/log/timer', (req, res) => {
    res.render('index.html', { items: timers });
  });

  app.get('/log/editTimer', (req, res) => {
    res.render('Log/editTimer.html', { sliders: sliders });
  });

  //Backend API
  app.route('/logs/newGoal')
  .post((req, res) => {
    console.log(req.body);
    Log.create({
      user: '507f1f77bcf86cd799439011',
      name: req.body.name,
      category: req.body.category,
      estimatedTime: req.body.estimatedTime,
    }, (err, newLog) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(newLog);
      }
    })
  });

  app.route('/api/logs/list')
  .get((req, res) => {
    Log.find({
      user: '507f1f77bcf86cd799439011',
    },(err ,goals) => {
      if (err) {
        res.send(err);
      } else {
        res.send(goals);
      }
    })
  });

  app.route('/api/logs/start')
  .get((req, res) => {
    console.log('/api/logs/start is running!');
    Log.findOneAndUpdate({
      _id: req.query.id,
    },{
      started: new Date()
    },{
      new: true
    },(err ,newGoal) => {
      if (err) {
        res.send(err);
      } else {
        res.send(newGoal);
      }
    })
  });

  app.route('/api/logs/stop')
  .get((req, res) => {
    console.log('/api/logs/start is running!');
    Log.findOneAndUpdate({
      _id: req.query.id,
    },{
      ended: new Date()
    },{
      new: true
    },(err ,newGoal) => {
      if (err) {
        res.send(err);
      } else {
        res.send(newGoal);
      }
    })
  });


  app.route('/api/logs/delete')
  .delete((req, res) => {
    console.log('/api/logs/start is running!');
    Log.findOneAndRemove({
      _id: req.body.id,
    },(err ,newGoal) => {
      if (err) {
        res.send(err);
      } else {
        res.send(newGoal);
      }
    })
  });
};
