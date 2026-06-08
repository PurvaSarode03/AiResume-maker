package com.resume.backend;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.io.IOException;

import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeServiceImpl implements ResumeService {

    private ChatClient chatClient;

    public ResumeServiceImpl(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }
    @Override
    public Map<String,Object> generateResumeResponse(String userResumeDescription) throws IOException {

        String promptString =   this.loadPromptFromfile("resume_prompt.txt");
        String promptContent= this.putValuesToTemplate(promptString,Map.of(
                "userDescription",userResumeDescription));

        Prompt prompt = new Prompt(promptContent);


        String response =chatClient.prompt(prompt).call().content();
        Map<String,Object> stringObjectMap=parseMultipleResponses(response);

        return stringObjectMap;
    }

    String loadPromptFromfile(String filename) throws IOException {
        ClassPathResource resource = new ClassPathResource(filename);
        try (var inputStream = resource.getInputStream()) {
            return new String(inputStream.readAllBytes());
        }
    }

    String putValuesToTemplate(String template, Map<String,String> values){
        for (Map.Entry<String,String> entry : values.entrySet()){
            template=template.replace("{{" +entry.getKey() + "}}", entry.getValue());

        };

        return template;
    }

    public static Map<String, Object> parseMultipleResponses(String response) {
        Map<String, Object> jsonResponse = new HashMap<>();

        // Extract <think> content if present
        int thinkStart = response.indexOf("<think>");
        int thinkEnd = response.indexOf("</think>");

        if (thinkStart != -1 && thinkEnd != -1) {
            String thinkContent = response.substring(thinkStart + 7, thinkEnd).trim();
            jsonResponse.put("think", thinkContent);
        } else {
            jsonResponse.put("think", "No thinking process available"); // 👈 your case
        }

        // Extract JSON content
        int jsonStart = response.indexOf("```json");
        int jsonEnd = response.lastIndexOf("```");

        String jsonContent = null;

        if (jsonStart != -1 && jsonEnd != -1 && jsonStart < jsonEnd) {
            // Case 1: response has ```json fence (your case)
            jsonContent = response.substring(jsonStart + 7, jsonEnd).trim();
        } else {
            // Case 2: maybe raw JSON without fences
            int rawStart = response.indexOf("{");
            int rawEnd = response.lastIndexOf("}");
            if (rawStart != -1 && rawEnd != -1) {
                jsonContent = response.substring(rawStart, rawEnd + 1).trim();
            }
        }

        if (jsonContent != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> dataContent = objectMapper.readValue(jsonContent, Map.class);
                jsonResponse.put("data", dataContent);
            } catch (Exception e) {
                jsonResponse.put("data", null);
                System.err.println("Invalid JSON: " + e.getMessage());
            }
        } else {
            jsonResponse.put("data", null);
        }

        return jsonResponse;
    }




}
