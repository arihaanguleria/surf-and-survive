# Surf & survive

Surf & survive is a fast-paced browser game where you must navigate your windsurfer through an endless, AI-driven obstacle course. Dodge buoys and hazards as the speed increases, and try to reach the ultimate challenge: the fastest possible obstacle spawn rate!

## Gameplay
- **Control your windsurfer** using the arrow keys or WASD.
- **Avoid obstacles** (buoys) that appear and move down the screen.
- **Wind speed** (obstacle spawn rate) increases as you progress. The interval meter shows how fast obstacles are coming.
- If you hit an obstacle, the game pauses and you can restart.
- **Freeplay Mode:** Toggle the button in the bottom left to play endlessly without game over.
- **Win Condition:** If you survive until the interval meter reaches 0.000001s, you win!

## How to Start the Game
1. Clone or download this repository.
2. Open the `surf-and-survive` folder.
3. Open `index.html` in your web browser (Chrome, Firefox, Edge, or Safari).

Or, if you want to run a local server (recommended for best experience):

```sh
python3 -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000) in your browser.

## How to Stop the Game
- Simply close the browser tab or window.
- If running a local server, stop it with `Ctrl+C` in your terminal.

## Controls
- **Move:** Arrow keys or WASD
- **Restart:** Click the "Restart Game" button when you lose or win
- **Freeplay Mode:** Toggle with the button in the bottom left

## License
MIT License (see LICENSE file)

---
Enjoy the challenge and see if you can truly Surf & survive!
