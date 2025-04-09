import OpenAISDK from "./sdk";
import fs from "fs";
import { nanoid } from "nanoid";

const osdk = new OpenAISDK();

export interface Room {
  id: string;
  description: string;
  threadId: string;
  assistants: string[];
  turnPolicy: "random" | "sequential";
  turnLimit: number;
  discussionStarter: number;
  discussionTopic: string | null;
}

export default class RoomAPI {
  path: string;
  maxAssistants: number;
  defaultTurnLimit: number;
  defaultTurnPolicy: "random" | "sequential";
  defaultDiscussionStarter: number;

  events: { [key: string]: Function[] };

  constructor() {
    this.path = "./src/openai/data/rooms.json";
    this.maxAssistants = 4;
    this.defaultTurnLimit = 3;
    this.defaultTurnPolicy = "sequential";
    this.defaultDiscussionStarter = 0;

    // For observer pattern
    this.events = {};
  }

  getRooms() {
    if (!fs.existsSync(this.path)) {
      console.warn("No rooms.json file found.");
      return [];
    }

    try {
      const fileContent = fs.readFileSync(this.path, "utf-8");
      const rooms = JSON.parse(fileContent);

      if (!Array.isArray(rooms)) {
        console.error("Invalid format: rooms.json should contain an array.");
        return [];
      }

      return rooms;
    } catch (err) {
      console.error("Error reading or parsing rooms.json file:", err);
      return [];
    }
  }

  async createRoom() {
    const thread = await osdk.createThread();
    if (!thread) {
      console.error("Failed to create thread");
      return false;
    }

    const newRoom: Room = {
      id: "room_" + nanoid(),
      description: "New Discussion",
      threadId: thread.id,
      assistants: [],
      turnPolicy: this.defaultTurnPolicy,
      turnLimit: this.defaultTurnLimit,
      discussionStarter: this.defaultDiscussionStarter,
      discussionTopic: null,
    };

    let existingData = [];

    // Read existing file (or start with an empty array if file doesn't exist)
    if (fs.existsSync(this.path)) {
      const fileContent = fs.readFileSync(this.path, "utf-8");
      try {
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) existingData = [];
      } catch (err) {
        console.error("Invalid JSON, resetting to empty array.");
        existingData = [];
      }
    }

    // Add new entry
    existingData.push(newRoom);

    // Write updated array back to file
    try {
      fs.writeFileSync(this.path, JSON.stringify(existingData, null, 2));
      return newRoom;
    } catch (err) {
      console.error("Error writing file:", err);
      await osdk.deleteThread(thread.id);
      return false;
    }
  }

  async deleteRoom(roomId: string) {
    if (!fs.existsSync(this.path)) {
      console.error("File does not exist.");
      return false;
    }

    let rooms;
    try {
      const fileContent = fs.readFileSync(this.path, "utf-8");
      rooms = JSON.parse(fileContent);

      if (!Array.isArray(rooms)) {
        console.error("JSON is not an array.");
        return false;
      }
    } catch (err) {
      console.error("Error reading or parsing file:", err);
      return false;
    }

    // Get the deleted room
    const deletedRoom = rooms.find((room) => room.id === roomId);

    // Filter out the room to be deleted
    const updatedRooms = rooms.filter((room) => room.id !== roomId);

    // Write updated array back and delete the room
    try {
      fs.writeFileSync(this.path, JSON.stringify(updatedRooms, null, 2));
    } catch (err) {
      console.error("Error writing file:", err);
      return false;
    }

    // delete thread from openai
    try {
      await osdk.deleteThread(deletedRoom.threadId);
      console.log("Thread deleted from OpenAI successfully!");
      return deletedRoom;
    } catch (err) {
      console.error("Error deleting thread from OpenAI:", err);
      return false;
    }
  }

  inspectRoom(roomId: string): Room | false {
    const rooms = this.getRooms();
    const room = rooms.find((room) => room.id === roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    } else {
      return room;
    }
  }

  private updateRoom(
    roomId: string,
    newRoomData: {
      threadId?: string;
      assistants?: string[];
      description?: string;
      turnPolicy?: string;
      turnLimit?: number;
      discussionStarter?: number;
      discussionTopic?: string | null;
    }
  ) {
    const rooms = this.getRooms();
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    if (roomIndex === -1) {
      console.error("Room not found");
      return false;
    }

    // Destructure current room data and merge with new data
    const updatedRoom = { ...rooms[roomIndex], ...newRoomData };

    // Update room in the array
    rooms[roomIndex] = updatedRoom;

    // Write updated array back to file
    try {
      fs.writeFileSync(this.path, JSON.stringify(rooms, null, 2));
      return updatedRoom;
    } catch (err) {
      console.error("Error writing file:", err);
      return false;
    }
  }

  getAssistantsInRoom(roomId: string) {
    const room = this.inspectRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    }

    return room.assistants;
  }

  addAssistantToRoom(roomId: string, assistantId: string) {
    const room = this.inspectRoom(roomId);

    if (!room) {
      console.error("Room not found");
      return false;
    }

    if (room.assistants.length >= this.maxAssistants) {
      console.error("Room is full");
      return false;
    }

    if (room.assistants.includes(assistantId)) {
      console.error("Assistant already in room");
      return false;
    }

    // Add assistant to room
    room.assistants.push(assistantId);

    // Update room in the file
    const updatedRoom = this.updateRoom(roomId, {
      assistants: room.assistants,
    });

    if (!updatedRoom) {
      console.error("Failed to update room");
      return false;
    }

    return updatedRoom;
  }

  removeAssistantFromRoom(roomId: string, assistantId: string) {}

  async updateRoomTopic(roomId: string, topic: string) {
    const room = this.inspectRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    }

    // Update room in the file
    const updatedRoom = this.updateRoom(roomId, {
      discussionTopic: topic,
    });

    if (!updatedRoom) {
      console.error("Failed to update room");
      return false;
    }

    // Add the topic to thread
    const message = await osdk.addMessageToThread(room.threadId, topic);
    if (!message) {
      this.deleteRoomTopic(roomId);
      return false;
    }

    return updatedRoom;
  }

  deleteRoomTopic(roomId: string) {
    const room = this.inspectRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    }

    // Update room in the file
    const updatedRoom = this.updateRoom(roomId, {
      discussionTopic: null,
    });

    if (!updatedRoom) {
      console.error("Failed to update room");
      return false;
    }

    // Reset the thread
    const resetThread = this.resetRoomThread(roomId);

    return updatedRoom;
  }

  async getDiscussionInRoom(roomId: string) {
    const room = this.inspectRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    }
    if (!room.threadId) {
      console.error("Room is no longer valid");
      return false;
    }

    const messages = await osdk.getMessagesFromThread(room.threadId);
    if (!messages) {
      console.error("Failed to get messages from thread");
      return false;
    }

    return messages;
  }

  async resetRoom(roomId: string) {
    const room = this.inspectRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    }

    // Create new thread
    const newThread = await osdk.createThread();
    if (!newThread) {
      console.error("Failed to create new thread, please try again");
      return false;
    }
    const newThreadId = newThread.id;

    // Reset room in the file
    const updatedRoom = this.updateRoom(roomId, {
      threadId: newThreadId,
      assistants: [],
      description: "New Discussion",
      turnPolicy: this.defaultTurnPolicy,
      turnLimit: this.defaultTurnLimit,
      discussionStarter: this.defaultDiscussionStarter,
      discussionTopic: null,
    });

    if (!updatedRoom) {
      console.error("Failed to reset room");
      await osdk.deleteThread(newThreadId);
      return false;
    }

    // Delete the old thread
    try {
      await osdk.deleteThread(room.threadId);
      console.log("Old thread deleted successfully!");
    } catch (err) {
      console.error("Error deleting old thread:", err);
      return false;
    }

    return updatedRoom;
  }

  async resetRoomThread(roomId: string) {
    const room = this.inspectRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return false;
    }

    // Create new thread
    const newThread = await osdk.createThread();
    if (!newThread) {
      console.error("Failed to create new thread, please try again");
      return false;
    }
    const newThreadId = newThread.id;

    // Reset room in the file
    const updatedRoom = this.updateRoom(roomId, {
      threadId: newThreadId,
      discussionTopic: null,
    });

    if (!updatedRoom) {
      console.error("Failed to reset room");
      await osdk.deleteThread(newThreadId);
      return false;
    }

    // Delete the old thread
    try {
      await osdk.deleteThread(room.threadId);
      console.log("Old thread deleted successfully!");
    } catch (err) {
      console.error("Error deleting old thread:", err);
      return false;
    }

    return updatedRoom;
  }
}
