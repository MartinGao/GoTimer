import mongoose from 'mongoose';
import moment from 'moment';
import async from 'async';
const Log = mongoose.model('Log');

module.exports = (app) => {

  //Frontend Route
  app.get('/history/list/:userId/:date', (req, res) => {

    console.log(moment(req.params.date).get('date'))
    console.log(moment(req.params.date).format())

    console.log('gte ' + moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).format())
    console.log('lt ' + moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).format())

    Log.find({
      user: req.params.userId,
      created: {
          $gte: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).format(),
          $lt: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).format(),
      },
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
          let ss = ("0" + Math.floor(dd.asHours()) ).slice(-2) + moment(msms).format(":mm:ss");


          temp.estimatedDurationString = ss;

          temp.startedString = moment(log.started).format('YYYY-MM-DD hh:mm:ss')
          temp.endedString = moment(log.ended).format('YYYY-MM-DD hh:mm:ss')

          if(temp.started === null && temp.ended === null){
            temp.actualDurationString = "N/A";
            temp.startedString = "Haven't started";
            temp.actualDurationString = "Haven't started";
            temp.endedString = "Haven't started";
          }

          if(temp.ended === null && temp.started != null){
            temp.endedString = "In Progress";
            temp.actualDurationString = "In Progress";
          }

          if(temp.estimatedTime == 0){
            temp.estimatedDurationString = 'N/A';
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

  app.get('/history/charts/:userId/:date', (req, res) => {

    Log.find({
      user: req.params.userId,
      ended: { $ne : null},
      created: {
          $gte: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).format(),
          $lt: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).format(),
      },
    },(err ,logs) => {
      res.render('History/charts.html', {
        items: logs
      });
    })
  })

  app.get('/api/history/charts/:userId/:date', (req, res) => {

    console.log(moment(req.params.date).get('date'))
    console.log(moment(req.params.date).format())

    console.log('gte ' + moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).format())
    console.log('lt ' + moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).format())

    Log.aggregate([
        {
            $match: {
              user: mongoose.Types.ObjectId(req.params.userId),
              ended: { $ne : null},
              // created: {
              //     $gte: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).format(),
              //     $lt: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).format(),
              // },
            }
        },
        {
            $group: {
              _id: '$category',
              items: {$push :{
                name : '$name',
                estimatedTime : '$estimatedTime',
                started : '$started',
                ended : '$ended',
                category : '$category',
              }}
            }
        }
    ], (err, logs) => {
      let newLogs = [];
      console.log(logs)

      async.eachSeries(logs,(category,categoryCb) => {
        console.log(category)
          var time = 0;
          async.eachSeries(category.items,(item,itemCb) => {
            time += moment(item.ended).diff(moment(item.started)) / 60 / 1000;
            itemCb();
          }, () => {
            newLogs.push({
              category: category._id,
              time: time,

              color: '#'+Math.floor(Math.random()*16777215).toString(16),
              value: time,
              highlight:  '#'+Math.floor(Math.random()*16777215).toString(16),
              label: category._id,
            })
            categoryCb();
          })

      },() => {
        console.log(newLogs);
        res.send(newLogs)
      });



    })

  });

  app.get('/history/my24h', (req, res) => {
    res.render('History/my24h.html');
  });

};
