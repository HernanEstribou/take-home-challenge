class UpdatePokemonIdsDto {
  constructor(data = {}) {
    this.pokemonIds = data.pokemonIds || [];
  }
}

export { UpdatePokemonIdsDto };
