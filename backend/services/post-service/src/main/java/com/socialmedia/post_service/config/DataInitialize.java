package com.socialmedia.post_service.config;

import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.entity.Comment;
import com.socialmedia.post_service.repository.PostRepository;
import com.socialmedia.post_service.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Data initialization configuration for Post Service
 * Only runs on development and test profiles to populate sample data
 *
 * @author Social Media Platform Team
 * @version 1.0
 * @since 2024
 */
@Configuration
@Profile({"dev", "test"}) // Only run in development/test environments
@RequiredArgsConstructor
@Slf4j
public class DataInitialize {

    private final PostRepository postRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${app.data.initialize:false}")
    private boolean initializeData;

    /**
     * Initializes sample data for development and testing purposes
     * Skips initialization if data already exists or if explicitly disabled
     */
    @Bean
    CommandLineRunner initializeDatabase(PostRepository postRepository, CommentRepository commentRepository) {
        return args -> {
            if (!initializeData) {
                log.info("Data initialization is disabled by configuration");
                return;
            }

            // Skip initialization if data already exists to avoid conflicts
            if (postRepository.count() > 0) {
                log.info("Post data already exists, skipping initialization...");
                return;
            }

            log.info("Starting data initialization for Post Service...");

            try {
                // Clean existing data
                mongoTemplate.dropCollection(Post.class);
                mongoTemplate.dropCollection(Comment.class);

                // Initialize sample posts
                initializeSamplePosts(postRepository);

                // Initialize sample comments
                initializeSampleComments(commentRepository, postRepository);

                log.info("Data initialization completed successfully");

            } catch (Exception e) {
                log.error("Error during data initialization: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to initialize data", e);
            }
        };
    }

    /**
     * Creates sample posts for testing purposes
     */
    private void initializeSamplePosts(PostRepository postRepository) {
        List<Post> samplePosts = createSamplePosts();
        postRepository.saveAll(samplePosts);
        log.info("Initialized {} sample posts", samplePosts.size());
    }

    /**
     * Creates sample comments for testing purposes
     */
    private void initializeSampleComments(CommentRepository commentRepository, PostRepository postRepository) {
        List<Comment> sampleComments = createSampleComments();
        commentRepository.saveAll(sampleComments);

        // Update comment counts
        updatePostCommentCounts(postRepository, sampleComments);

        log.info("Initialized {} sample comments", sampleComments.size());
    }

    /**
     * Creates a list of sample posts with various content types
     */
    private List<Post> createSamplePosts() {
        List<Post> alicePosts = Arrays.asList(
                // Tech posts
                Post.builder()
                    .postId("1")
                    .userId("550e8400-e29b-41d4-a716-446655440001") // Alice's ID from authen-service
                    .caption("Just finished implementing a new microservice architecture! #tech #coding")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build(),

                Post.builder()
                    .postId("2")
                    .userId("550e8400-e29b-41d4-a716-446655440001")
                    .caption("Exploring the latest features in Spring Boot 3.4. Amazing performance improvements! #springboot #java")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build(),

                Post.builder()
                    .postId("3")
                    .userId("550e8400-e29b-41d4-a716-446655440001")
                    .caption("Working on a new AI project. Machine learning is fascinating! #ai #ml #tech")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build(),

                // Coffee posts
                Post.builder()
                    .postId("4")
                    .userId("550e8400-e29b-41d4-a716-446655440001")
                    .caption("Best coffee shop in town! Their cold brew is amazing ☕ #coffee #coffeelover")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build(),

                Post.builder()
                    .postId("5")
                    .userId("550e8400-e29b-41d4-a716-446655440001")
                    .caption("Morning coffee ritual ☕ #coffee #morning")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build(),

                // Travel posts
                Post.builder()
                    .postId("6")
                    .userId("550e8400-e29b-41d4-a716-446655440001")
                    .caption("Beautiful sunset in Bali 🌅 #travel #bali #sunset")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build()

            );

            // Create posts for other users
            List<Post> otherPosts = Arrays.asList(
                Post.builder()
                    .postId("16")
                    .userId("550e8400-e29b-41d4-a716-446655440002") // Bob's ID
                    .caption("New digital art piece! #art #digitalart")
                    .files(Arrays.asList("https://images.unsplash.com/photo-1561121668-bc4096c1d9fc?w=800&h=600&fit=crop"))
                    .contentTypes(Arrays.asList("text", "image"))
                    .privacy("public")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .likesCount(0)
                    .commentsCount(0)
                    .build()


            );

            // Lưu tất cả posts
            postRepository.saveAll(alicePosts);
            postRepository.saveAll(otherPosts);

            List<Post> allPosts = new ArrayList<>();
            allPosts.addAll(alicePosts);
            allPosts.addAll(otherPosts);
            return allPosts;
        }

    /**
     * Creates sample comments for posts
     */
    private List<Comment> createSampleComments() {
        Post post1 = Post.builder()
            .postId("1")
            .build();

        List<Comment> comments = new ArrayList<>();

        // Create a comment from Bob on Alice's post
        Comment comment1 = Comment.builder()
            .commentId("1")
            .post(post1)
            .userId("550e8400-e29b-41d4-a716-446655440002") // Bob's ID
            .content("Great work! The architecture looks solid.")
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

        comments.add(comment1);

        // Add more comments as needed
        return comments;
    }

    /**
     * Updates post comment counts based on comments
     */
    private void updatePostCommentCounts(PostRepository postRepository, List<Comment> comments) {
        // Group comments by post
        Map<String, Long> commentCounts = comments.stream()
            .collect(Collectors.groupingBy(
                comment -> comment.getPost().getPostId(),
                Collectors.counting()
            ));

        // Update each post with the comment count
        commentCounts.forEach((postId, count) -> {
            Post post = postRepository.findById(postId).orElse(null);
            if (post != null) {
                post.setCommentsCount(count.intValue());

                // Update the list of comment IDs
                List<String> commentIds = comments.stream()
                    .filter(comment -> comment.getPost().getPostId().equals(postId))
                    .map(Comment::getCommentId)
                    .collect(Collectors.toList());

                post.setListCommentId(commentIds);
                postRepository.save(post);
            }
        });
    }
}