class UpdateUserDto {
  constructor(user = {}) {
    this.username = user.username;
    this.email = user.email;
    this.pokemonIds = user.pokemonIds;
  }
}

export { UpdateUserDto };
