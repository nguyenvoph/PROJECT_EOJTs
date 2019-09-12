package com.example.demo.service;


import com.example.demo.dto.FileStorageProperties;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found " + fileName, ex);
        }
    }

    public class FileStorageException extends RuntimeException {
        public FileStorageException(String message) {
            super(message);
        }

        public FileStorageException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class MyFileNotFoundException extends RuntimeException {
        public MyFileNotFoundException(String message) {
            super(message);
        }

        public MyFileNotFoundException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public List<String> storeListFile(List<MultipartFile> files, String studentEmail) {
        List<String> listFileName = new ArrayList<>();
        // Normalize file name
        for (int i = 0; i < files.size(); i++) {
            String fileName = StringUtils.cleanPath(files.get(i).getOriginalFilename());

            if (fileName.contains("..")) {
                files.remove(i);
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            listFileName.add(fileName);
        }

        Path pathForStudent = this.fileStorageLocation;

        pathForStudent = Paths.get(pathForStudent + "\\" + studentEmail);

        try {

            Path pathCurrent = Files.createDirectories(pathForStudent);

            for (int i = 0; i < listFileName.size(); i++) {
                Path targetLocation = pathCurrent.resolve(listFileName.get(i));
                Files.copy(files.get(i).getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            buildZipFile(pathForStudent+".zip",pathCurrent.toString());

            FileUtils.deleteDirectory(new File(pathCurrent.toString()));

            return listFileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store list file . Please try again!", ex);
        }
    }

    public void buildZipFile(String fileZip, String folder) {
        String zipFile = fileZip;
        String srcDir = folder;

        try {
            byte[] buffer = new byte[1024];

            FileOutputStream fos = new FileOutputStream(zipFile);

            ZipOutputStream zos = new ZipOutputStream(fos);

            File dir = new File(srcDir);

            File[] files = dir.listFiles();

            for (int i = 0; i < files.length; i++) {

                System.out.println("Adding file: " + files[i].getName());

                FileInputStream fis = new FileInputStream(files[i]);

                // begin writing a new ZIP entry, positions the stream to the start of the entry data
                zos.putNextEntry(new ZipEntry(files[i].getName()));

                int length;

                while ((length = fis.read(buffer)) > 0) {
                    zos.write(buffer, 0, length);
                }

                zos.closeEntry();

                // close the InputStream
                fis.close();
            }

            // close the ZipOutputStream
            zos.close();

        } catch (IOException ioe) {
            System.out.println("Error creating zip file" + ioe);
        }

    }
}