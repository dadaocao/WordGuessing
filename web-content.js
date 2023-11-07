const webContent = {
    getData: function (username, game){
        return`
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Word Guessing Game</title>
                    <link rel="stylesheet" href="/css/styles.css">
                </head>
                <body>
                    <header class="header">
                        <img class="logo" src="//placekitten.com/50/50" alt="random cat in lieu of logo"/>
                        <h1>Relax for a while</h1> 
                    </header>
                    <main class="main">
                        <h1>Welcome, ${username}!</h1>
<!--                        <p>Secret Word: ${game.secretWord}</p>-->
                        <p>Remaining Words: ${game.remainingWords.join(', ')}</p>
                        <p>Guessed Words: ${game.guessedWords.join(', ')}</p>
                        <p>Guesses: ${game.guesses}</p>
                        <p>Last Guess: ${game.lastGuess} (Matches: ${game.lastGuessMatches})</p>
                        ${game.won ? "<p>Congratulations, you won!</p>" : ""}
                        <form method="POST" action="/guess">
                            <label for="guess">Make a Guess:</label>
                            <input type="text" id="guess" name="guess">
                            <button type="submit">Submit Guess</button>
                        </form>
                        <form method="POST" action="/new-game">
                            <button type="submit">Start New Game</button>
                        </form>
                        <form method="POST" action="/logout">
                            <button type="submit">Logout</button>
                        </form>
                    </main>
                    <footer class="footer">We do care your privacy</footer>
                </body>
            </html>
        `
    },
    logIn: function(username){
        return`
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Word Guessing Game</title>
                    <link rel="stylesheet" href="/css/styles.css">
                </head>
                <body>
                    <header class="header">
                        <img class="logo" src="//placekitten.com/50/50" alt="random cat in lieu of logo"/>
                        <h1>Relax for a while</h1> 
                    </header>
                    <main class="main">
                        <h1>Type your name to log in</h1>
                        <form method="POST" action="/login">
                            <label for="username">Username:</label>
                            <input type="text" id="username" name="username">
                            <button type="submit">Login</button>
                        </form>
                    </main>
                    <footer class="footer">We do care your privacy</footer>
                </body>
            </html>
        `
    }
};

module.exports = webContent;