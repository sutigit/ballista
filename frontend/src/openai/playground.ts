import OpenAISDK from "./sdk";
import readline from "readline";

const sdk = new OpenAISDK();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printCommands() {
  console.log("COMMANDS");
  console.log("");
  console.log("Assistants --------------------");
  console.log("la - list assistants");
  console.log("");

  console.log("Threads --------------------");
  console.log("ct - create thread");
  console.log("lt - list threads");
  console.log("dt - delete thread");
  console.log("");

  console.log("Messaging --------------------");
  console.log("am - add message to thread");
  console.log("gm - get messages from thread");
  console.log("");

  console.log("Runs --------------------");
  console.log("cr - create run");
  console.log("qr - quit run");
  console.log("");

  console.log("Quit --------------------");
  console.log("q - quit");
  console.log("");
}

async function play() {
  rl.question("Command: ", (answer) => {
    console.log("");

    switch (answer) {
      // LIST ASSISTANTS
      case "la":
        (async () => {
          const assistants = await sdk.getAssistants();

          console.log("Assistants:");
          assistants.forEach((assistant) => {
            console.log(`${assistant.name}: ${assistant.id}`);
          });
          console.log("");
          play();
        })();
        break;

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
          play();
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
        play();
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
            play();
          })();
        });
        break;

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
              play();
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
            play();
          })();
        });
        break;

      // CREATE RUN
      case "cr":
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
                  play();
                })
                .on("error", (err) => {
                  console.error("Error in run:", err);
                  console.log("");
                  play();
                });
            } else {
              console.log("Failed to create run");
              console.log("");
              play();
            }
          });
        });
        break;

      // QUIT
      case "q":
        rl.close();
        return;

      // INVALID COMMAND
      default:
        console.log("Invalid command");
        console.log("");
        play();
    }
  });
}

printCommands();
play();
