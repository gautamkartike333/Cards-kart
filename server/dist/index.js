"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./user"));
const router = express_1.default.Router();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", user_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
// Player queue and room configuration
const queues = {
    3: [],
    4: [],
    5: [],
    6: []
};
//const ROOM_SIZE = 4; // Adjust the number to your room capacity
// When a user connects
io.on('connection', (socket) => {
    console.log('A player connected: ' + socket.id);
    // Handle joining a queue based on room size
    socket.on('join-queue', (roomSize) => {
        if (queues[roomSize]) {
            queues[roomSize].push(socket.id);
            console.log(`Player ${socket.id} added to queue for room size ${roomSize}. Current queue: ${queues[roomSize]}`);
            // Check if the queue has enough players to form a room
            if (queues[roomSize].length >= roomSize) {
                const roomId = `room-${Math.random().toString(36).substring(2, 10)}`; // Generate random room id
                const leaderId = queues[roomSize][0]; // Set the leaderId to the first player in the queue
                const playersInRoom = queues[roomSize].splice(0, roomSize); // Remove players from queue
                // Add players to the room and notify them
                playersInRoom.forEach((playerId) => {
                    const playerSocket = io.sockets.sockets.get(playerId);
                    if (playerSocket) {
                        playerSocket.join(roomId);
                        playerSocket.emit('room-joined', { roomId, players: playersInRoom, leaderId, playerId });
                        console.log(`Player ${playerId} added to room ${roomId}`);
                    }
                });
                console.log(`Leader ${leaderId} added to room ${roomId}`);
                //emit the leader id to all players in the room
                //io.to(roomId).emit('leader-joined', { roomId, leaderId });
                io.to(roomId).emit('start-game', `Game started in room: ${roomId} with ${roomSize} players`);
            }
        }
        else {
            console.error(`Invalid room size: ${roomSize}`);
        }
    });
    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        // Remove player from all queues
        for (const size in queues) {
            const index = queues[size].indexOf(socket.id);
            if (index !== -1) {
                queues[size].splice(index, 1);
                console.log(`Player ${socket.id} removed from queue for room size ${size}. Current queue: ${queues[size]}`);
            }
        }
    });
    //starting game and distributing cards
    socket.on('start-game', () => {
    });
});
// Basic route to check server status
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
app.post('/getCards', (req, res) => {
    const shuffleCards = (array) => {
        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    const sC = shuffleCards(cards);
    const { roomSize, roomId } = req.body;
    if (!roomSize || roomSize <= 0) {
        return res.status(400).send("Invalid room size");
    }
    const shuffledCards = shuffleCards(cards);
    // Calculate how many cards each player should get
    const cardsPerPlayer = Math.floor(shuffledCards.length / roomSize);
    const playerCards = [];
    // Distribute the cards equally among players
    for (let i = 0; i < roomSize; i++) {
        playerCards.push(shuffledCards.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer));
    }
    // If there are remaining cards (due to unequal division), distribute the extra cards
    const remainingCards = shuffledCards.slice(roomSize * cardsPerPlayer);
    for (let i = 0; i < remainingCards.length; i++) {
        playerCards[i].push(remainingCards[i]);
    }
    // io.on("connection", (socket) => {
    //     socket.to(roomId).emit("cards",);
    //   });
    playerCards.forEach(element => {
        io.on("connection", (socket) => {
            socket.to(roomId).emit("cards", element);
        });
    });
    res.send(playerCards);
    console.log(playerCards);
});
// Start the server
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
