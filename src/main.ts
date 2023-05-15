import './style.css'
import { Scene, Game, GameObjects } from 'phaser';

const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {
  private box: GameObjects.Rectangle | undefined;

  constructor() {
    super('scene-game');
  }

  create() {
    this.box = this.add.rectangle(200, 200, 100, 100, 0xff0000);
    this.box.setStrokeStyle(4, 0x000000);
    this.box.setOrigin(0.5, 0.5);
  }

  update(time: number, delta: number) {
    if (!this.box) {
      return;
    }

    this.box.rotation += 0.0005 * delta;
  }
}

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true
    }
  },
  scene: [
    GameScene
  ]
}

new Game(config);
