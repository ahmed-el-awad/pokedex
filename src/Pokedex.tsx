import { useState } from "react";
import PokemonData from "./PokemonData";
import { Pokemon } from "./interface";

function Pokedex() {
  const [pokemonID, setPokemonID] = useState("");
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  // TODO: fix description language being other countries, currently hard-coded to english
  const language: string = "en";

  // TODO: account for names that have hyphens or periods (ex: Mr. Mime, Ho-Oh),
  //       maybe hardcode them since there aren't many
  // TODO: account for mega evolutions by loading the numbers, names, and descriptions from their original forms
  // TODO: account for different forms (the logic will be the same as megas)

  // in terms of numbers, this can be hardcoded to have a range 1-1025
  // instead of sending the request to the api and causing load
  async function loadPokemon(pokemonID: string | number) {
    try {
      // used to obtain name, number, and description
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`,
      );
      const speciesData = await speciesResponse.json();

      const name =
        speciesData["name"].charAt(0).toUpperCase() +
        speciesData["name"].slice(1);
      const number = speciesData["id"];

      // currently the description is getting the first description found based on the first version present through the api
      // if a pokemon is present in version 1 and version 3, the description will always be for version 1

      // TODO: gets the description of a pokemon based of the language set by the user
      // TODO: some pokemons do not have a description in certain languages
      //       make it error and show that to the user (maybe display the desc in english?)
      let desc = speciesData["flavor_text_entries"].find((obj) => {
        if (obj["language"]["name"] === language) {
          return obj;
        }
      });

      // remove that annoying arrow
      desc = desc.flavor_text.replace("\f", " ");

      // used to obtain image and audio
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonID}`,
      );
      const jsonData = await response.json();
      console.log(jsonData);

      const pokemonImage = jsonData["sprites"]["front_default"];
      console.log(`Image link: ${pokemonImage}`);

      const pokemonCry = jsonData["cries"]["latest"];
      console.log(`Audio link: ${pokemonCry}`);

      const audio = new Audio(pokemonCry);
      audio.volume = 0.05;
      audio.play();

      const newPokemon: Pokemon = {
        pokemonName: number + ": " + name,
        pokemonImage: pokemonImage,
        pokemonDescription: desc,
      };

      return newPokemon;
    } catch (error) {
      console.error(error);
      window.alert("pokemon doesn't exist");

      return null;
    }
  }

  // if a user pressed enter after writing a pokemon's id or name
  function pressedEnter(
    event: React.KeyboardEvent,
    pokemonID: string | number,
  ) {
    if (event.key === "Enter") {
      loadPokemon(pokemonID);
    }
  }

  async function addToArray(newPokemon: Pokemon) {
    setPokemons((previousPokemons) => [newPokemon, ...previousPokemons]);
  }

  return (
    <>
      <input
        className="m-1 w-60 rounded-md border-2 border-gray-500 p-1"
        placeholder="Enter a Pokemon's name or number"
        type="text"
        value={pokemonID}
        onChange={(e) => setPokemonID(e.target.value)}
        onKeyDown={(event) => pressedEnter(event, pokemonID)}
      />
      <button
        className="rounded-md border-2 border-gray-500 p-1"
        onClick={async () => {
          const pokemon = await loadPokemon(pokemonID);

          if (pokemon) {
            addToArray(pokemon);
          }
        }}
      >
        Submit
      </button>
      {pokemons.length > 0 &&
        pokemons.map((pokemon, id) => {
          return (
            <PokemonData
              key={id}
              pokemonImage={pokemon.pokemonImage}
              pokemonName={pokemon.pokemonName}
              pokemonDescription={pokemon.pokemonDescription}
            />
          );
        })}
    </>
  );
}

export default Pokedex;
