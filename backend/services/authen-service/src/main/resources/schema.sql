-- Authentication Service Database Schema (PostgreSQL)
-- Simplified without complex authorization roles

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS blacklist CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users' table for storing authentication data only
CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       email VARCHAR(255),
                       password VARCHAR(255)
);


-- Blacklist table for invalidated tokens (used by InvalidatedToken entity)
CREATE TABLE blacklist
(
    id         VARCHAR(255) PRIMARY KEY,
    expired_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_blacklist_expired_at ON blacklist (expired_at);
