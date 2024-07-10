import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const UI_TAILWIND_EXPERT_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a expert frontend developer that focuses on HTML and Tailwind CSS. The following are rules that guide your thinking and actions: 
    - The only action you will perform is to create a UI based on the user's input. 
    - When answering provide only HTML and Tailwind CSS code, do not use any other libraries or frameworks. 
    - When using Tailwind CSS target the code to be mobile-first but add media query styles so that it also looks good on larger sizes like tablet and laptop.
    - When using images or icons use the following placeholder api https://placehold.co/*WIDTH*x*HEIGHT*?text=*TEXT_TO_DISPLAY* replacing the values between * *
    - The user will provide you with info on what they want to create, if there is not enough info provided, make your best guess to interpret what they want.
    - IMPORTANT The HTML to be generated should only include the content inside the body tag. 
    - IMPORTANT Return the HTML code only without adding markdown block like \`\`\`html  \`\`\` outside of it or any other stuff not related to the code`,
  ],
  ["assistant", "What would you like to create?"],
  ["user", "{input}"],
]);

export const UI_REFERENCE_CODE_PROMPT = ChatPromptTemplate.fromMessages([
  ["user", "I want you to modify the piece of code in this way: {input}"],
  ["user", "Return the full updated code including the reference"],
  ["user", `Here is the specific part or parts of the code I want you to modify, only modify code that matches this part:
  '''
  {codeToModify}
  '''`],
  ["user", `Here is the whole code for my page as a reference, but concentrate on the specific part I mentioned above
  '''
  {referenceCode}
  '''`],
]);

export async function sendMessage(
  message: string,
  model: "openai" | "google",
  onChuckStream: (chunk: string, prevConcatenatedChunks: string) => void,
) {
  let chatModel: ChatOpenAI | ChatGoogleGenerativeAI | null = null;

  if (model === "openai") {
    chatModel = new ChatOpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: "gpt-4o",
    });
  }
  if (model === "google") {
    chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-1.5-pro-latest",
      maxOutputTokens: 2048,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });
  }

  if (!chatModel) {
    return;
  }

  const outputParser = new StringOutputParser();

  const chain = UI_TAILWIND_EXPERT_PROMPT.pipe(chatModel).pipe(outputParser);

  const uiExpertStream = await chain.stream({
    input: message,
  });

  const streamChunks = [];
  for await (const streamChunk of uiExpertStream) {
    //console.log(`${streamChunk}|`);
    streamChunks.push(streamChunk);
    onChuckStream(streamChunk, streamChunks.join(""));
  }

  let uiExpertResponse = streamChunks[0];

  for (const chunk of streamChunks) {
    uiExpertResponse = uiExpertResponse.concat(chunk);
  }

  return uiExpertResponse;
}
