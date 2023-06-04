import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.setState(new MyRoomState());
    this.state.roomName = "game_room";
    console.log(this.state.roomName, this.roomId, "creating...");

    this.onMessage("updateBoxPosition", (client, position) => {
      // console.log("Received box position from client:", client.sessionId, position);
      // Update the box position in the room state
      this.state.boxPosition.x = position.x;
      this.state.boxPosition.y = position.y;
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // Send the initial box position to the joined client
    client.send("updateBoxPosition", this.state.boxPosition);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
