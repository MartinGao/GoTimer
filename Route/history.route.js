import mongoose from 'mongoose';
import moment from 'moment';
import async from 'async';
const Log = mongoose.model('Log');

module.exports = (app) => {

  //Frontend Route
  app.get('/history/list', (req, res) => {

    Log.find({
      user: '507f1f77bcf86cd799439011',
    },(err ,logs) => {
      if (err) {
        res.render('History/list.html', {
          items: logs
        });
      } else {
        let newLogs = [];

        async.each(logs,(log,cb) => {

          let temp = JSON.parse(JSON.stringify(log));

          let ms = moment(log.ended).diff(moment(log.started));
          let d = moment.duration(ms);
          let s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

          temp.actualDurationString = s;

          let msms = moment().diff(moment().add(-log.estimatedTime,'seconds'));
          let dd = moment.duration(msms);
          let ss = Math.floor(dd.asHours()) + moment(msms).format(":mm:ss");


          temp.estimatedDurationString = ss;

          temp.startedString = moment(log.started).format('YYYY-MM-DD hh:mm:ss')
          temp.endedString = moment(log.ended).format('YYYY-MM-DD hh:mm:ss')

          if(temp.started === null){
            temp.actualDurationString = "N/A";
            temp.startedString = "Haven't started";
          }

          if(temp.ended === null){
            temp.endedString = "Haven't started";
          }

          newLogs.push(temp);
          cb();

        },() => {
          console.log(newLogs);
          res.render('History/list.html', {
            items: newLogs
          });
        });

      }
    });
  });

  app.get('/history/charts', (req, res) => {
    res.render('History/charts.html');
  });

  app.get('/history/my24h', (req, res) => {
    res.render('History/my24h.html');
  });

};
