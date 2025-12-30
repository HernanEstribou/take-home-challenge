class UserWithPokemonDto {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.pokemonIds = user.pokemonIds;
    this.pokemons = user.pokemons;
  }
}

export { UserWithPokemonDto };
