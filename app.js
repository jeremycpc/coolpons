const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const router = require('./routes/routes.js');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// use middleware
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/flipclock/dist')));
app.use(
  express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'))
);
// app.use(express.static(path.join(__dirname, 'node_modules')));

//To teach our server to read JSON
app.use(bodyParser.json());

let db;

//link database
MongoClient.connect(
  'mongodb://jeremycpc:j2whirl@ds243344.mlab.com:43344/coolpons',
  { useNewUrlParser: true },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db('coolpons');

    //start the server
    app.listen(3000, () => {
      console.log('Server is up and listening on 3000');
    });
  }
);

// define routes
// app.use(require('./routes'));
app.get('/', (req, res) => {
  //load data from DB here
  db.collection('coolpons')
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err);

      // render index.ejs
      res.render('index', { coolpons: results });
    });

  // const accountSid = 'AC26ea7288da82bbbc7a6273cdeeed8bc7';
  // const authToken = '30c0ff9fd40b9dd37894d3e514091e2d';
  // const client = require('twilio')(accountSid, authToken);

  // client.messages
  //   .create({
  //     body: 'popsicles',
  //     from: 'whatsapp:+14155238886',
  //     to: 'whatsapp:+61449942381'
  //   })
  //   .then(message => console.log(message.sid))
  //   .done();
});

app.put('/claim', (req, res) => {
  db.collection('coolpons').findOneAndUpdate(
    { id: req.body.id },
    {
      $set: {
        claimed: req.body.claimed
      }
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});
