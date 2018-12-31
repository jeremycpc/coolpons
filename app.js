const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const router = require('./routes/routes.js');
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 3000;
const app = express();
const mailer = require('nodemailer');

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
    app.listen(PORT, () => {
      console.log('Server is up and listening on: ' + PORT);
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
      // Use Smtp Protocol to send Email
      const couponValue = result.value.detail;
      const notes = req.body.notes;
      let html;

      if (notes) {
        html =
          '<h1>Milly just claimed ' +
          couponValue +
          '! She also left a note for you: ' +
          notes +
          ' </h1>';
      } else {
        html = '<h1>Milly just claimed ' + couponValue + '!';
      }

      var smtpTransport = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'jeremycpc2@gmail.com',
          pass: '127jajbsushi'
        }
      });

      var mail = {
        from: 'Jeremy Chiang <jeremycpc2@gmail.com>',
        to: 'jeremycpc2@gmail.com',
        subject: 'Milly claimed ' + couponValue,
        text: 'Milly just claimed ' + couponValue + ' !',
        html: html
      };

      smtpTransport.sendMail(mail, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + response.messageId);
        }

        smtpTransport.close();
      });

      res.send(result);
    }
  );
});
