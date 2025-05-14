import { JavaIntrospector } from "../introspectors";
import { LanguageIntrospector } from "../types";

export const introspectorRegistry: Map<string, LanguageIntrospector> = new Map([
  ["java", new JavaIntrospector()],
  // ['ts', new TypeScriptIntrospector()],
  // ['go', new GoIntrospector()],
]);
