require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

// Function to generate a random integer between min and max, inclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    const readmeTemplate = (
        await fs.readFile(path.join(process.cwd(), "./README.template.md"))
    ).toString("utf-8");

    const season = 5;
    const episode = getRandomInt(1, 23); // Randomly select an episode between 1 and 23
    const response = await fetch(`https://the-office.fly.dev/season/${season}/episode/${episode}`);
    const quotes = await response.json();

    // Choose a random quote from the episode
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    const office_quote = quotes[randomQuoteIndex].quote;
    const office_character = `- ${quotes[randomQuoteIndex].character}`;

    console.log(office_quote);

    const readme = readmeTemplate
        .replace("{office_quote}", office_quote)
        .replace("{office_character}", office_character)

    await fs.writeFile("README.md", readme);
}

main();
