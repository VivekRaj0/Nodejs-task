const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csvtojson = require('csvtojson');
const xlsx = require('xlsx');
const { Worker } = require('worker_threads');
const os = require('os');
const schedule = require('node-schedule');
const bodyParser = require('body-parser');

const { Agent, User, UserAccount, PolicyCategory, PolicyCarrier, PolicyInfo } = require('./model');

const app = express();
const port = 3000;
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/insurance', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware for file upload
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const worker = new Worker('./uploadWorker.js', { workerData: file.path });

  worker.on('message', (message) => {
    res.send(message);
  });

  worker.on('error', (error) => {
    res.status(500).send(error);
  });
});

app.get('/search', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ firstName: username }).exec();
  if (!user) return res.status(404).send('User not found');

  const policies = await PolicyInfo.find({ userId: user._id })
    .populate('policyCategory')
    .populate('policyCarrier')
    .exec();

  res.send(policies);
});

app.get('/aggregate', async (req, res) => {
  const aggregation = await PolicyInfo.aggregate([
    {
      $group: {
        _id: '$userId',
        totalPolicies: { $sum: 1 },
        policies: { $push: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    }
  ]);

  res.send(aggregation);
});

app.post('/scheduleMessage', (req, res) => {
  const { message, day, time } = req.body;
  const date = new Date(`${day}T${time}:00`);
  schedule.scheduleJob(date, () => {
    console.log(`Scheduled Message: ${message}`);
  });
  res.send('Message scheduled');
});

setInterval(() => {
  const load = os.loadavg()[0];
  if (load > 0.7 * os.cpus().length) {
    console.log('High CPU load detected. Restarting server...');
    process.exit(1);
  }
}, 10000);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
