package com.fptu.eduBoostBackend.config;

import io.github.cdimascio.dotenv.Dotenv;
import java.io.File;

/**
 * Loads environment variables from .env file before Spring Boot starts
 * This ensures all variables are available when Spring reads application.properties
 */
public class DotenvLoader {
    public static void loadEnv() {
        try {
            // Try to find .env file in project root (where pom.xml is located)
            // This works when running from IDE or Maven
            String projectRoot = System.getProperty("user.dir");
            File envFile = new File(projectRoot, ".env");
            
            // If .env is not in current directory, try parent directory (for IDE runs)
            if (!envFile.exists() && projectRoot.endsWith("eduBoostBackend")) {
                File parentEnvFile = new File(projectRoot, ".env");
                if (!parentEnvFile.exists()) {
                    // Try one level up (project root)
                    File projectRootEnv = new File(new File(projectRoot).getParent(), ".env");
                    if (projectRootEnv.exists()) {
                        projectRoot = new File(projectRoot).getParent();
                    }
                }
            }
            
            Dotenv dotenv = Dotenv.configure()
                    .directory(projectRoot)
                    .filename(".env")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();
            
            // Set all variables from .env as System properties
            // Only set if not already set (environment variables take precedence)
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                if (System.getProperty(key) == null && System.getenv(key) == null) {
                    System.setProperty(key, value);
                }
            });
            
            System.out.println("✓ Loaded .env file from: " + projectRoot);
        } catch (Exception e) {
            System.err.println("⚠ Warning: Could not load .env file: " + e.getMessage());
            System.err.println("  Make sure .env file exists in the project root directory");
        }
    }
}

