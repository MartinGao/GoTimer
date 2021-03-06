import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import chalk from 'chalk';

const app = express();

const timers = require('./timer.json');

app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});
app.get('/src/:parentPath/:path', (req, res) => {
  const path = req.params.path;
  const parentPath = req.params.parentPath;
  res.sendFile(parentPath + '/' + path, { root: './src/' });
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import LogModel from './Model/log.model';
import UserModel from './Model/user.model';
LogModel(app);
UserModel(app);

import LogRoute from './Route/log.route';
import HistoryRoute from './Route/history.route';
import AchievementRoute from './Route/achievement.route';
import SettingRoute from './Route/setting.route';
import UserRoute from './Route/user.route';
LogRoute(app);
HistoryRoute(app);
AchievementRoute(app);
SettingRoute(app);
UserRoute(app);


nunjucks.configure('public', {
  autoescape: true,
  express: app,
});

app.get('/myday', (req, res) => {
  res.render('myday.html');
});

app.get('/settings', (req, res) => {
  res.render('settings.html');
});

// app.get('/', (req, res) => {
//   res.render('index.html', { items: timers });
// });


// app.get('/', (req, res) => {
//   const coin = Math.random();
//   if (coin > 0.5){
//     console.log('coin -> ' + coin);
//     res.redirect('/log/list')
//   } else {
//     console.log('coin -> ' + coin);
//     res.redirect('/log/list-versionB')
//   }
// });

app.get('/src/:parentPath/:path', function(req, res){
  let path        = req.params.path;
  let parentPath  = req.params.parentPath;
  res.sendFile(parentPath + '/' + path, {root: './src/'});
});

//  The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (req, res) => {
  res.status(404).render('404.html');
});
//connect with database
mongoose.connect('mongodb://db.siriolabs.com/go-timer-dev', (err) => {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Successfully connect to MongoDB!'));
  }
});
