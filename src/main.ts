import Phaser from 'phaser';
import gameConfig from './gameConfig';

function newGame () {
  if (game) return;
  game = new Phaser.Game(gameConfig);
}

let game: Phaser.Game;

if (!game) newGame();
