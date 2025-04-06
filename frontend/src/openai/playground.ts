import OpenAISDK from "./sdk";
import Room from "./room";
import readline from "readline";

const sdk = new OpenAISDK();
const room = new Room();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printCommands() {
  console.log("COMMANDS");
  console.log("");
  console.log("Assistants 🤖 --------------------");
  console.log("la - list all assistants");
  console.log("");

  console.log("Rooms 🚪 --------------------------");
  console.log("lr - list all rooms");
  console.log("cr - create room");
  console.log("ir - inspect room");
  console.log("dr - delete room");

  console.log("lar - list assistants in room");
  console.log("aar - add assistant to room");
  console.log("rar - remove assistant from room");
  console.log("");

  console.log("LEGACY #########################");
  console.log("Threads 🧵 ------------------------");
  console.log("lt - list all threads");
  console.log("ct - create thread");
  console.log("dt - delete thread");
  console.log("");

  console.log("Messaging 💬 ----------------------");
  console.log("am - add message to thread");
  console.log("gm - get messages from thread");
  console.log("");

  console.log("Runs ▶️ ---------------------------");
  console.log("rt - run thread");
  console.log("");

  console.log("Quit ❌ ---------------------------");
  console.log("q - quit");
  console.log("");
}

async function command() {
  rl.question("Command: ", (answer) => {
    console.log("");

    switch (answer) {
      // ASSISTANT COMMANDS -----------------------------------------------------------------------------------
      // LIST ASSISTANTS
      case "la":
        (async () => {
          const assistants = await sdk.getAssistants();

          console.log("Assistants:");
          assistants.forEach((assistant) => {
            console.log(
              `Assistant ID: ${assistant.id}, name: ${assistant.name}`
            );
          });
          console.log("");
          command();
        })();
        break;

      // ROOM COMMANDS -----------------------------------------------------------------------------------
      // LIST ROOMS
      case "lr":
        (async () => {
          const rooms = room.getRooms();

          console.log("Rooms:");
          rooms.forEach((room) => {
            console.log(`Room ID: ${room.id}`);
          });
          console.log("");
          command();
        })();
        break;

      // CREATE ROOM
      case "cr":
        (async () => {
          const newRoom = await room.createRoom();
          if (newRoom) {
            console.log("Room created successfully!", newRoom.id);
          }
          console.log("");
          command();
        })();
        break;

      // DELETE ROOM
      case "dr":
        rl.question("Room ID: ", (roomId) => {
          (async () => {
            const deletedRoom = await room.deleteRoom(roomId);
            if (deletedRoom) {
              console.log("Room deleted successfully!");
            } else {
              console.log("Failed to delete room");
            }
            console.log("");
            command();
          })();
        });
        break;

      // INSPECT ROOM
      case "ir":
        rl.question("Room ID: ", (roomId) => {
          (async () => {
            const roomData = await room.inspectRoom(roomId);
            if (roomData) {
              console.log("---------------------");
              console.log("Room ID:", roomData.id);
              console.log("Thread ID:", roomData.threadId);
              console.log("Number of assistants:", roomData.assistants.length);
              console.log("Assistants in room:");
              roomData.assistants.forEach((assistantId: string) => {
                console.log(`Assistant ID: ${assistantId}`);
              });
            } else {
              console.log("Failed to inspect room");
            }
            console.log("");
            command();
          })();
        });
        break;

      // LIST ASSISTANTS IN ROOM
      case "lar":
        rl.question("Room ID: ", (roomId) => {
          (async () => {
            const assistants = await room.getAssistantsInRoom(roomId);
            if (assistants.length === 0) {
              console.log("No assistants in room");
            } else if (assistants > 0) {
              console.log("Assistants in room:");
              assistants.forEach((assistantId: string) => {
                console.log(`Assistant ID: ${assistantId}`);
              });
            } else {
              console.log("Failed to get assistants in room");
            }
            console.log("");
            command();
          })();
        });
        break;

      // ADD ASSISTANT TO ROOM
      case "aar":
        rl.question("Room ID: ", (roomId) => {
          rl.question("Assistant ID: ", (assistantId) => {
            (async () => {
              const updatedRoom = await room.addAssistantToRoom(
                roomId,
                assistantId
              );
              if (updatedRoom) {
                console.log("Assistant added to room successfully!");
              } else {
                console.log("Failed to add assistant to room");
              }
              console.log("");
              command();
            })();
          });
        });
        break;

      // THREAD COMMANDS -----------------------------------------------------------------------------------
      // CREATE A THREAD
      case "ct":
        (async () => {
          const thread = await sdk.createThread();
          if (thread) {
            console.log("Thread created successfully!", thread.id);
          } else {
            console.log("Failed to create thread");
          }
          console.log("");
          command();
        })();
        break;

      // LIST THREADS
      case "lt":
        const threads = sdk.getThreads();
        console.log("Threads:");
        threads.forEach((thread) => {
          console.log(`Thread ID: ${thread.id}`);
        });
        console.log("");
        command();
        break;

      // DELETE THREAD
      case "dt":
        rl.question("Thread ID: ", (threadId) => {
          (async () => {
            const success = await sdk.deleteThread(threadId);
            if (success) {
              console.log("Thread deleted from threads.json successfully!");
            } else {
              console.log("Failed to delete thread from threads.json");
            }
            console.log("");
            command();
          })();
        });
        break;

      // MESSAGING COMMANDS -----------------------------------------------------------------------------------
      // ADD MESSAGE TO THREAD
      case "am":
        rl.question("Thread ID: ", (threadId) => {
          rl.question("Message: ", (message) => {
            (async () => {
              const success = await sdk.addMessageToThread(threadId, message);
              if (success) {
                console.log("Message added to thread successfully!");
              } else {
                console.log("Failed to add message to thread");
              }
              console.log("");
              command();
            })();
          });
        });
        break;

      // GET MESSAGES FROM THREAD
      case "gm":
        rl.question("Thread ID: ", (threadId) => {
          (async () => {
            const messages = await sdk.getMessagesFromThread(threadId);
            if (messages) {
              messages.forEach((message) => {
                console.log(
                  `>> Role: ${message.role}, Message ID: ${message.id}, Assistant ID: ${message.assistantId}`
                );
                console.log("----------------------");
                if ("text" in message.content[0]) {
                  console.log(message.content[0].text.value);
                } else {
                  console.log("Message content is not text-based.");
                }
                console.log("");
              });
              console.log("");
            } else {
              console.log("Failed to get messages from thread");
            }
            command();
          })();
        });
        break;

      // RUN COMMANDS -----------------------------------------------------------------------------------
      // CREATE RUN
      case "rt":
        rl.question("Thread ID: ", (threadId) => {
          rl.question("Assistant ID: ", (assistantId) => {
            const run = sdk.createRun(threadId, assistantId);
            if (run) {
              run
                .on("textCreated", (text) =>
                  process.stdout.write(`\n>> Assistant ID: ${assistantId}\n`)
                )
                .on("textDelta", (textDelta, snapshot) =>
                  process.stdout.write(textDelta.value || "")
                )
                .on("end", () => {
                  console.log("");
                  command();
                })
                .on("error", (err) => {
                  console.error("Error in run:", err);
                  console.log("");
                  command();
                });
            } else {
              console.log("Failed to create run");
              console.log("");
              command();
            }
          });
        });
        break;

      // PLAYGROUND COMMANDS -----------------------------------------------------------------------------------
      // QUIT
      case "q":
        rl.close();
        return;

      // INVALID COMMAND
      default:
        console.log("Invalid command");
        console.log("");
        command();
    }
  });
}

printCommands();
command();
