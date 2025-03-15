require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

// Fetch one random quote at a time
async function main() {
  try {
    const readmeTemplate = (
      await fs.readFile(path.join(process.cwd(), "./README.template.md"))
    ).toString("utf-8");
    
    // Fetch a single random Office quote from the new API
    const response = await fetch("https://officeapi.akashrajpurohit.com/quote/random");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // The returned JSON object shape is: 
    // { "id": 45, "character": "Michael Scott", "quote": "...", "character_avatar_url": "..." }
    const randomQuote = await response.json();
    if (!randomQuote.quote || !randomQuote.character) {
      throw new Error("Unexpected response from The Office API");
    }

    // Extract the quote and character
    const office_quote = randomQuote.quote;
    const office_character = `- ${randomQuote.character}`;
    
    // Replace placeholders
    const readme = readmeTemplate
      .replace("{office_quote}", office_quote)
      .replace("{office_character}", office_character);

    await fs.writeFile("README.md", readme);
    console.log("README updated with a random quote from The Office!");
  } catch (error) {
    console.error("Error fetching or parsing The Office quote:", error);
    // If API fails, the workflow still doesn't
    process.exit(0);
  }
}

main();
