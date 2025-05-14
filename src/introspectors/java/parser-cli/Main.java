
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;
import com.google.gson.Gson;
import java.io.File;
import java.nio.file.Paths;
import java.util.*;

public class Main {

    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            System.err.println("No file path provided.");
            System.exit(1);
        }

        File file = Paths.get(args[0]).toFile();
        JavaParser parser = new JavaParser();
        CompilationUnit cu = parser.parse(file).getResult().orElseThrow(() -> new RuntimeException("Failed to parse file."));

        List<Map<String, Object>> functions = new ArrayList<>();

        cu.accept(new VoidVisitorAdapter<Void>() {
            @Override
            public void visit(MethodDeclaration md, Void arg) {
                super.visit(md, arg);

                Map<String, Object> func = new HashMap<>();
                func.put("name", md.getNameAsString());
                func.put("returnType", md.getType().toString());

                List<Map<String, String>> params = new ArrayList<>();
                md.getParameters().forEach(p -> {
                    Map<String, String> param = new HashMap<>();
                    param.put("name", p.getNameAsString());
                    param.put("type", p.getType().toString());
                    params.add(param);
                });

                func.put("parameters", params);
                func.put("modifiers", md.getModifiers().stream().map(Object::toString).toList());
                func.put("location", Map.of(
                        "line", md.getBegin().map(p -> p.line).orElse(-1),
                        "column", md.getBegin().map(p -> p.column).orElse(-1)
                ));

                functions.add(func);
            }
        }, null);

        Map<String, Object> result = new HashMap<>();
        result.put("functions", functions);

        System.out.println(new Gson().toJson(result));
    }
}
