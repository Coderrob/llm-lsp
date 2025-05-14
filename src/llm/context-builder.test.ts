import { ParsedMetadata } from "../types";
import { ContextBuilder } from "./context-builder";

describe("LLMContextBuilder", () => {
  const sample: ParsedMetadata = {
    package: "some.package",
    imports: ["dependency.one", "dependency.two"],
    classes: [
      {
        name: "SampleClass",
        modifiers: ["export"],
        annotations: [],
        fields: [
          {
            name: "repository",
            type: "RepoType",
            modifiers: ["private"],
            annotations: [],
          },
        ],
        methods: [
          {
            name: "fetchData",
            returnType: "Data",
            modifiers: ["public"],
            parameters: [{ name: "id", type: "string" }],
            location: { line: 1, column: 1 },
            annotations: [],
          },
        ],
      },
    ],
  };

  it("should generate a properly formatted class context block", () => {
    const output = ContextBuilder.build(sample);
    expect(output).toContain("class SampleClass");
    expect(output).toContain("private RepoType repository;");
    expect(output).toContain("public Data fetchData(string id) {}");
  });

  it("should return a multiline string including class, fields, and methods", () => {
    const result = ContextBuilder.build(sample);
    const lines = result.split("\n");
    expect(lines.length).toBeGreaterThan(3);
    expect(lines[0]).toBe("class SampleClass {");
    expect(lines[1]).toBe("  private RepoType repository;");
    expect(lines[2]).toBe("  public Data fetchData(string id) {}");
    expect(lines[3]).toBe("}");
  });
});
