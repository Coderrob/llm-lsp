import { ClassMetadata, Formatter } from "../../types";
import { FieldFormatter } from "./field-formatter";
import { MethodFormatter } from "./method-formatter";

export class ClassFormatter implements Formatter<ClassMetadata> {
  constructor(private readonly cls: ClassMetadata) {}

  format(): string {
    const header = `class ${this.cls.name} {`;
    const fields = this.cls.fields
      .map((f) => new FieldFormatter(f).format())
      .join("\n");
    const methods = this.cls.methods
      .map((m) => new MethodFormatter(m).format())
      .join("\n");
    return [header, fields, methods, "}"].join("\n");
  }
}
