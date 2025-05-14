import { ParsedMetadata } from "../types";
import { ClassFormatter } from "./formatters";

/**
 * ContextBuilder is a strategy-based formatter to
 * format ParsedMetadata into structured prompt-ready
 * context for LLM use.
 */
export class ContextBuilder {
  static build(metadata: ParsedMetadata): string {
    return metadata.classes
      .map((cls) => new ClassFormatter(cls).format())
      .join("\n\n");
  }
}
