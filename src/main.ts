import './style.css'
import { Scene, Game, GameObjects } from 'phaser';
import * as Colyseus from "colyseus.js";

// Connect to the local colyseus server
const client = new Colyseus.Client('ws://localhost:4445');

// Set up the canvas on which the game will be rendered
const canvas = document.getElementById('game') as HTMLCanvasElement;

// Declare the room variable
let room: Colyseus.Room<unknown>;

// Join or create a room
// client.joinOrCreate("game_room").then((roomInstance: Colyseus.Room<unknown>) => {
//     console.log(roomInstance.sessionId, "joined", roomInstance.name);

//     // Store the room instance in the variable
//     room = roomInstance;
    
//     // Handle room events
//     // // Room state update
//     room.onStateChange((state) => {
//       console.log(room.name, "has new state:", state);
//     });
//     // Receive messages from server
//     room.onMessage("message_type", (message) => {
//       console.log(roomInstance.sessionId, "received on", room.name, message);
//     });
//     // Handle room errors
//     room.onError((code, message) => {
//       console.log(roomInstance.sessionId, "couldn't join", room.name);
//       console.error("Error:", message, " | Code: ", code); // Log the error message from the server
//     });
//     // Client left room
//     room.onLeave((code) => {
//       console.log(roomInstance.sessionId, "left", room.name, " | Code: ", code);
//     });
  
//     // Access the Colyseus room instance within the GameScene
//     const gameScene = new GameScene(roomInstance);
//     const config = {
//       // ... rest of the config
//       scene: [gameScene]
//     };
//     new Game(config);
// }).catch(e => {
//     console.log("JOIN ERROR", e);
// });


class GameScene extends Scene {
  private box: GameObjects.Rectangle | undefined;
  private room: Colyseus.Room<unknown> | undefined; // Add a property to hold the Colyseus room instance

  constructor(room: Colyseus.Room<unknown>) {
    super('scene-game');
    this.room = room; // Store the Colyseus room instance
  }

  create() {
    // Create the box and make it interactive but not draggable yet
    this.box = this.add.rectangle(200, 200, 100, 100, 0xff0000);
    this.box.setStrokeStyle(4, 0x000000);
    this.box.setOrigin(0.5, 0.5);
    this.box.setInteractive();

    // Start connecting to the room
    client.joinOrCreate("game_room").then((roomInstance: Colyseus.Room<unknown>) => {
        this.room = roomInstance;
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

  // create() {
  //   this.box = this.add.rectangle(200, 200, 100, 100, 0xff0000);
  //   this.box.setStrokeStyle(4, 0x000000);
  //   this.box.setOrigin(0.5, 0.5);
  //   this.box.setInteractive();
  //   this.input.setDraggable(this.box, true);

  //   // Logging a message using the room instance
  //   if (this.room) {
  //     console.log("this.room:", this.room);
  //     console.log("Connected to room:", this.room.name);
  //   }

  //   // Bind the handleDrag function to the correct context
  //   this.handleDrag = this.handleDrag.bind(this);

  //   // Add the drag event listener
  //   this.input.on('drag', this.handleDrag);

  // }


  handleDrag(pointer: Phaser.Input.Pointer, gameObject: GameObjects.GameObject, dragX: number, dragY: number) {
    if (gameObject instanceof Phaser.GameObjects.Rectangle) {
        
        gameObject.setPosition(dragX, dragY);

        console.log("this.room:", this.room); // Add this line

        // Send the updated box position to the server
      if (this.room) {
          console.log("handleDrag method called!");
          const position = { x: dragX, y: dragY };
          this.room.send("updateBoxPosition", position);
          console.log("Sent box position to server:", position);
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
  scene: [
    GameScene
  ]
}

new Game(config);
