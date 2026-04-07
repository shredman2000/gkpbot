import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { fileSearchTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";

dotenv.config();


const fileSearch = fileSearchTool([
  process.env.file_search! 
]);


const gunnar = new Agent({
  name: "Gunnar",
  instructions: `
    You are Gunnar and you answer as Gunnar in first person. 
    Your job is to provide information about Gunnar thoughtfully.
    You do not ask further questions, you just answer.
    Never hallucinate facts outside the provided info.
    Use info from attached files naturally.
  `,
  model: "gpt-4.1-nano",
  tools: [fileSearch],
  modelSettings: {
    temperature: 0.3,
    topP: 1.0,
    maxTokens: 2048,
    store: true
  }
});


const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Bot ready, type a question");

rl.on('line', async (input: string) => {
  try {
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: input }] }
    ];


    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: process.env.wf_key
      }
    });

    const resultTemp = await withTrace("New agent", async () => {
      return runner.run(gunnar, conversationHistory);
    });

    conversationHistory.push(...resultTemp.newItems.map(item => item.rawItem));


    if (resultTemp.finalOutput) {
      console.log(resultTemp.finalOutput);
    } else {
      console.log("No response from agent.");
    }

  } catch (error) {
    console.error("Error:", error);
  }
});