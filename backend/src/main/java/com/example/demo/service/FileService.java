package com.example.demo.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.FileEntity;
import com.example.demo.repository.JpaFileRepository;

import jakarta.transaction.Transactional;

@Service
public class FileService {

	@Autowired
	private JpaFileRepository jpaFileRepository;

	@Transactional
	public String fileUpload(MultipartFile file,String roomId) {
		String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
		FileEntity fileEntity = FileEntity.builder().fileName(fileName).fileContType(file.getContentType()).userId(Long.parseLong(roomId))
				.build();

		jpaFileRepository.save(fileEntity);
		return fileName;

	}
}
