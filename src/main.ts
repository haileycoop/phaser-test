import './style.css'
import { Scene, Game, GameObjects } from 'phaser';
import * as Colyseus from "colyseus.js";

type RoomState = {
  boxPosition: { x: number; y: number; };
  // Include other properties of the room state here...
};

// Connect to the local colyseus server
const client = new Colyseus.Client('ws://localhost:4445');

// Set up the canvas on which the game will be rendered
const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {
  private box: GameObjects.Rectangle | undefined;
  private room: Colyseus.Room<RoomState> | undefined; // Add a property to hold the Colyseus room instance

  constructor(room: Colyseus.Room<unknown>) {
    super('scene-game');
  }

  create() {
    // Create the box and make it interactive but not draggable yet
    this.box = this.add.rectangle(200, 200, 100, 100, 0xff0000);
    this.box.setStrokeStyle(4, 0x000000);
    this.box.setOrigin(0.5, 0.5);
    this.box.setInteractive();

    // Start connecting to the room
    client.joinOrCreate<RoomState>("game_room").then((roomInstance: Colyseus.Room<RoomState>) => {
        this.room = roomInstance;
      
        // Listen for changes in the room state
        this.room.onStateChange((state) => {
            // state.boxPosition is the new position of the box
            // console.log("New state received:", state);
            if (this.box) {
                // If we have a box, update its position to the one received from the server
                this.box.setPosition(state.boxPosition.x, state.boxPosition.y);
            }
        });

        // Make the box draggable now that the room is ready
        if (this.box) {
            this.input.setDraggable(this.box, true);
        }
        // Bind the handleDrag function to the correct context
        this.handleDrag = this.handleDrag.bind(this);
        // Add the drag event listener
        this.input.on('drag', this.handleDrag);
    }).catch(e => {
        console.log("JOIN ERROR", e);
    });
  }

  handleDrag(pointer: Phaser.Input.Pointer, gameObject: GameObjects.GameObject, dragX: number, dragY: number) {
    if (gameObject instanceof Phaser.GameObjects.Rectangle) {
        
        gameObject.setPosition(dragX, dragY);

        // console.log("this.room:", this.room);

      // Send the updated box position to the server
      if (this.room) {
          const position = { x: dragX, y: dragY };
          this.room.send("updateBoxPosition", position);
          // console.log("Sent box position to server:", position);
        }
      }
  }

  update() {
    
  }
}

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight, canvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true
    }
  },
  audio: {
    noAudio: true
  },
  scene: [
    GameScene
  ]
}

new Game(config);
