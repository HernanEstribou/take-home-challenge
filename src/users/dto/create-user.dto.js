import Joi from 'joi';

class CreateUserDto {
  constructor(user = {}) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.pokemonIds = user.pokemonIds || [];
  }

  static schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    pokemonIds: Joi.array().items(Joi.number()).optional(),
  });

  validate() {
    const { error } = CreateUserDto.schema.validate(
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

export { CreateUserDto };
