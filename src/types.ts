export interface ParameterMetadata {
  name: string;
  type: string;
}

export interface FunctionMetadata {
  name: string;
  returnType: string;
  parameters: ParameterMetadata[];
  modifiers: string[];
  location: { line: number; column: number };
  annotations?: string[];
}

export interface FieldMetadata {
  name: string;
  type: string;
  modifiers: string[];
  annotations?: string[];
}

export interface ClassMetadata {
  name: string;
  methods: FunctionMetadata[];
  fields: FieldMetadata[];
  modifiers: string[];
  annotations?: string[];
}

export interface ParsedMetadata {
  package?: string;
  imports: string[];
  classes: ClassMetadata[];
}

export interface LanguageIntrospector {
  extractMetadata(filePath: string): Promise<ParsedMetadata>;
}

export interface Formatter<T> {
  format(): string;
}
