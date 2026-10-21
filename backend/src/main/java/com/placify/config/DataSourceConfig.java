package com.placify.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Intelligent DataSource Configuration:
 * 1. Tries to connect to MySQL database as configured in application.properties.
 * 2. If MySQL credentials match, connects directly to MySQL.
 * 3. If MySQL is not reachable (or password differs on student laptop),
 *    gracefully falls back to an embedded in-memory database so the project runs immediately
 *    without throwing startup errors, while alerting the student how to set their password.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/placify_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUser;

    @Value("${spring.datasource.password:root}")
    private String mysqlPassword;

    public static String activeDatabaseType = "UNKNOWN";
    public static boolean isConnectedToMySQL = false;

    @Bean
    @Primary
    public DataSource dataSource() {
        log.info("Testing connection to MySQL at {} with user '{}'...", mysqlUrl, mysqlUser);
        try {
            DriverManager.setLoginTimeout(2);
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUser, mysqlPassword)) {
                log.info("SUCCESS: Connected to MySQL database!");
                activeDatabaseType = "MySQL (localhost:3306/placify_db)";
                isConnectedToMySQL = true;
                return DataSourceBuilder.create()
                        .type(HikariDataSource.class)
                        .url(mysqlUrl)
                        .username(mysqlUser)
                        .password(mysqlPassword)
                        .driverClassName("com.mysql.cj.jdbc.Driver")
                        .build();
            }
        } catch (Exception e) {
            log.warn("==========================================================================");
            log.warn("NOTICE: Could not connect to MySQL: {}", e.getMessage());
            log.warn("Falling back to embedded in-memory database so Placify starts immediately.");
            log.warn("To persist in MySQL: Update 'spring.datasource.password' in application.properties");
            log.warn("==========================================================================");
            activeDatabaseType = "In-Memory H2 (Update MySQL password in application.properties)";
            isConnectedToMySQL = false;
            return DataSourceBuilder.create()
                    .type(HikariDataSource.class)
                    .url("jdbc:h2:mem:placify_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL")
                    .username("sa")
                    .password("")
                    .driverClassName("org.h2.Driver")
                    .build();
        }
    }
}
