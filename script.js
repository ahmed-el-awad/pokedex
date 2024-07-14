// identifier can be a pokemon name or number
async function getPokemon(identifier) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${identifier}`);
        const jsonData = await response.json();

        const name = jsonData["name"].charAt(0).toUpperCase() + jsonData["name"].slice(1);

        // currently the description is getting the first description found based on the first version present through the api
        // if a pokemon is present in version 1 and version 3, the description will always be for version 1
        const description = jsonData["flavor_text_entries"][2]["flavor_text"].split("\n").join(" ");

        const id = await getID(identifier);
        console.log(`${id}: ${name}\n${description}`);
    } catch (error) {
        console.error(`Receieved error: ${error}`);
    }
}

async function getID(identifier) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
    const jsonData = await response.json();

    return jsonData["id"];
}

async function getImage() {
    const input = document.getElementById("pokemon").value;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    const jsonData = await response.json();

    console.log(jsonData["sprites"]["front_default"]);
}
