import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";

export class Document extends ValueObject<string> {
  constructor(document: string) {
    if (!document || document.trim().length === 0) {
      throw new Error("Documento não pode estar vazio");
    }

    const cleanDocument = document.replace(/\D/g, "");

    if (cleanDocument.length < 11) {
      throw new Error("Documento deve ter no mínimo 11 dígitos");
    }

    super(cleanDocument);
  }

  public static create(document: string): Document {
    return new Document(document);
  }

  public format(): string {
    const doc = this._value;
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return doc;
  }
}
