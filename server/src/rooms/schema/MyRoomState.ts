import { Schema, Context, type } from "@colyseus/schema";

export class MyRoomState extends Schema {

  @type("string") roomName: string = ""; // Add the roomName property

}
