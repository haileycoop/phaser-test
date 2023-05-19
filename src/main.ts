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
    this.box.setInteractive();
    this.input.setDraggable(this.box, true);
    this.input.on('drag', this.handleDrag, this);
  }

  handleDrag(pointer: Phaser.Input.Pointer, gameObject: GameObjects.GameObject, dragX: number, dragY: number) {
      gameObject.setPosition(dragX, dragY);
    }

  update() {
    

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
