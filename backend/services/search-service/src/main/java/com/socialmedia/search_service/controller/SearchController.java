package com.socialmedia.search_service.controller;

import com.socialmedia.search_service.dto.response.ApiResponse;
import com.socialmedia.search_service.dto.response.SearchResponse;
import com.socialmedia.search_service.entity.PostDocument;
import com.socialmedia.search_service.entity.UserDocument;
import com.socialmedia.search_service.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Search API", description = "APIs for searching posts and users")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @Operation(summary = "Search content", description = "Search posts by query with optional filters")
    public ApiResponse<SearchResponse> search(
            @Parameter(description = "Search query") @RequestParam String query,
            @Parameter(description = "Search type: all, content, tag, user") @RequestParam(defaultValue = "all") String type,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortOrder) {

        log.info("Searching with query: {}, type: {}, page: {}, size: {}", query, type, page, size);
        log.debug("Search request - query: {}, type: {}, page: {}, size: {}", query, type, page, size);

        Sort.Direction direction = Sort.Direction.fromString(sortOrder.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        SearchResponse response = new SearchResponse();

        if ("all".equals(type) || "posts".equals(type)) {
            Page<PostDocument> posts = searchService.searchPosts(query, pageable);
            response.setPosts(posts.getContent().stream()
                    .map(this::convertToPostResult)
                    .collect(Collectors.toList()));
            response.setTotalHits(posts.getTotalElements());
        }

        if ("all".equals(type) || "users".equals(type)) {
            Page<UserDocument> users = searchService.searchUsers(query, pageable);
            response.setUsers(users.getContent().stream()
                    .map(this::convertToUserResult)
                    .collect(Collectors.toList()));
            if ("users".equals(type)) {
                response.setTotalHits(users.getTotalElements());
            }
        }

        return ApiResponse.<SearchResponse>builder()
                .code(200)
                .message("Search completed successfully")
                .result(response)
                .build();
    }

    @PostMapping("/reindex")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> reindexAll() {
        log.info("Starting reindexing of all data");
        searchService.reindexAllData();
        return ApiResponse.<String>builder()
                .code(200)
                .message("Reindexing completed successfully")
                .build();
    }

    private SearchResponse.UserSearchResult convertToUserResult(UserDocument doc) {
        return SearchResponse.UserSearchResult.builder()
                .id(doc.getId())
                .userId(doc.getUserId())
                .firstName(doc.getFirstName())
                .lastName(doc.getLastName())
                .userName(doc.getUserName())
                .dob(doc.getDob())
                .phoneNumber(doc.getPhoneNumber())
                .location(doc.getLocation())
                .email(doc.getEmail())
                .avatar(doc.getAvatar())
                .build();
    }

    private SearchResponse.PostSearchResult convertToPostResult(PostDocument doc) {
        return SearchResponse.PostSearchResult.builder()
                .postId(doc.getPostId())
                .userId(doc.getUserId())
                .caption(doc.getCaption())
                .contentTypes(doc.getContentTypes())
                .privacy(doc.getPrivacy())
                .listCommentId(doc.getListCommentId())
                .build();
    }
}