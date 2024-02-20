package wevioo.tn.backend.services.email;


import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
public class TemplateUtils {
    private  final Pattern PLACEHOLDER_PATTERN = Pattern.compile("\\{\\{([^{}]*)\\}\\}");

    // Method to extract dynamic placeholders from the template
    public  Set<String> extractPlaceholders(String template) {
        Set<String> placeholders = new HashSet<>();
        Matcher matcher = PLACEHOLDER_PATTERN.matcher(template);
        while (matcher.find()) {
            placeholders.add(matcher.group(1));
        }
        return placeholders;
    }

    // Method to replace placeholders with actual values
    public static String replacePlaceholders(String template, Map<String, String> placeholderValues) {
        for (Map.Entry<String, String> entry : placeholderValues.entrySet()) {
            String placeholder = entry.getKey();
            String value = entry.getValue();
            template = template.replace("{{" + placeholder + "}}", value);
        }
        return template;
    }
}
