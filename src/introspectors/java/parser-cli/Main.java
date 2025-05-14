
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.*;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import com.github.javaparser.ast.expr.AnnotationExpr;
import com.google.gson.Gson;

import java.io.File;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public final class Main {

    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            System.err.println("No file path provided.");
            System.exit(1);
        }

        File file = Paths.get(args[0]).toFile();
        JavaParser parser = new JavaParser();
        CompilationUnit cu = parser.parse(file)
                .getResult()
                .orElseThrow(() -> new IllegalArgumentException("Failed to parse file."));

        Map<String, Object> result = new HashMap<>();
        result.put("package", cu.getPackageDeclaration().map(pd -> pd.getNameAsString()).orElse(null));

        List<String> imports = cu.getImports().stream()
                .map(i -> i.getNameAsString())
                .collect(Collectors.toList());
        result.put("imports", imports);

        List<Map<String, Object>> classes = new ArrayList<>();

        cu.accept(new ClassVisitor(classes), null);

        result.put("classes", classes);
        System.out.println(new Gson().toJson(result));
    }

    private static final class ClassVisitor extends VoidVisitorAdapter<Void> {

        private final List<Map<String, Object>> classList;

        public ClassVisitor(List<Map<String, Object>> classList) {
            this.classList = classList;
        }

        @Override
        public void visit(ClassOrInterfaceDeclaration cid, Void arg) {
            Map<String, Object> cls = new HashMap<>();
            cls.put("name", cid.getNameAsString());
            cls.put("modifiers", cid.getModifiers().stream().map(Object::toString).collect(Collectors.toList()));
            cls.put("annotations", cid.getAnnotations().stream().map(AnnotationExpr::getNameAsString).collect(Collectors.toList()));

            List<Map<String, Object>> fields = cid.getFields().stream()
                    .flatMap(field -> field.getVariables().stream().map(var -> {
                Map<String, Object> f = new HashMap<>();
                f.put("name", var.getNameAsString());
                f.put("type", field.getElementType().toString());
                f.put("modifiers", field.getModifiers().stream().map(Object::toString).collect(Collectors.toList()));
                f.put("annotations", field.getAnnotations().stream().map(AnnotationExpr::getNameAsString).collect(Collectors.toList()));
                return f;
            }))
                    .collect(Collectors.toList());
            cls.put("fields", fields);

            List<Map<String, Object>> methods = cid.getMethods().stream()
                    .map(method -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("name", method.getNameAsString());
                        m.put("returnType", method.getType().toString());
                        m.put("modifiers", method.getModifiers().stream().map(Object::toString).collect(Collectors.toList()));
                        m.put("annotations", method.getAnnotations().stream().map(AnnotationExpr::getNameAsString).collect(Collectors.toList()));

                        List<Map<String, String>> params = method.getParameters().stream()
                                .map(p -> Map.of(
                                "name", p.getNameAsString(),
                                "type", p.getType().toString()
                        ))
                                .collect(Collectors.toList());
                        m.put("parameters", params);

                        m.put("location", method.getBegin().map(pos -> Map.of(
                                "line", pos.line,
                                "column", pos.column
                        )).orElse(Map.of("line", -1, "column", -1)));

                        return m;
                    })
                    .collect(Collectors.toList());

            cls.put("methods", methods);
            classList.add(cls);
            super.visit(cid, arg);
        }
    }
}
