// Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let playerId = null;
let opponentId = null;
let playerScore = 0;
let opponentScore = 0;

// Start the game when the start button is clicked
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startGame();
});

function startGame() {
    // Generate random player ID
    playerId = 'player-' + Math.random().toString(36).substr(2, 9);
    document.getElementById('player-name').innerText = 'Player ' + playerId.substr(7);

    // Create a unique game code
    const gameCode = generateGameCode();
    document.getElementById('game-code').innerText = 'Share this game code with your opponent: ' + gameCode;

    // Listen for changes in the game state
    database.ref('game').on('value', snapshot => {
        const gameState = snapshot.val();
        if (gameState && gameState.opponentId) {
            opponentId = gameState.opponentId;
            if (gameState.playerChoice && gameState.opponentChoice) {
                updateScore(gameState.playerChoice, gameState.opponentChoice);
                displayResult(gameState.playerChoice, gameState.opponentChoice);
            }
        }
    });

    // Listen for changes in player score
    database.ref('scores/' + playerId).on('value', snapshot => {
        playerScore = snapshot.val() || 0;
        document.getElementById('player-score').innerText = `Your Score: ${playerScore}`;
    });

    // Listen for changes in opponent score
    database.ref('scores/' + opponentId).on('value', snapshot => {
        opponentScore = snapshot.val() || 0;
        document.getElementById('opponent-score').innerText = `Opponent Score: ${opponentScore}`;
    });

    // Listen for player choices
    document.querySelectorAll('.options button').forEach(button => {
        button.addEventListener('click', () => {
            if (playerId) {
                const playerChoice = button.id;
                database.ref('game/' + playerId).update({ choice: playerChoice });
            }
        });
    });
}

// Function to generate a random game code
function generateGameCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
