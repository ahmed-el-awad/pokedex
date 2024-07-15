async function loadPokemon() {
    const input = document.getElementById("pokemon");
    const pokemonID = input.value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    const jsonData = await response.json();

    async function loadImage() {
        try {
            const pokemonImage = jsonData["sprites"]["front_default"];

            // Debugging
            console.log(`Image link: ${pokemonImage}`);

            const image = document.createElement("img");
            image.src = pokemonImage;

            input.insertAdjacentElement("afterend", image);
        } catch (error) {
            console.log("Failed to load image.");
            console.error(error);
        }
    }

    async function loadAudio() {
        try {
            const pokemonCry = jsonData["cries"]["latest"];

            // Debugging
            console.log(`Audio link: ${pokemonCry}`);

            const audio = document.createElement("audio");
            audio.src = pokemonCry;
            audio.play();

            input.insertAdjacentElement("afterend", audio);
        } catch (error) {
            console.error(error);
            console.log("Failed to load audio.");
        }
    }

    async function getName(pokemonID) {
        async function getID(pokemonID) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
            const jsonData = await response.json();

            return jsonData["id"];
        }

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${identifier}`);
            const jsonData = await response.json();

            const name = jsonData["name"].charAt(0).toUpperCase() + jsonData["name"].slice(1);

            // currently the description is getting the first description found based on the first version present through the api
            // if a pokemon is present in version 1 and version 3, the description will always be for version 1
            const description = jsonData["flavor_text_entries"][2]["flavor_text"]
                .split("\n")
                .join(" ");

            const id = await getID(identifier);
            console.log(`${id}: ${name}\n${description}`);
        } catch (error) {
            console.error(`Receieved error: ${error}`);
        }
    }

    loadImage();
    loadAudio();
    // getName(pokemonID);
}
