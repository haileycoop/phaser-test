import { Schema, MapSchema, type } from "@colyseus/schema";

// Define a custom schema for the box position
export class MyPosition extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
}

export class MyRoomState extends Schema {

  @type("string") roomName: string = ""; // Add the roomName property
  @type({ map: MyPosition }) boxPosition: MapSchema<MyPosition> = new MapSchema<MyPosition>();

}


