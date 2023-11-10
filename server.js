const http = require('http'); //The way node js to import packages
const app = require('./app');
require("dotenv").config();
const port = process.env.PORT || 3000; //If not use the envorinment settled port, 3000

const server = http.createServer(app); //execute when get new request then return response

server.listen(port); //listen to this port then pass to createServer