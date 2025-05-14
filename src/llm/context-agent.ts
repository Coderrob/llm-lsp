import { IntrospectionService } from "../services/introspection-service";
import { ContextBuilder } from "./context-builder";

export class ContextAgent {
  constructor(private readonly introspector: IntrospectionService) {}

  async execute(
    filePath: string,
  ): Promise<{ metadata: string; structured: object }> {
    const metadata = await this.introspector.introspect(filePath);
    const context = ContextBuilder.build(metadata);

    return {
      metadata: context,
      structured: metadata,
    };
  }
}
