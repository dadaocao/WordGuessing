const express = require('express');
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid').v4;

const words = require('./words');
const webContent = require('./web-content');

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

// Create objects to store session data and game data
const sessions = {};
const games = {};

app.get('/', (req, res) => {
    const sessionId = req.cookies.sessionId;
    const username = sessions[sessionId];

    if (username) {
        // User logged in successfully, show Game Page
        const game = games[username];
        res.send(webContent.getData(username, game));
    } else {
        // User is not logged in, show the LogIn Page
        res.send(webContent.logIn(username));
    }
});

// LogIn logic
app.post('/login', (req, res) => { // The user enters their username in the client (chrome), the client constructs a POST request containing the username.
    const { username } = req.body; // The server receives the POST request, extracts the username from the request body, and validates it.
    const validCharacters = /^[a-zA-Z0-9]+$/; // allow-list
    const lowercaseUsername = username.toLowerCase().trim(); // Convert username to lowercase and trim extra spaces

    if (!username.match(validCharacters) || lowercaseUsername === 'dog') { // If the username is invalid, the server sends an error response to the client.
        res.status(401).send('Invalid username. <a href="/">Try again</a>');
    } else { // If the username is valid, the server creates a session ID and stores the username in the session data object.
        const sessionId = uuidv4();
        res.cookie('sessionId', sessionId);
        sessions[sessionId] = username;

        if (games[username] && req.query.newgame) { // If the user has an existing game, the server clears the game data.
            const game = {
                secretWord: pickRandomWord(words),
                remainingWords: [...words],
                guessedWords: [],
                guesses: 0,
                lastGuess: '',
                lastGuessMatches: 0,
                won: false,
            };
            games[username] = game;
            console.log(`New game started for user: ${username}, Secret Word: ${game.secretWord}`);
        } else if (!games[username]) {  // If the user does not have an existing game, the server creates a new game.
            const game = {
                secretWord: pickRandomWord(words),
                remainingWords: [...words],
                guessedWords: [],
                guesses: 0,
                lastGuess: '',
                lastGuessMatches: 0,
                won: false,
            };
            games[username] = game;
            console.log(`New game started for user: ${username}, Secret Word: ${game.secretWord}`);
        } else {
            console.log(`Resumed game for user: ${username}, Secret Word: ${games[username].secretWord}`); // If the user has an existing game and does not want to start a new game, the server resumes the existing game.
        }

        res.redirect('/');
    }
});

// Clear the game data when the user starts a new game
app.post('/new-game', (req, res) => {
    const sessionId = req.cookies.sessionId;
    const username = sessions[sessionId];

    if (username) {
        if (games[username]) {
            delete games[username];

            const game = {
                secretWord: pickRandomWord(words),
                remainingWords: [...words],
                guessedWords: [],
                guesses: 0,
                lastGuess: '',
                lastGuessMatches: 0,
                won: false,
            };
            games[username] = game;

            console.log(`New game started for user: ${username}, Secret Word: ${game.secretWord}`);
        }

        res.redirect('/');
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Guess logic
app.post('/guess', (req, res) => {
    const sessionId = req.cookies.sessionId;
    const username = sessions[sessionId];

    // If the user is logged in, the server extracts the guess from the request body and validates it.
    if (username) {
        const game = games[username];
        const guess = req.body.guess.trim().toLowerCase();

        // If the guess is valid, the server updates the game data and sends a redirect response to the client.
        if (isValidGuess(game, guess)) {
            game.guesses++;
            game.lastGuess = guess;

            const matches = getLetterMatches(game.secretWord, guess);
            game.lastGuessMatches = matches;

            if (matches === game.secretWord.length) {
                game.won = true;
            } else {
                game.remainingWords = game.remainingWords.filter((word) => word !== guess);
                game.guessedWords.push(guess);
            }

            res.redirect('/');

        // If the guess is invalid, the server sends an error response to the client.
        } else {
            res.status(400).send('Invalid guess. <a href="/">Try again</a>');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Logout logic
app.post('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;

    delete sessions[sessionId];
    res.clearCookie('sessionId');
    res.redirect('/');
});

function pickRandomWord(wordList) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

function isValidGuess(game, guess) {
    return (
        guess.length === game.secretWord.length &&
        game.remainingWords.includes(guess) &&
        !game.guessedWords.includes(guess)
    );
}

function getLetterMatches(word1, word2) {
    const word1Chars = word1.split('');
    const word2Chars = word2.split('');
    return word1Chars.filter((char) => word2Chars.includes(char)).length;
}

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
