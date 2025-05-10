package com.edushare.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    private final AmazonS3 amazonS3;
    
    @Value("${aws.s3.bucket}")
    private String bucketName;

    // Allowed file types
    private final List<String> allowedImageTypes = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private final List<String> allowedVideoTypes = Arrays.asList("video/mp4", "video/quicktime", "video/x-msvideo");
    
    // Maximum number of files per post
    private final int MAX_FILES_PER_POST = 3;

    @Autowired
    public FileUploadService(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    /**
     * Upload multiple files to S3 and return their URLs
     */
    public List<String> uploadFiles(List<MultipartFile> files, String directory) throws Exception {
        if (files == null || files.isEmpty()) {
            return new ArrayList<>();
        }
        
        if (files.size() > MAX_FILES_PER_POST) {
            throw new IllegalArgumentException("Maximum " + MAX_FILES_PER_POST + " files allowed per post");
        }
        
        List<String> fileUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            validateFile(file);
            String fileUrl = uploadFile(file, directory);
            fileUrls.add(fileUrl);
        }
        
        return fileUrls;
    }
    
    /**
     * Upload a single file to S3 and return its URL
     */
    public String uploadFile(MultipartFile file, String directory) throws Exception {
        validateFile(file);
        
        String fileName = generateFileName(file);
        String key = directory + "/" + fileName;
        
        try (InputStream inputStream = file.getInputStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());
            
            // Upload file to S3
            amazonS3.putObject(new PutObjectRequest(
                    bucketName, 
                    key, 
                    inputStream, 
                    metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            
            // Return the public URL of the uploaded file
            return amazonS3.getUrl(bucketName, key).toString();
        } catch (IOException e) {
            throw new Exception("Failed to upload file: " + e.getMessage());
        }
    }
    
    /**
     * Delete a file from S3 by its key
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        
        try {
            String key = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);
            amazonS3.deleteObject(bucketName, key);
        } catch (Exception e) {
            // Log the exception, but don't throw it to avoid breaking the main flow
            System.err.println("Failed to delete file: " + e.getMessage());
        }
    }
    
    /**
     * Validate a file's type and size
     * Note: Video duration validation is now handled on the frontend
     */
    private void validateFile(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("File type cannot be determined");
        }
        
        // Check if the content type is allowed
        if (!allowedImageTypes.contains(contentType) && !allowedVideoTypes.contains(contentType)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: JPEG, PNG, GIF, MP4, MOV, AVI");
        }
        
        // Check file size (10MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10MB");
        }
        
        // Video duration validation is now handled on the frontend
    }
    
    /**
     * Generate a unique file name to avoid collisions in S3
     */
    private String generateFileName(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        
        return timestamp + "_" + uuid + extension;
    }
}