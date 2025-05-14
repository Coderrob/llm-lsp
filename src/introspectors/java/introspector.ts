import { spawn } from "child_process";
import { join } from "path";

import { LanguageIntrospector, ParsedMetadata } from "../../types";

export class JavaIntrospector implements LanguageIntrospector {
  async extractMetadata(filePath: string): Promise<ParsedMetadata> {
    const parserDir = join(__dirname, "parser-cli");
    const classpath = [
      parserDir,
      join(parserDir, "javaparser-core-3.25.7.jar"),
      join(parserDir, "gson-2.10.1.jar"),
    ].join(process.platform === "win32" ? ";" : ":");

    const output = await new Promise<string>((resolve, reject) => {
      const java = spawn("java", ["-cp", classpath, "Main", filePath]);
      let stdout = "";
      let stderr = "";

      java.stdout.on("data", (data) => (stdout += data));
      java.stderr.on("data", (data) => (stderr += data));
      java.on("close", (code) => {
        if (code === 0) return resolve(stdout);
        reject(new Error(stderr));
      });
    });

    return JSON.parse(output);
  }
}
