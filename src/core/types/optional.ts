/**
 * Cria um novo tipo que torna as propriedades específicas de um tipo T opcionais.
 * @template T - O tipo base cujas propriedades serão tornadas opcionais.
 * @template K - As chaves das propriedades que serão tornadas opcionais.
 * @returns {object} - Um novo tipo com as propriedades especificadas tornadas opcionais.
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
