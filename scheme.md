# Scheme

- /admin/rooms/{roomID}
  - id // roomID
  - password // hashed
  - users[] // uid
  - owners[] // uid
- /rooms/{roomID}
  - id // roomID
  - name
  - next // uid
  - password // true/false
  - history[]
  - createdAt
  - updatedAt
- /users/{uid}
  - uid
  - name
  - createdAt
  - updatedAt

## Rules

- /admin/rooms/{roomID}
  - only admin
- /rooms/{roomID}
  - auth.uid in /admin/rooms/{roomID}/owners
- /users/{uid}
  - auth.uid == uid
