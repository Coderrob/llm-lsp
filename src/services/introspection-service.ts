import { LanguageIntrospector, ParsedMetadata } from "../types";

export class IntrospectionService {
  constructor(private readonly registry: Map<string, LanguageIntrospector>) {}

  async introspect(filePath: string): Promise<ParsedMetadata> {
    const ext = filePath.split(".").pop();
    if (!ext) {
      throw new Error(`File extension not found: ${filePath} `);
    }
    const introspector = this.registry.get(ext);
    if (!introspector) {
      throw new Error(`Unsupported language: .${ext}`);
    }
    return introspector.extractMetadata(filePath);
  }
}
