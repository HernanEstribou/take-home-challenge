class CreateUserDto {
  constructor(user = {}) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.pokemonIds = user.pokemonIds || [];
  }
}

export { CreateUserDto };
