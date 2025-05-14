import { FieldMetadata, Formatter } from "../../types";

export class FieldFormatter implements Formatter<FieldMetadata> {
  constructor(private readonly field: FieldMetadata) {}

  format(): string {
    const mods = this.field.modifiers.join(" ");
    return `  ${mods} ${this.field.type} ${this.field.name};`;
  }
}
