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


  app.get('/log/edit/:lodId', (req, res) => {
    Log.findOne({
      _id: req.params.lodId
    }).exec((err, oldLog) => {


      let newLogs = [];

      async.each([oldLog],(log,cb) => {

        let temp = JSON.parse(JSON.stringify(log));

        temp.onGoingDuration = moment().unix() - moment(temp.started).unix();

        let ms = moment(log.ended).diff(moment(log.started));
        let d = moment.duration(ms);
        let s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

        temp.actualDurationString = s;
        temp.actualDuration = ms/1000;

        if(temp.started === null && temp.ended === null){
          temp.actualDuration = null;
          temp.actualDurationString = null;
        }

        let msms = moment().diff(moment().add(-log.estimatedTime,'seconds'));
        let dd = moment.duration(msms);
        let ss = ("0" + Math.floor(dd.asHours()) ).slice(-2) + moment(msms).format(":mm:ss");


        temp.estimatedDurationString = ss;

        newLogs.push(temp);
        cb();

      },() => {
        console.log(newLogs);
        res.render('Log/editLog.html', {
          item: newLogs[0]
        });
      });
    })
  });

  app.put('/api/log/edit/', (req, res) => {
    if(req.body.actualTime){
      console.log(req.body.actualTime)
      console.log(req.body.started)
      console.log(moment(req.body.started).add(req.body.actualTime,'seconds'))
      Log.findOneAndUpdate({
        _id: req.body.id
      },{
        name: req.body.name,
        category: req.body.category,
        ended: moment(req.body.started).add(req.body.actualTime,'seconds'),
      }).exec((err, oldLog) => {
        console.log(oldLog);
        res.render('Log/editLog.html', {
          item: oldLog
        });
      })

    }
    else{
      Log.findOneAndUpdate({
        _id: req.body.id
      },{
        name: req.body.name,
        category: req.body.category,
        estimatedTime: req.body.estimatedTime,
      }).exec((err, oldLog) => {
        console.log(oldLog);
        res.render('Log/editLog.html', {
          item: oldLog
        });
      })
    }
  });


  app.get('/log/list/:userId', (req, res) => {
    Log.find({
      user: mongoose.Types.ObjectId(req.params.userId),
      ended: null,
    }).sort('-started').exec((err ,logs) => {
      if (err) {
        res.render('Log/goalsList.html', {
          items : logs
        });
      } else {
        let newLogs = [];
        async.each(logs,(log,cb) => {
          let temp = JSON.parse(JSON.stringify(log));
          temp.onGoingDuration = moment().unix() - moment(temp.started).unix();
          let msms = moment().diff(moment().add(-log.estimatedTime,'seconds'));
          let dd = moment.duration(msms);
          let ss = ("0" + Math.floor(dd.asHours()) ).slice(-2) + moment(msms).format(":mm:ss");
          temp.estimatedDurationString = ss;
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

  app.get('/log/list-versionB/:userId', (req, res) => {
    Log.find({
      user: mongoose.Types.ObjectId(req.params.userId),
      ended: null,
    }).sort('-started').exec((err ,logs) => {
      if (err) {
        res.render('Log/goalsList.html', {
          items : logs
        });
      } else {
        let newLogs = [];
        async.each(logs,(log,cb) => {
          let temp = JSON.parse(JSON.stringify(log));
          temp.onGoingDuration = moment().unix() - moment(temp.started).unix();
          let msms = moment().diff(moment().add(-log.estimatedTime,'seconds'));
          let dd = moment.duration(msms);
          let ss = ("0" + Math.floor(dd.asHours()) ).slice(-2) + moment(msms).format(":mm:ss");
          temp.estimatedDurationString = ss;
          newLogs.push(temp);
          cb();
        },() => {
          console.log(newLogs);
          res.render('Log/goalsList-VersionB.html', {
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
      user: req.body.userId,
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
  .post((req, res) => {
    Log.find({
      user: req.body.userId,
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
