import express from 'express';
import nunjucks from 'nunjucks';

const app = express();

app.listen(3000, () => {
  console.log('Application listening on port 3000!');
});
app.get('/src/:parentPath/:path', (req, res) => {
  const path = req.params.path;
  const parentPath = req.params.parentPath;
  res.sendFile(parentPath + '/' + path, { root: './src/' });
});

nunjucks.configure('public', {
  autoescape: true,
  express: app,
});


app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/privacy', (req, res) => {
  res.render('privacy.html');
});

//  The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (req, res) => {
  res.status(404).render('404.html');
});
