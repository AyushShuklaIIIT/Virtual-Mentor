const { GoogleGenAI } = require("@google/genai");
const prompt = require("./ai.prompt");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if(!GEMINI_API_KEY){
    console.log("NO GEMINI API KEY ......");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function suggestions(tasks) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt} 
        Now this is the data of the tasks of the user :  
        ${JSON.stringify(tasks)}`,
  });
  return response.text;
}

module.exports = {
    suggestions
}