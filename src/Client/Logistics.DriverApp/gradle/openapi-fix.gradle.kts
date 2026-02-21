/**
 * Post-processes OpenAPI-generated Kotlin code to fix known generator bugs
 * for the KMP multiplatform library target.
 */
tasks.named("openApiGenerate") {
    doLast {
        val generatedDir = layout.buildDirectory.dir("generated/openapi/src/main/kotlin").get().asFile
        if (!generatedDir.exists()) return@doLast

        generatedDir.walkTopDown().filter { it.extension == "kt" }.forEach { file ->
            var content = file.readText()
            var modified = false

            // Fix 1: `append(File)` -> `append(file)` (uppercase File references java.io.File, not the parameter)
            if (content.contains("append(File)")) {
                content = content.replace("append(File)", "append(file)")
                modified = true
            }

            // Fix 2: Double constructor call `()()` on HashMap inheritance
            if (content.contains(">()() {")) {
                content = content.replace(">()() {", ">() {")
                modified = true
            }

            if (modified) {
                file.writeText(content)
                logger.lifecycle("openapi-fix: patched ${file.name}")
            }
        }
    }
}
