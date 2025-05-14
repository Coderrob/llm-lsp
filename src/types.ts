export interface FunctionMetadata {
  name: string;
  returnType: string;
  parameters: { name: string; type: string }[];
  modifiers: string[];
  location: { line: number; column: number };
}

export interface ParsedMetadata {
  functions: FunctionMetadata[];
}

export interface LanguageIntrospector {
  extractMetadata(filePath: string): Promise<ParsedMetadata>;
}
