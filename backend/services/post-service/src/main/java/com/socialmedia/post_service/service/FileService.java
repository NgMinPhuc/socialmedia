package com.socialmedia.post_service.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class FileService {

    @Value("${file.upload-dir:./uploads/posts}")
    String fileUploadDir;

    /**
     * Store files and return their URLs
     */
    public List<String> storeFiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        
        if (files == null || files.isEmpty()) {
            return fileUrls;
        }
        
        try {
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(fileUploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created directory: {}", uploadPath);
            }
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                
                // Generate unique file name
                String originalFileName = file.getOriginalFilename();
                String fileExtension = originalFileName != null ? 
                    originalFileName.substring(originalFileName.lastIndexOf(".")) : ".jpg";
                String fileName = UUID.randomUUID().toString() + fileExtension;
                
                // Save file
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Add URL to list
                fileUrls.add("/uploads/posts/" + fileName);
                log.info("Stored file: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Failed to store files", e);
            // Return placeholder URL if there was an error
            for (int i = 0; i < files.size(); i++) {
                fileUrls.add("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop");
            }
        }
        
        return fileUrls;
    }
    
    /**
     * Delete files by their URLs
     */
    public void deleteFiles(List<String> fileUrls) {
        if (fileUrls == null || fileUrls.isEmpty()) {
            return;
        }
        
        for (String fileUrl : fileUrls) {
            try {
                if (fileUrl.startsWith("/uploads/")) {
                    String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                    Path filePath = Paths.get(fileUploadDir, fileName);
                    Files.deleteIfExists(filePath);
                    log.info("Deleted file: {}", filePath);
                }
            } catch (IOException e) {
                log.error("Failed to delete file: {}", fileUrl, e);
            }
        }
    }
}
