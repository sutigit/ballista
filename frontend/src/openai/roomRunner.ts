import { Text, TextDelta } from "openai/resources/beta/threads/messages.mjs";
import Room from "./room";
import OpenAISDK from "./sdk";

const room = new Room();
const osdk = new OpenAISDK();

type Events =
  | "discussionStarted"
  | "nextSpeakerTurn"
  | "roomTextCreated"
  | "roomTextDelta"
  | "roomTextEnded"
  | "speakerTurnEnd"
  | "discussionEnded"
  | "error";

export default class RoomRunner {
  private events: { [key: string]: Function[] };

  constructor() {
    this.events = {};
  }

  on(event: Events, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    return this;
  }

  private emit(event: string, data: any) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }

  async startDiscussion(roomId: string) {
    const r = room.inspectRoom(roomId);
    if (!r) {
      this.emit("error", { error: "Room not found" });
      return false;
    }

    if (!r.threadId) {
      this.emit("error", { error: "Room is no longer valid" });
      return false;
    }

    if (r.assistants.length === 0) {
      this.emit("error", {
        error: "Must have at least one assistant in the room",
      });
      return false;
    }

    if (r.discussionTopic === null) {
      this.emit("error", { error: "Must have a discussion topic" });
      return false;
    }

    if (r.turnLimit <= 0) {
      this.emit("error", { error: "Turn limit must be greater than 0" });
      return false;
    }

    if (r.discussionStarter < 0 || r.discussionStarter >= r.assistants.length) {
      this.emit("error", { error: "Invalid discussion starter" });
      return false;
    }

    // Start discussion
    this.emit("discussionStarted", {});

    let currentTurn: number = 0;
    let assistantTurn: number = r.discussionStarter;

    while (currentTurn < r.turnLimit) {
      for (let i = 0; i < r.assistants.length; i++) {
        const selectedAssistantId = r.assistants[assistantTurn];
        this.emit("nextSpeakerTurn", selectedAssistantId);

        try {
          const run = osdk.createRun(r.threadId, selectedAssistantId);

          if (run) {
            await new Promise((resolve, reject) => {
              run
                .on("textCreated", (text) => {
                  this.emit("roomTextCreated", {
                    assistantId: selectedAssistantId,
                    text,
                  });
                })
                .on("textDelta", (textDelta, snapshot) => {
                  this.emit("roomTextDelta", {
                    textDelta,
                  });
                })
                .on("end", () => {
                  this.emit("roomTextEnded", {});
                  resolve(null);
                })
                .on("error", (err) => {
                  this.emit("error", {
                    error: `Error in run: ${JSON.stringify(err, null, 2)}`,
                  });
                  reject(err);
                });
            });
          }
        } catch (err) {
          this.emit("error", { error: "Error during assistant turn" });
          return false;
        }

        this.emit("speakerTurnEnd", {});

        // Determine the next assistant to speak
        if (r.turnPolicy === "sequential") {
          assistantTurn = (assistantTurn + 1) % r.assistants.length;
        }

        // TODO: Implement random turn policy
        // else if (r.turnPolicy === "random") {
        // }
      }

      currentTurn++;
    }

    this.emit("discussionEnded", {});
    return this; // For method chaining
  }
}
