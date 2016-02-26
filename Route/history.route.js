import mongoose from 'mongoose';
import moment from 'moment';
import async from 'async';
import _ from 'lodash';
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

    console.log('gte ' + moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).toDate())
    console.log('lt ' + moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).toDate())




    Log.aggregate([
        {
            $match: {
              user: mongoose.Types.ObjectId(req.params.userId),
              ended: { $ne : null},
              created: {

                $gte: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).toDate(),
                $lt: moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).toDate(),

                  // $lte : { "$date" : moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).toDate()},
                  // $gte : { "$date" : moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).toDate()}

                  // $gte: new Date(moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date')]).format('YYYY-MM-DD')),
                  // $lt:  new Date(moment([moment(req.params.date).get('years'), moment(req.params.date).get('months'), moment(req.params.date).get('date') + 1]).format('YYYY-MM-DD')),
              },
            }
        },
        {
            $group: {
              _id: '$category',
              items: {$push :{
                name : '$name',
                created : '$created',
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


      let colorTable = {
        'Eat': '#113F8C',
        'Entertainment': '#01A4A4',
        'Housework': '#00A1CB',
        'Sport': '#61AE24',
        'Sleep': '#D0D102',
        'Study': '#32742C',
        'Transport': '#D70060',
        'Work': '#E54028',
        'Others': '#F18D05',
      }

      let totalTime = 0;
      _.map(logs,(a) => {
        totalTime += _.sumBy(a.items, (aa) => {
          return parseFloat(moment(aa.ended).diff(moment(aa.started)) / 60 / 1000);
        })
      })

      console.log('totalTime -> ' + totalTime);

      async.eachSeries(logs,(category,categoryCb) => {
        console.log(category)
          var time = 0;
          async.eachSeries(category.items,(item,itemCb) => {
            time += moment(item.ended).diff(moment(item.started)) / 60 / 1000;
            itemCb();
          }, () => {

            let temp = {
              category: category._id,
              time: time,

              color: colorTable[category._id],
              value: time,
              totalMinutes: (time / 60).toFixed(2),
              highlight: colorTable[category._id],
              label: category._id,
            }

            let msms = moment().diff(moment().add(-temp.time,'minutes'));
            let dd = moment.duration(msms);
            let ss = ("0" + Math.floor(dd.asHours()) ).slice(-2) + moment(msms).format(":mm:ss");


            temp.totalMinutes = ss;
            temp.percentage = ((time / totalTime) * 100).toFixed(2) + '%'

            newLogs.push(temp)
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
