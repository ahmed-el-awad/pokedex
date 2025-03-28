import { Pokemon } from "./interface";

function PokemonData({
  isImagePresent,
  pokemonImage,
  pokemonName,
  pokemonDescription,
}: Pokemon) {
  return (
    <>
      <div className="container m-1 rounded-2xl bg-red-400 p-4">
        <div className="flex items-start">
          {isImagePresent && (
            <img
              className="rounded-lg bg-green-500"
              src={pokemonImage}
              alt={`${pokemonName}`}
            />
          )}
          <div className="ml-2">
            <h1 className="rounded-lg bg-gray-500 text-2xl font-semibold">
              {pokemonName}
            </h1>
            <p className="description mt-2">{pokemonDescription}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PokemonData;
