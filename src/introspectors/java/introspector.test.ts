import { join } from "path";
import { JavaIntrospector } from "./introspector";
import { jest } from "@jest/globals";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { unlinkSync, writeFileSync } from "fs";

describe("JavaIntrospector", () => {
  let introspector: JavaIntrospector;
  let mockSpawn: jest.Mock;
  const sampleOutput = JSON.stringify({
    functions: [
      {
        name: "getUser",
        returnType: "User",
        parameters: [{ name: "id", type: "UUID" }],
        modifiers: ["public"],
        location: { line: 42, column: 5 },
      },
    ],
  });

  beforeEach(() => {
    introspector = new JavaIntrospector();
    jest.resetModules();
    mockSpawn = jest.fn();
    jest.unstable_mockModule("child_process", () => ({
      spawn: mockSpawn,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return parsed metadata from Java CLI", async () => {
    const mockStdout: any = {
      on: jest.fn((_event: string, cb: (chunk: string | Buffer) => void) =>
        cb(sampleOutput),
      ),
    };
    const mockProcess: any = {
      stdout: mockStdout,
      stderr: { on: jest.fn() },
      on: jest.fn(
        (_event: string, cb: (code: number, signal?: NodeJS.Signals) => void) =>
          cb(0),
      ),
    };

    mockSpawn.mockReturnValueOnce(mockProcess);

    const result = await introspector.extractMetadata("SomeFile.java");

    expect(result.functions).toHaveLength(1);
    expect(result.functions[0].name).toBe("getUser");
    expect(result.functions[0].parameters[0].type).toBe("UUID");
  });

  it("should throw if the Java process fails", async () => {
    const errorMessage =
      'Exception in thread "main" java.io.FileNotFoundException: BadFile.java (The system cannot find the file specified)';
    const mockProcess: any = {
      stdout: { on: jest.fn() },
      stderr: {
        on: jest.fn((_, cb: (chunk: string | Buffer) => void) =>
          cb(errorMessage),
        ),
      },
      on: jest.fn((_, cb: (code: number, signal?: NodeJS.Signals) => void) =>
        cb(1),
      ),
    };

    mockSpawn.mockReturnValueOnce(mockProcess);

    await expect(introspector.extractMetadata("BadFile.java")).rejects.toThrow(
      errorMessage,
    );
  });
});

describe.skip("JavaIntrospector CLI smoke test", () => {
  const javaCode = `
    public class HelloWorld {
      public String greet(String name) {
        return "Hello, " + name;
      }
    }
  `;

  const filePath = join(tmpdir(), `Test_${randomUUID()}.java`);

  beforeAll(() => {
    writeFileSync(filePath, javaCode);
  });

  afterAll(() => {
    try {
      unlinkSync(filePath);
    } catch {}
  });

  it("should extract method metadata from a real Java file", async () => {
    const introspector = new JavaIntrospector();
    const result = await introspector.extractMetadata(filePath);

    expect(result.functions.length).toBeGreaterThan(0);
    expect(result.functions[0]).toMatchObject({
      name: "greet",
      returnType: "String",
    });
  });
});
