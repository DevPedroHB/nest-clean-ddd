/**
 * Espera até que um conjunto de assertivas seja satisfeito ou uma duração máxima seja atingida.
 * @param {() => void | Promise<void>} assertions - Uma função que contém as assertivas a serem verificadas.
 * @param {number} maxDuration - A duração máxima (em milissegundos) para esperar pelas assertivas (padrão: 1000 ms).
 * @returns {Promise<void>} - Uma promessa que resolve quando as assertivas são satisfeitas ou rejeita se o tempo máximo é atingido.
 */
export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = 1000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0;

    const interval = setInterval(async () => {
      elapsedTime += 10;

      try {
        await assertions();
        clearInterval(interval);
        resolve();
      } catch (err) {
        if (elapsedTime >= maxDuration) {
          reject(err);
        }
      }
    }, 10);
  });
}
