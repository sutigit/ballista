import OpenAIWrapper from "./main";
import readline from "readline";

const ow = new OpenAIWrapper();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log("la - list assistants");
  console.log("ct - create thread");
  console.log("lt - list threads");
  console.log("dt - delete thread");
  console.log("q - quit");
  console.log("----------------------------------");

  rl.question("Command: ", (answer) => {
    console.log("");

    switch (answer) {
      // LIST ASSISTANTS
      case "la":
        (async () => {
          const assistants = await ow.getAssistants();

          console.log("Assistants:");
          assistants.forEach((assistant) => {
            console.log(`${assistant.name}: ${assistant.id}`);
          });
          console.log("");
          main();
        })();
        break;

      // CREATE A THREAD
      case "ct":
        (async () => {
          const thread = await ow.createThread();
          if (thread) {
            console.log("Thread created successfully!", thread.id);
          } else {
            console.log("Failed to create thread");
          }
          console.log("");
          main();
        })();
        break;

      // LIST THREADS
      case "lt":
        const threads = ow.getThreads();
        console.log("Threads:");
        threads.forEach((thread) => {
          console.log(
            `Thread ID: ${thread.id}, Created At: ${thread.created_at}`
          );
        });
        console.log("");
        main();
        break;

      // DELETE THREAD
      case "dt":
        rl.question("Thread ID: ", (threadId) => {
          (async () => {
            const success = await ow.deleteThread(threadId);
            if (success) {
              console.log("Thread deleted from threads.json successfully!");
            } else {
              console.log("Failed to delete thread from threads.json");
            }
            console.log("");
            main();
          })();
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
        main();
    }
  });
}

main();
