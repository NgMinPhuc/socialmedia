// Xóa dữ liệu cũ nếu có
MATCH (n) DETACH DELETE n;

// Tạo 10 user profiles
CREATE (alice:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'Alice',
    lastName: 'Nguyen',
    userName: 'alice_nguyen',
    dateOfBirth: date('1990-01-15'),
    phoneNumber: '0901234567',
    location: 'Ho Chi Minh City',
    email: 'alice@example.com'
})

CREATE (bob:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440002',
    firstName: 'Bob',
    lastName: 'Tran',
    userName: 'bob_tran',
    dateOfBirth: date('1988-05-20'),
    phoneNumber: '0912345678',
    location: 'Hanoi',
    email: 'bob@example.com'
})

CREATE (charlie:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440003',
    firstName: 'Charlie',
    lastName: 'Le',
    userName: 'charlie_le',
    dateOfBirth: date('1992-09-10'),
    phoneNumber: '0923456789',
    location: 'Da Nang',
    email: 'charlie@example.com'
})

CREATE (diana:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440004',
    firstName: 'Diana',
    lastName: 'Pham',
    userName: 'diana_pham',
    dateOfBirth: date('1995-03-25'),
    phoneNumber: '0934567890',
    location: 'Can Tho',
    email: 'diana@example.com'
})

CREATE (ethan:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440005',
    firstName: 'Ethan',
    lastName: 'Vo',
    userName: 'ethan_vo',
    dateOfBirth: date('1987-11-05'),
    phoneNumber: '0945678901',
    location: 'Hue',
    email: 'ethan@example.com'
})

CREATE (frank:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440006',
    firstName: 'Frank',
    lastName: 'Miller',
    userName: 'frank_miller',
    dateOfBirth: date('1993-07-12'),
    phoneNumber: '0956789012',
    location: 'Nha Trang',
    email: 'frank@example.com'
})

CREATE (grace:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440007',
    firstName: 'Grace',
    lastName: 'Lee',
    userName: 'grace_lee',
    dateOfBirth: date('1991-02-28'),
    phoneNumber: '0967890123',
    location: 'Vung Tau',
    email: 'grace@example.com'
})

CREATE (henry:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440008',
    firstName: 'Henry',
    lastName: 'Taylor',
    userName: 'henry_taylor',
    dateOfBirth: date('1989-06-18'),
    phoneNumber: '0978901234',
    location: 'Da Lat',
    email: 'henry@example.com'
})

CREATE (ivy:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440009',
    firstName: 'Ivy',
    lastName: 'Martinez',
    userName: 'ivy_martinez',
    dateOfBirth: date('1996-10-02'),
    phoneNumber: '0989012345',
    location: 'Hai Phong',
    email: 'ivy@example.com'
})

CREATE (jack:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440010',
    firstName: 'Jack',
    lastName: 'Wilson',
    userName: 'jack_wilson',
    dateOfBirth: date('1994-04-15'),
    phoneNumber: '0990123456',
    location: 'Bien Hoa',
    email: 'jack@example.com'
})

CREATE (kate:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440011',
    firstName: 'Kate',
    lastName: 'Nguyen',
    userName: 'kate_nguyen',
    dateOfBirth: date('1993-08-22'),
    phoneNumber: '0991234567',
    location: 'Quy Nhon',
    email: 'kate@example.com'
})

CREATE (liam:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440012',
    firstName: 'Liam',
    lastName: 'Tran',
    userName: 'liam_tran',
    dateOfBirth: date('1990-12-05'),
    phoneNumber: '0912345678',
    location: 'Phan Thiet',
    email: 'liam@example.com'
})

CREATE (mia:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440013',
    firstName: 'Mia',
    lastName: 'Le',
    userName: 'mia_le',
    dateOfBirth: date('1995-07-18'),
    phoneNumber: '0923456789',
    location: 'Buon Ma Thuot',
    email: 'mia@example.com'
})

CREATE (nathan:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440014',
    firstName: 'Nathan',
    lastName: 'Pham',
    userName: 'nathan_pham',
    dateOfBirth: date('1988-03-30'),
    phoneNumber: '0934567890',
    location: 'Rach Gia',
    email: 'nathan@example.com'
})

CREATE (olivia:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440015',
    firstName: 'Olivia',
    lastName: 'Vo',
    userName: 'olivia_vo',
    dateOfBirth: date('1992-01-12'),
    phoneNumber: '0945678901',
    location: 'Ca Mau',
    email: 'olivia@example.com'
})

CREATE (peter:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440016',
    firstName: 'Peter',
    lastName: 'Smith',
    userName: 'peter_smith',
    dateOfBirth: date('1991-09-25'),
    phoneNumber: '0956789012',
    location: 'Pleiku',
    email: 'peter@example.com'
})

CREATE (quinn:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440017',
    firstName: 'Quinn',
    lastName: 'Jones',
    userName: 'quinn_jones',
    dateOfBirth: date('1994-11-08'),
    phoneNumber: '0967890123',
    location: 'Vinh',
    email: 'quinn@example.com'
})

CREATE (ruby:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440018',
    firstName: 'Ruby',
    lastName: 'Ho',
    userName: 'ruby_ho',
    dateOfBirth: date('1997-04-20'),
    phoneNumber: '0978901234',
    location: 'My Tho',
    email: 'ruby@example.com'
})

CREATE (samuel:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440019',
    firstName: 'Samuel',
    lastName: 'Kim',
    userName: 'samuel_kim',
    dateOfBirth: date('1990-06-15'),
    phoneNumber: '0989012345',
    location: 'Long Xuyen',
    email: 'samuel@example.com'
})

CREATE (tina:`user profile` {
    id: randomUUID(),
    userId: '550e8400-e29b-41d4-a716-446655440020',
    firstName: 'Tina',
    lastName: 'Phan',
    userName: 'tina_phan',
    dateOfBirth: date('1993-02-28'),
    phoneNumber: '0990123456',
    location: 'Bac Lieu',
    email: 'tina@example.com'
});

// Tạo các mối quan hệ FOLLOW
MATCH (alice:`user profile` {userName: 'alice_nguyen'})
MATCH (bob:`user profile` {userName: 'bob_tran'})
MATCH (charlie:`user profile` {userName: 'charlie_le'})
MATCH (diana:`user profile` {userName: 'diana_pham'})
MATCH (ethan:`user profile` {userName: 'ethan_vo'})
MATCH (frank:`user profile` {userName: 'frank_miller'})
MATCH (grace:`user profile` {userName: 'grace_lee'})
MATCH (henry:`user profile` {userName: 'henry_taylor'})
MATCH (ivy:`user profile` {userName: 'ivy_martinez'})
MATCH (jack:`user profile` {userName: 'jack_wilson'})
MATCH (kate:`user profile` {userName: 'kate_nguyen'})
MATCH (liam:`user profile` {userName: 'liam_tran'})
MATCH (mia:`user profile` {userName: 'mia_le'})
MATCH (nathan:`user profile` {userName: 'nathan_pham'})
MATCH (olivia:`user profile` {userName: 'olivia_vo'})
MATCH (peter:`user profile` {userName: 'peter_smith'})
MATCH (quinn:`user profile` {userName: 'quinn_jones'})
MATCH (ruby:`user profile` {userName: 'ruby_ho'})
MATCH (samuel:`user profile` {userName: 'samuel_kim'})
MATCH (tina:`user profile` {userName: 'tina_phan'})

// Alice follows everyone
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(bob)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(charlie)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(diana)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(ethan)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(frank)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(grace)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(henry)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(ivy)
CREATE (alice)-[:FOLLOWS {createdAt: datetime()}]->(jack)

// Everyone follows Alice
CREATE (bob)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (charlie)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (diana)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (ethan)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (frank)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (grace)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (henry)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (ivy)-[:FOLLOWS {createdAt: datetime()}]->(alice)
CREATE (jack)-[:FOLLOWS {createdAt: datetime()}]->(alice);

// Create additional follow relationships
CREATE 
(bob)-[:FOLLOWS]->(charlie),
(charlie)-[:FOLLOWS]->(diana),
(diana)-[:FOLLOWS]->(ethan),
(ethan)-[:FOLLOWS]->(frank),
(frank)-[:FOLLOWS]->(grace),
(grace)-[:FOLLOWS]->(henry),
(henry)-[:FOLLOWS]->(ivy),
(ivy)-[:FOLLOWS]->(jack),
(jack)-[:FOLLOWS]->(bob),
(kate)-[:FOLLOWS]->(liam),
(liam)-[:FOLLOWS]->(mia),
(mia)-[:FOLLOWS]->(nathan),
(nathan)-[:FOLLOWS]->(olivia),
(olivia)-[:FOLLOWS]->(peter),
(peter)-[:FOLLOWS]->(quinn),
(quinn)-[:FOLLOWS]->(ruby),
(ruby)-[:FOLLOWS]->(samuel),
(samuel)-[:FOLLOWS]->(tina),
(tina)-[:FOLLOWS]->(kate);

// Additional relationships between original and new users
CREATE
(alice)-[:FOLLOWS]->(kate),
(alice)-[:FOLLOWS]->(liam),
(bob)-[:FOLLOWS]->(mia),
(charlie)-[:FOLLOWS]->(nathan),
(diana)-[:FOLLOWS]->(olivia),
(ethan)-[:FOLLOWS]->(peter),
(frank)-[:FOLLOWS]->(quinn),
(grace)-[:FOLLOWS]->(ruby),
(henry)-[:FOLLOWS]->(samuel),
(ivy)-[:FOLLOWS]->(tina),
(kate)-[:FOLLOWS]->(alice),
(liam)-[:FOLLOWS]->(bob),
(mia)-[:FOLLOWS]->(charlie),
(nathan)-[:FOLLOWS]->(diana),
(olivia)-[:FOLLOWS]->(ethan),
(peter)-[:FOLLOWS]->(frank),
(quinn)-[:FOLLOWS]->(grace),
(ruby)-[:FOLLOWS]->(henry),
(samuel)-[:FOLLOWS]->(ivy),
(tina)-[:FOLLOWS]->(jack); 