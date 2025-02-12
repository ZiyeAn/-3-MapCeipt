import {SerialPort} from 'serialport';
import { ReadlineParser } from 'serialport';  // Use the built-in parser for reading serial data line by line

// Create a new serial port connection
const port = new SerialPort({
    path: '/dev/tty.wchusbserialfa1410',  // Adjust this port to your Arduino's port
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

// Create a new parser that will read the incoming data line-by-line
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Handle incoming data from the serial port
parser.on('data', (data) => {
    console.log('Data received from Arduino: ', data);
});

// Example server setup to handle incoming requests and send data to Arduino
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for messages from the client
    socket.on('message', (data) => {
        console.log('Message from client: ', data.message);

        // Send the message to the Arduino via the serial port
        port.write(data.message + '\n', (err) => {
            if (err) {
                return console.log('Error writing to serial port: ', err.message);
            }
            console.log('Message sent to Arduino: ', data.message);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});