import { Room, Client } from "@colyseus/core";
import { type, MapSchema } from "@colyseus/schema";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  @type({ map: "number" }) boxPosition: MapSchema<number> = new MapSchema<number>();

  onCreate (options: any) {
    this.setState(new MyRoomState());
    this.state.roomName = "game_room";
    console.log(this.state.roomName, this.roomId, "creating...");

    this.onMessage("updateBoxPosition", (client, position) => {
      this.boxPosition.set(client.sessionId, position);
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // Send the initial box position to the joined client
    if (this.boxPosition.size > 0) {
      this.send(client, "updateBoxPosition", Array.from(this.boxPosition.entries()));
    }
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
