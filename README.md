# 🎲 Farkle Multiplayer Game

Welcome to the **Farkle Multiplayer Game** repository! This project is a digital implementation of the popular dice game *Farkle*, featuring real-time multiplayer functionality using **boardgame.io's experimental P2P library**. The game adheres to the official Farkle rules and provides an engaging experience for players.

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [How to Play](#how-to-play)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## 📝 About the Project

**Farkle Multiplayer Game** brings the classic dice game to your browser. Play with friends in real-time and compete to reach 10,000 points first! This project is built using modern web technologies like React, Next.js, and boardgame.io, with its experimental P2P library enabling seamless peer-to-peer connections.

---

## ✨ Features

- 🎮 **Multiplayer Gameplay**: Host or join games with friends using a match ID.
- 🎲 **Automatic Dice Rolling**: Rolls are automatic at the start of each turn.
- 🧮 **Score Calculation**: Adheres to official Farkle scoring rules.
- 🔥 **Hot Dice Mechanics**: Keep rolling when all six dice score!
- ❌ **Farkle Detection**: Lose your turn if no scoring dice are rolled.
- 🏆 **Winning Logic**: Reach 10,000 points to trigger the final round.
- 💻 **Real-Time Synchronization**: Game state is shared between players using boardgame.io's P2P library.

---

## 🎲 How to Play

1. **Objective**: Be the first player to score 10,000 points or more.
2. **Gameplay**:
   - Players take turns rolling six dice.
   - After each roll, select at least one scoring die (1s, 5s, or combinations like three of a kind).
   - Decide whether to bank your points or risk rolling the remaining dice.
   - If no scoring dice are rolled, you "Farkle" and lose all points for that turn.
3. **Winning**:
   - Once a player reaches 10,000 points, all other players get one final turn.
   - The player with the highest score wins!

For detailed rules, refer to the [official Farkle rules](https://farkle.games/official-rules/).

---

## 🛠️ Installation

Follow these steps to set up the project locally:

1. Clone the repository:

```
git clone https://github.com/yourusername/farkle-multiplayer.git
cd farkle-multiplayer
```

2. Install dependencies:

```
npm install
```

3. Start the development server:
```npm run dev```


4. Open your browser and navigate to:
```http://localhost:3000```


---

## 🚀 Usage

### Hosting a Game
1. Click "Host Game" on the home page.
2. Share the generated match ID with your friend(s).
3. Wait for at least one player to join before starting.

### Joining a Game
1. Click "Join Game" on the home page.
2. Enter the match ID shared by the host.
3. Start playing once connected!

---

## 💻 Technologies Used

This project leverages modern web technologies:

- **React**: For building dynamic user interfaces.
- **Next.js**: For server-side rendering and routing.
- **boardgame.io**: For managing game logic and state synchronization.
- **@boardgame.io/p2p**: For peer-to-peer multiplayer functionality.
- **TypeScript**: For type-safe development.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can get involved:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.


---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/ecuzmici/farkle-multiplayer/LICENSE.md) file for details.

---


## 📬 Contact

For questions or feedback, feel free to reach out:

- Email: ecuzmici@gmail.com
- GitHub Issues: [Open an Issue](https://github.com/ecuzmici/farkle-multiplayer/issues)

---

