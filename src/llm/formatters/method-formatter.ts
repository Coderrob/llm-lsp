import { Formatter, FunctionMetadata } from "../../types";

export class MethodFormatter implements Formatter<FunctionMetadata> {
  constructor(private readonly method: FunctionMetadata) {}

  format(): string {
    const mods = this.method.modifiers.join(" ");
    const params = this.method.parameters
      .map((p) => `${p.type} ${p.name}`)
      .join(", ");
    return `  ${mods} ${this.method.returnType} ${this.method.name}(${params}) {}`;
  }
}
