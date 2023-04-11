export {};

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/main-app.router')
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
};

const app = express();
const port = 80;

app.use(cors(corsOptions));
app.use('/', router);
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.get('/', (req: any, res:any) => {
   res.sendFile(path.resolve(__dirname, '../', 'differ-web-app', 'public', 'index.html'));
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});

