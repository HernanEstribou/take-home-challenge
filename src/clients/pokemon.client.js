class PokemonClient {
  async getPokemonById(pokemonList) {
    try {
      if (!pokemonList || pokemonList.length === 0) {
        return [];
      }

      // Crear un array de promesas, una por cada ID
      const promises = pokemonList.map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();

        return {
          id: data.id,
          name: data.name,
        };
      });

      const pokemons = await Promise.all(promises);

      return pokemons;
    } catch (error) {
      console.error(`Error fetching Pokemons:`, error);
      throw error;
    }
  }
}

export default new PokemonClient();
