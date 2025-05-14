#!/bin/bash
set -e

JAVAPARSER_VERSION="3.25.7"
GSON_VERSION="2.10.1"
OUT_DIR="src/introspectors/java/parser-cli"
JAVAPARSER_JAR="$OUT_DIR/javaparser-core-$JAVAPARSER_VERSION.jar"
GSON_JAR="$OUT_DIR/gson-$GSON_VERSION.jar"
MAIN_PATH="$OUT_DIR/Main.java"

# Download jars if missing
if [ ! -f "$JAVAPARSER_JAR" ]; then
  echo "Downloading JavaParser..."
  curl -sSL "https://repo1.maven.org/maven2/com/github/javaparser/javaparser-core/$JAVAPARSER_VERSION/javaparser-core-$JAVAPARSER_VERSION.jar" -o "$JAVAPARSER_JAR"
fi

if [ ! -f "$GSON_JAR" ]; then
  echo "Downloading Gson..."
  curl -sSL "https://repo1.maven.org/maven2/com/google/code/gson/gson/$GSON_VERSION/gson-$GSON_VERSION.jar" -o "$GSON_JAR"
fi

# Correct classpath separator based on OS
CP_DELIM=":"
if [[ "$OS" == "Windows_NT" ]]; then
  CP_DELIM=";"
fi

# Compile Main.java
echo "Compiling Main.java..."
javac -cp "$JAVAPARSER_JAR$CP_DELIM$GSON_JAR" -d "$OUT_DIR" "$MAIN_PATH"

echo "Java parser compiled successfully."
