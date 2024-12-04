package com.project.it;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = "com.project.it")
@EnableJpaAuditing
@ComponentScan(basePackages = {"com.project.it", "com.project.it.handler"})
public class ProjectitApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectitApplication.class, args);
        System.out.println("Project IT START++++++++");
    }

}
