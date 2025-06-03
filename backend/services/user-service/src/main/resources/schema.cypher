// Xóa toàn bộ dữ liệu hiện có (các nodes và relationships) để bắt đầu lại
MATCH (n) DETACH DELETE n;

---

// Tạo các User Profiles
// Sử dụng UNWIND để tạo nhiều nodes từ một danh sách dữ liệu
UNWIND [
    {firstName: 'Alice', lastName: 'Nguyen', username: 'alice_nguyen', dob: date('1990-01-15'), phoneNumber: '0901234567', location: 'Ho Chi Minh City', email: 'alice@example.com', userIdSuffix: '0001'},
    {firstName: 'Bob', lastName: 'Tran', username: 'bob_tran', dob: date('1988-05-20'), phoneNumber: '0912345678', location: 'Hanoi', email: 'bob@example.com', userIdSuffix: '0002'},
    {firstName: 'Charlie', lastName: 'Le', username: 'charlie_le', dob: date('1992-09-10'), phoneNumber: '0923456789', location: 'Da Nang', email: 'charlie@example.com', userIdSuffix: '0003'},
    {firstName: 'Diana', lastName: 'Pham', username: 'diana_pham', dob: date('1995-03-25'), phoneNumber: '0934567890', location: 'Can Tho', email: 'diana@example.com', userIdSuffix: '0004'},
    {firstName: 'Ethan', lastName: 'Vo', username: 'ethan_vo', dob: date('1987-11-05'), phoneNumber: '0945678901', location: 'Hue', email: 'ethan@example.com', userIdSuffix: '0005'},
    {firstName: 'Frank', lastName: 'Miller', username: 'frank_miller', dob: date('1993-07-12'), phoneNumber: '0956789012', location: 'Nha Trang', email: 'frank@example.com', userIdSuffix: '0006'},
    {firstName: 'Grace', lastName: 'Lee', username: 'grace_lee', dob: date('1991-02-28'), phoneNumber: '0967890123', location: 'Vung Tau', email: 'grace@example.com', userIdSuffix: '0007'},
    {firstName: 'Henry', lastName: 'Taylor', username: 'henry_taylor', dob: date('1989-06-18'), phoneNumber: '0978901234', location: 'Da Lat', email: 'henry@example.com', userIdSuffix: '0008'},
    {firstName: 'Ivy', lastName: 'Martinez', username: 'ivy_martinez', dob: date('1996-10-02'), phoneNumber: '0989012345', location: 'Hai Phong', email: 'ivy@example.com', userIdSuffix: '0009'},
    {firstName: 'Jack', lastName: 'Wilson', username: 'jack_wilson', dob: date('1994-04-15'), phoneNumber: '0990123456', location: 'Bien Hoa', email: 'jack@example.com', userIdSuffix: '0010'},
    {firstName: 'Kate', lastName: 'Nguyen', username: 'kate_nguyen', dob: date('1993-08-22'), phoneNumber: '0991234567', location: 'Quy Nhon', email: 'kate@example.com', userIdSuffix: '0011'},
    {firstName: 'Liam', lastName: 'Tran', username: 'liam_tran', dob: date('1990-12-05'), phoneNumber: '0912345678', location: 'Phan Thiet', email: 'liam@example.com', userIdSuffix: '0012'},
    {firstName: 'Mia', lastName: 'Le', username: 'mia_le', dob: date('1995-07-18'), phoneNumber: '0923456789', location: 'Buon Ma Thuot', email: 'mia@example.com', userIdSuffix: '0013'},
    {firstName: 'Nathan', lastName: 'Pham', username: 'nathan_pham', dob: date('1988-03-30'), phoneNumber: '0934567890', location: 'Rach Gia', email: 'nathan@example.com', userIdSuffix: '0014'},
    {firstName: 'Olivia', lastName: 'Vo', username: 'olivia_vo', dob: date('1992-01-12'), phoneNumber: '0945678901', location: 'Ca Mau', email: 'olivia@example.com', userIdSuffix: '0015'},
    {firstName: 'Peter', lastName: 'Smith', username: 'peter_smith', dob: date('1991-09-25'), phoneNumber: '0956789012', location: 'Pleiku', email: 'peter@example.com', userIdSuffix: '0016'},
    {firstName: 'Quinn', lastName: 'Jones', username: 'quinn_jones', dob: date('1994-11-08'), phoneNumber: '0967890123', location: 'Vinh', email: 'quinn@example.com', userIdSuffix: '0017'},
    {firstName: 'Ruby', lastName: 'Ho', username: 'ruby_ho', dob: date('1997-04-20'), phoneNumber: '0978901234', location: 'My Tho', email: 'ruby@example.com', userIdSuffix: '0018'},
    {firstName: 'Samuel', lastName: 'Kim', username: 'samuel_kim', dob: date('1990-06-15'), phoneNumber: '0989012345', location: 'Long Xuyen', email: 'samuel@example.com', userIdSuffix: '0019'},
    {firstName: 'Tina', lastName: 'Phan', username: 'tina_phan', dob: date('1993-02-28'), phoneNumber: '0990123456', location: 'Bac Lieu', email: 'tina@example.com', userIdSuffix: '0020'}
] AS data
CREATE (p:`UserProfile`)
SET p.id = randomUUID(),
    p.userId = '550e8400-e29b-41d4-a716-44665544' + data.userIdSuffix,
    p.firstName = data.firstName,
    p.lastName = data.lastName,
    p.username = data.username,
    p.dateOfBirth = data.dob,
    p.phoneNumber = data.phoneNumber,
    p.location = data.location,
    p.email = data.email;

---

// Tạo các mối quan hệ FOLLOWS
MATCH (alice:UserProfile {username: 'alice_nguyen'})
MATCH (bob:UserProfile {username: 'bob_tran'})
MATCH (charlie:UserProfile {username: 'charlie_le'})
MATCH (diana:UserProfile {username: 'diana_pham'})
MATCH (ethan:UserProfile {username: 'ethan_vo'})
MATCH (frank:UserProfile {username: 'frank_miller'})
MATCH (grace:UserProfile {username: 'grace_lee'})
MATCH (henry:UserProfile {username: 'henry_taylor'})
MATCH (ivy:UserProfile {username: 'ivy_martinez'})
MATCH (jack:UserProfile {username: 'jack_wilson'})
MATCH (kate:UserProfile {username: 'kate_nguyen'})
MATCH (liam:UserProfile {username: 'liam_tran'})
MATCH (mia:UserProfile {username: 'mia_le'})
MATCH (nathan:UserProfile {username: 'nathan_pham'})
MATCH (olivia:UserProfile {username: 'olivia_vo'})
MATCH (peter:UserProfile {username: 'peter_smith'})
MATCH (quinn:UserProfile {username: 'quinn_jones'})
MATCH (ruby:UserProfile {username: 'ruby_ho'})
MATCH (samuel:UserProfile {username: 'samuel_kim'})
MATCH (tina:UserProfile {username: 'tina_phan'})
