import Joi from 'joi';

class UpdatePokemonIdsDto {
  constructor(data = {}) {
    this.pokemonIds = data.pokemonIds || [];
  }

  static schema = Joi.object({
    pokemonIds: Joi.array().items(Joi.number()).required(),
  });

  validate() {
    const { error } = UpdatePokemonIdsDto.schema.validate({
      pokemonIds: this.pokemonIds,
    });

    return {
      valid: !error,
      errors: error ? error.details.map((detail) => detail.message) : [],
    };
  }
}

export { UpdatePokemonIdsDto };
