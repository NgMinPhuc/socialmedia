package com.socialmedia.post_service.config;

import com.socialmedia.post_service.entity.Post;
import com.socialmedia.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Configuration
@Profile({"dev", "test"})
@RequiredArgsConstructor
@Slf4j
public class DataInitialize {

    private final PostRepository postRepository;
    private final MongoTemplate mongoTemplate;

    @Value("${app.data.initialize:false}")
    private boolean initializeData;

    private static final int NUMBER_OF_USERS = 50;
    private static final int POSTS_PER_USER = 20;
    private static final int MAX_DAYS_AGO = 365 * 2; // Tối đa 2 năm trước

    private static final List<String> IMAGE_URLS = Arrays.asList(
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
            "https://images.unsplash.com/photo-1593720213428-28a5b9e94613",
            "https://images.unsplash.com/photo-1591453089816-0fbb971b454c",
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
            "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd",
            "https://images.unsplash.com/photo-1512100356356-de1b84283e18",
            "https://images.unsplash.com/photo-1561121668-bc4096c1d9fc",
            "https://images.unsplash.com/photo-1505327260515-0810795c645b",
            "https://images.unsplash.com/photo-1533174072545-ea663c22066d",
            "https://images.unsplash.com/photo-1517457210940-ed21ee5c3917",
            "https://images.unsplash.com/photo-1505740420928-5e560c06f353",
            "https://images.unsplash.com/photo-1542831371-29b0f74f9d8b",
            "https://images.unsplash.com/photo-1518779578619-33866d34e262",
            "https://images.unsplash.com/photo-1510915228387-abf336fe146b",
            "https://images.unsplash.com/photo-1494883903106-a6e54625b50f"
    );

    private static final String[] CAPTIONS = {
            "Just finished implementing a new microservice architecture! #tech #coding",
            "Exploring the latest features in Spring Boot. Amazing performance improvements! #springboot #java",
            "Working on a new AI project. Machine learning is fascinating! #ai #ml #tech",
            "Best coffee shop in town! Their cold brew is amazing ☕ #coffee #coffeelover",
            "Morning coffee ritual ☕ #coffee #morning",
            "Beautiful sunset in Bali 🌅 #travel #bali #sunset",
            "New digital art piece! #art #digitalart #creative",
            "Enjoying the tranquility of nature. So peaceful! 🌿 #nature #peace",
            "Had an amazing time at the party last night! 🎉 #friends #party",
            "Conquering new heights! What an incredible view! ⛰️ #hiking #adventure",
            "Coding late night. The bugs are strong with this one! #developerlife",
            "Weekend vibes. Time to relax and recharge. ☀️ #weekend #chill",
            "Learning something new every day is key to growth. #lifelonglearning",
            "Food coma after that delicious meal! 🍜 #foodie #yummy",
            "A little progress each day adds up to big results. Keep going! #motivation",
            "Exploring new cities is always an adventure. What's your favorite travel destination?",
            "Reading a good book and enjoying a quiet afternoon. 📚 #books #relax",
            "Fitness journey continues! Small steps lead to big changes. 💪 #fitness #health",
            "Loving the new update to my favorite app. So much smoother!",
            "Brainstorming new ideas. Innovation never stops! 💡 #innovation #ideas"
    };

    private static final String[] PRIVACY_OPTIONS = {"PUBLIC", "FRIENDS", "PRIVATE"};

    @Bean
    CommandLineRunner initializeDatabase() {
        return args -> {
            if (!initializeData) {
                log.info("Data initialization is disabled by configuration. Set 'app.data.initialize=true' to enable.");
                return;
            }

            if (postRepository.count() > 0) { // Giữ nguyên cách kiểm tra tồn tại dữ liệu của bạn
                log.info("Post data already exists ({} posts found), skipping initialization.", postRepository.count());
                return;
            }

            log.info("Starting data initialization for Post Service...");
            long startTime = System.currentTimeMillis();

            try {
                mongoTemplate.dropCollection(Post.class);
                log.info("Dropped 'posts' collection.");

                initializeSamplePosts();

                long endTime = System.currentTimeMillis();
                log.info("Data initialization completed successfully. Total posts: {}. Time taken: {} ms",
                        postRepository.count(), (endTime - startTime));

            } catch (Exception e) {
                log.error("Error during data initialization: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to initialize data", e);
            }
        };
    }

    private void initializeSamplePosts() {
        List<String> generatedAuthenIds = generateUniqueAuthenIds(NUMBER_OF_USERS); // Đổi tên biến cho rõ ràng
        List<Post> allPosts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // Create posts for each user
        for (String authenId : generatedAuthenIds) { // Đổi tên biến cho rõ ràng
            for (int i = 0; i < POSTS_PER_USER; i++) {
                // Random time creation
                long randomDaysAgo = ThreadLocalRandom.current().nextLong(MAX_DAYS_AGO + 1); // +1 để bao gồm 0
                long randomHoursAgo = ThreadLocalRandom.current().nextLong(24);
                long randomMinutesAgo = ThreadLocalRandom.current().nextLong(60);
                long randomSecondsAgo = ThreadLocalRandom.current().nextLong(60);

                LocalDateTime createdAt = now.minusDays(randomDaysAgo)
                        .minusHours(randomHoursAgo)
                        .minusMinutes(randomMinutesAgo)
                        .minusSeconds(randomSecondsAgo);
                LocalDateTime updatedAt = createdAt;

                String caption = getRandomElement(CAPTIONS);
                String mediaUrl = getRandomElement(IMAGE_URLS) + "?auto=format&fit=crop&q=80&w=600&h=400";
                String privacy = getRandomElement(PRIVACY_OPTIONS);

                int likes = ThreadLocalRandom.current().nextInt(0, 5000);
                int comments = ThreadLocalRandom.current().nextInt(0, 500);

                allPosts.add(Post.builder()
                        .authenId(authenId) // Sử dụng authenId
                        .caption(caption)
                        .mediaUrls(Collections.singletonList(mediaUrl))
                        .privacy(privacy)
                        .createdAt(createdAt)
                        .updatedAt(updatedAt)
                        .likesCount(likes)
                        .commentsCount(comments)
                        .build());
            }
        }

        postRepository.saveAll(allPosts);
    }

    private List<String> generateUniqueAuthenIds(int count) { // Đổi tên phương thức cho rõ ràng
        return IntStream.range(0, count)
                .mapToObj(i -> UUID.randomUUID().toString())
                .collect(Collectors.toList());
    }

    private <T> T getRandomElement(T[] array) {
        return array[ThreadLocalRandom.current().nextInt(array.length)];
    }

    private <T> T getRandomElement(List<T> list) {
        return list.get(ThreadLocalRandom.current().nextInt(list.size()));
    }
}