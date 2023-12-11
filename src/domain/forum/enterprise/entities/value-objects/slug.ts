export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  /**
   * Cria uma instância da classe Slug a partir de um texto.
   * @param {string} text - O texto a partir do qual criar o slug.
   * @returns {Slug} - Uma instância da classe Slug.
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "");

    return new Slug(slugText);
  }
}
