/**
 * Classe que representa um resultado de erro.
 * @template E - O tipo do valor associado ao erro.
 * @template S - O tipo do valor associado a um resultado bem-sucedido (não usado nesta classe).
 */
export class Error<E, S> {
  readonly value: E;

  constructor(value: E) {
    this.value = value;
  }

  isError(): this is Error<E, S> {
    return true;
  }

  isSuccess(): this is Success<E, S> {
    return false;
  }
}

/**
 * Classe que representa um resultado bem-sucedido.
 * @template E - O tipo do valor associado a um resultado de erro (não usado nesta classe).
 * @template S - O tipo do valor associado ao sucesso.
 */
export class Success<E, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isError(): this is Error<E, S> {
    return false;
  }

  isSuccess(): this is Success<E, S> {
    return true;
  }
}

/**
 * Tipo Either que pode ser uma instância de Error ou Success.
 * @template E - O tipo do valor associado a um resultado de erro.
 * @template S - O tipo do valor associado a um resultado bem-sucedido.
 */
export type Either<E, S> = Error<E, S> | Success<E, S>;

/**
 * Função auxiliar para criar uma instância de Error.
 * @param {E} value - O valor associado ao erro.
 * @returns {Either<E, S>} - Uma instância de Error.
 */
export const error = <E, S>(value: E): Either<E, S> => {
  return new Error(value);
};

/**
 * Função auxiliar para criar uma instância de Success.
 * @param {S} value - O valor associado ao sucesso.
 * @returns {Either<E, S>} - Uma instância de Success.
 */
export const success = <E, S>(value: S): Either<E, S> => {
  return new Success(value);
};
