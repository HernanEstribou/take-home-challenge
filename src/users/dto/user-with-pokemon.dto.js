class UserWithPokemonDto {
  constructor(user, pokemon) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.pokemonIds = user.pokemonIds;
    this.pokemon = pokemon;
  }
}

export { UserWithPokemonDto };
