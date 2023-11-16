const express = require('express')
const WebSocket = require('ws');
const chokidar = require('chokidar');
const app = express()
const port = 3001
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const fs = require('fs');
const os = require('os');
const path = require('path');
const desktopPath = path.join(os.homedir(), 'Desktop');
const dataFolderPath = path.join(desktopPath, 'fila de atendimento');

let files_number
//=========================================================================================

const server = app.listen(port, () => {
  console.log("http://localhost:3001");
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, 'index.html'));

});
//Receives data from mobile device connected to localhost and handles it
app.post('/input', (req, res) => {
  const data = req.body.text;

  res.send(`Server: received from android: ${data}`);

  createFileInDesktop(data)
});
//Sends all txt files (names) to front end
app.get("/api/message", (req, res) => {

  //Creates folder when application starts, preventing user to do it
  fs.mkdir(dataFolderPath, (err) => {
    if (err) {}//console.log(err);
  });


  //Read existing files and send them to frontend when requested
  fs.readdir(dataFolderPath, (err, files) => {
    if (!err) {
      //Filters only .txt files
      let txtFilesList = files.filter(file => path.extname(file) === '.txt');
      res.json(txtFilesList);
    }
  });
});

//=========================================================




//  WEBSOCKET
const wss = new WebSocket.Server({ server });
const clients = new Set(); // To store connected WebSocket clients

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  clients.add(ws);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // You can process the incoming message here and send responses back if needed.
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
    // Remove the client from the clients set
    clients.delete(ws);
  });
});
//=========================================================











//Creates txt files and send them to the desktop
function createFileInDesktop(data) {

  // create  folder in desktop if it doesn't exist
  fs.mkdir(dataFolderPath, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });



  //Checks the number of files existing in the target folder
  fs.readdir(dataFolderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files_number = files.length;

    //Creates name for the new file
    const fileName = `${files_number}_${data}.txt`;
    const filePath = path.join(dataFolderPath, fileName);


    // create 'visitante.txt' file
    fs.writeFile(filePath, data, (err) => {
      if (err) throw err;
      console.log('File created successfully');
    });

  });

}





//Checks for updates inside the target folder and triigers
// a function in the frontned
const txtDirectory = 'C:/Users/Weler/Desktop/fila de atendimento';

const watcher = chokidar.watch(txtDirectory, { ignored: /(^|[\/\\])\../ });
watcher.on('add', (filePath) => {
  if (path.extname(filePath) === '.txt') {

    //Triggers 'refresh_results' function in the frontend
    clients.forEach((client) => {
      client.send()
    });

  }
});



