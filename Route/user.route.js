import mongoose from 'mongoose';
const User = mongoose.model('User');

module.exports = (app) => {

  //Frontend Route
  app.get('/user/register', (req, res) => {
    res.render('User/register.html');
  });

  app.get('/user/login', (req, res) => {
    res.render('User/login.html');
  });

  //Frontend Route
  app.get('/', (req, res) => {
    res.render('splash.html');
  });

  //Backend API
  app.post('/api/user/register', (req, res) => {
    User.create({
      email: req.body.email,
      password: req.body.password,
    }, (err, newUser) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(newUser);
      }
    })
  });

  app.post('/api/user/login', (req, res) => {
    User.findOne({
      email: req.body.email,
      password: req.body.password,
    }, (err, currentUser) => {
      if (err) {
        res.status(400).send(err);
      } else {
        if(currentUser){
          res.send(currentUser);
        }
        else{
          res.status(403).send({});
        }
      }
    })
  });

};
