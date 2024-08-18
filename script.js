async function loadPokemon() {
  const input = document.getElementById("pokemon");
  const inputField = document.getElementById("inputField");
  const pokemonID = input.value.toLowerCase(); // name or number
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
  const jsonData = await response.json();

  async function loadImage() {
    try {
      const pokemonImage = jsonData["sprites"]["front_default"];

      // Debugging
      console.log(`Image link: ${pokemonImage}`);

      const image = document.createElement("img");
      image.src = pokemonImage;

      inputField.insertAdjacentElement("afterend", image);
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

      inputField.insertAdjacentElement("afterend", audio);
    } catch (error) {
      console.error(error);
      console.log("Failed to load audio.");
    }
  }

  // TODO: account for names that have hyphens or periods (ex: Mr. Mime, Ho-Oh)
  // TODO: account for mega evolutions by loading the numbers, names, and descriptions from their original forms
  // TODO: account for different forms (the logic will be the same as megas)
  // TODO: fix description language being other countries
  async function loadName(pokemonID) {
    try {
      // different api endpoint, this one contains the description
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`);
      const jsonData = await response.json();
      const name = jsonData["name"].charAt(0).toUpperCase() + jsonData["name"].slice(1);
      const id = jsonData["id"];

      // currently the description is getting the first description found based on the first version present through the api
      // if a pokemon is present in version 1 and version 3, the description will always be for version 1
      const desc = jsonData["flavor_text_entries"][2]["flavor_text"].split("\n").join(" ");

      // Debugging
      console.log(`${id}: ${name}\n${desc}`);

      const header = document.createElement("h1");
      header.innerText = `${id}: ${name}`;

      const description = document.createElement("p");
      description.innerText = desc;

      inputField.insertAdjacentElement("afterend", description);
      inputField.insertAdjacentElement("afterend", header);
    } catch (error) {
      console.error(`Receieved error: ${error}`);
    }
  }

  loadName(pokemonID);
  loadImage();
  loadAudio();
}

// if a user pressed enter after writing a pokemon's id or name
function pressedEnter() {
  if (event.key === "Enter") {
    loadPokemon();
  }
}
