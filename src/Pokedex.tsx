import { useState } from "react";

function Pokedex() {
  const [pokemonID, setPokemonID] = useState("");
  const [pokemonImage, setPokemonImage] = useState("");
  const [isImagePresent, setImagePresent] = useState(false);
  const [pokemonDescription, setPokemonDescription] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  // TODO: fix description language being other countries, currently hard-coded to english
  const language = "en";

  // TODO: account for names that have hyphens or periods (ex: Mr. Mime, Ho-Oh),
  //       maybe hardcode them since there aren't many
  // TODO: account for mega evolutions by loading the numbers, names, and descriptions from their original forms
  // TODO: account for different forms (the logic will be the same as megas)
  async function loadPokemon(pokemonID: string | number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    const jsonData = await response.json();
    console.log(jsonData);

    // takes a pokemonID only, not jsonData since it uses a difference api endpoint
    await loadName(pokemonID);
    await loadImage(jsonData);
    await loadAudio(jsonData);
  }

  async function loadName(pokemonID: string | number) {
    try {
      // different api endpoint, this one contains the description
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`);
      const jsonData = await response.json();
      const name = jsonData["name"].charAt(0).toUpperCase() + jsonData["name"].slice(1);
      const number = jsonData["id"];

      // currently the description is getting the first description found based on the first version present through the api
      // if a pokemon is present in version 1 and version 3, the description will always be for version 1

      // TODO: gets the description of a pokemon based of the language set by the user
      // TODO: some pokemons do not have a description in certain languages
      //       make it error and show that to the user (maybe display the desc in english?)
      let desc = jsonData["flavor_text_entries"].find((obj) => {
        if (obj["language"]["name"] === language) {
          return obj;
        }
      });

      // remove that annoying arrow
      desc = desc.flavor_text.replace("\f", " ");

      // Debugging
      console.log(`${number}: ${name}\n${desc}`);

      setPokemonName(`${number + ": " + name}`);
      setPokemonDescription(desc);
    } catch (error) {
      console.error(`Receieved error: ${error}`);
    }
  }

  async function loadImage(jsonData) {
    try {
      const pokemonImage = jsonData["sprites"]["front_default"];

      // Debugging
      console.log(`Image link: ${pokemonImage}`);

      setPokemonImage(pokemonImage);
      setImagePresent(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAudio(jsonData) {
    try {
      const pokemonCry = jsonData["cries"]["latest"];

      // Debugging
      console.log(`Audio link: ${pokemonCry}`);

      const audio = new Audio(pokemonCry);
      audio.play();
    } catch (error) {
      console.error(error);
    }
  }

  // if a user pressed enter after writing a pokemon's id or name
  function pressedEnter(pokemonID: string | number) {
    if (event.key === "Enter") {
      loadPokemon(pokemonID);
    }
  }

  return (
    <div>
      <input
        style={{ width: "15rem", marginBottom: "0.25rem", marginRight: "0.25rem" }}
        placeholder="Enter a Pokemon's name or number"
        type="text"
        value={pokemonID}
        onChange={(e) => setPokemonID(e.target.value)}
        onKeyDown={() => pressedEnter(pokemonID)}
      />
      <button
        onClick={async () => {
          loadPokemon(pokemonID);
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
          const jsonData = await response.json();
          loadImage(jsonData);
        }}
      >
        Submit
      </button>
      <h1>{pokemonName}</h1>
      <p>{pokemonDescription}</p>
      {isImagePresent && <img style={{ display: "block" }} src={pokemonImage} alt="pokemon" />}
    </div>
  );
}

export default Pokedex;
