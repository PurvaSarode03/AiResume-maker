package com.resume.backend;

import org.stringtemplate.v4.ST;

import java.io.IOException;
import java.util.Map;

public interface ResumeService {
    Map<String,Object> generateResumeResponse(String userResumeDescription) throws IOException;
}
