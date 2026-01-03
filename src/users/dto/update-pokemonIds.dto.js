import Joi from 'joi';

class UpdatePokemonIdsDto {
  constructor(data = {}) {
    this.id = data.id;
    this.username = data.username;
    this.pokemonIds = data.pokemonIds || [];
  }

  static schema = Joi.object({
    username: Joi.string().optional(),
    pokemonIds: Joi.array().items(Joi.number()).required(),
  });

  validate() {
    const { error } = UpdatePokemonIdsDto.schema.validate({
      username: this.username,
      pokemonIds: this.pokemonIds,
    });

    return {
      valid: !error,
      errors: error ? error.details.map((detail) => detail.message) : [],
    };
  }
}

export { UpdatePokemonIdsDto };
