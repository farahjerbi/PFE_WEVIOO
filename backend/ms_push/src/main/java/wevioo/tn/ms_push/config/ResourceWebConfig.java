package wevioo.tn.ms_push.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourceWebConfig implements WebMvcConfigurer {
    final Environment environment;
    @Value("${app.file.upload-dir}")
    private String uploadDir;

    public ResourceWebConfig(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/uploadsPush/**").addResourceLocations("file:" + uploadDir + "/");
    }

}