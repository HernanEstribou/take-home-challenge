import Joi from 'joi';

class UpdateUserDto {
  constructor(user = {}) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.pokemonIds = user.pokemonIds;
  }

  static schema = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    pokemonIds: Joi.array().items(Joi.number()).optional(),
  });

  validate() {
    const { error } = UpdateUserDto.schema.validate(
      {
        username: this.username,
        email: this.email,
        password: this.password,
        pokemonIds: this.pokemonIds,
      },
      { abortEarly: false },
    );

    return {
      valid: !error,
      errors: error ? error.details.map((detail) => detail.message) : [],
    };
  }
}

export { UpdateUserDto };
