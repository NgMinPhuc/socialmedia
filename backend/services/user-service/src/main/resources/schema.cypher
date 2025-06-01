// Neo4j Cypher Script for User Service
// User profiles and social relationships

// Clear existing data if needed (uncomment for fresh start)
// MATCH (n) DETACH DELETE n;

// Create constraints for User nodes
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.userId IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.userName IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE;

// Create indexes for better performance
CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.firstName);
CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.lastName);
CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.location);

// Create user profiles for 5 sample users
CREATE (alice:User {
  userId: "550e8400-e29b-41d4-a716-446655440001",
  userName: "alice_nguyen",
  email: "alice@example.com",
  firstName: "Alice",
  lastName: "Nguyen",
  dob: date("1995-03-15"),
  phoneNumber: "+84987654321",
  location: "Ho Chi Minh City, Vietnam"
});

CREATE (bob:User {
  userId: "550e8400-e29b-41d4-a716-446655440002",
  userName: "bob_tran",
  email: "bob@example.com",
  firstName: "Bob",
  lastName: "Tran",
  dob: date("1992-07-22"),
  phoneNumber: "+84912345678",
  location: "Hanoi, Vietnam"
});

CREATE (charlie:User {
  userId: "550e8400-e29b-41d4-a716-446655440003",
  userName: "charlie_le",
  email: "charlie@example.com",
  firstName: "Charlie",
  lastName: "Le",
  dob: date("1998-11-08"),
  phoneNumber: "+84976543210",
  location: "Da Nang, Vietnam"
});

CREATE (diana:User {
  userId: "550e8400-e29b-41d4-a716-446655440004",
  userName: "diana_pham",
  email: "diana@example.com",
  firstName: "Diana",
  lastName: "Pham",
  dob: date("1996-05-30"),
  phoneNumber: "+84934567890",
  location: "Can Tho, Vietnam"
});

CREATE (ethan:User {
  userId: "550e8400-e29b-41d4-a716-446655440005",
  userName: "ethan_vo",
  email: "ethan@example.com",
  firstName: "Ethan",
  lastName: "Vo",
  dob: date("1994-09-12"),
  phoneNumber: "+84945678901",
  location: "Hue, Vietnam"
});

// Create some friendship relationships
MATCH (alice:User {userName: "alice_nguyen"}), (bob:User {userName: "bob_tran"})
CREATE (alice)-[:FOLLOWS]->(bob);

MATCH (bob:User {userName: "bob_tran"}), (alice:User {userName: "alice_nguyen"})
CREATE (bob)-[:FOLLOWS]->(alice);

MATCH (charlie:User {userName: "charlie_le"}), (alice:User {userName: "alice_nguyen"})
CREATE (charlie)-[:FOLLOWS]->(alice);

MATCH (diana:User {userName: "diana_pham"}), (bob:User {userName: "bob_tran"})
CREATE (diana)-[:FOLLOWS]->(bob);

MATCH (ethan:User {userName: "ethan_vo"}), (charlie:User {userName: "charlie_le"})
CREATE (ethan)-[:FOLLOWS]->(charlie);
