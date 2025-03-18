# User API Documentation

## Register User Endpoint

Register a new user in the system.

### Endpoint

```
POST /api/users/register
```

### Request Body

```json
{
  "fullName": {
    "firstName": "string",    // Required, minimum 3 characters
    "lastName": "string"      // Optional, minimum 3 characters if provided
  },
  "email": "string",         // Required, valid email format
  "password": "string"       // Required, minimum 6 characters
}
```

### Validation Rules

- **firstName**: 
  - Required
  - Minimum length: 3 characters
  - Must be trimmed (no leading/trailing spaces)

- **lastName**:
  - Optional
  - Minimum length: 3 characters (if provided)
  - Must be trimmed (no leading/trailing spaces)

- **email**:
  - Required
  - Must be a valid email format
  - Must be unique in the system
  - Will be stored in lowercase

- **password**:
  - Required
  - Minimum length: 6 characters
  - Will be hashed before storage

### Responses

#### Success Response

- **Status Code**: 201 (Created)
- **Content**:
```json
{
  "user": {
    "fullName": {
      "firstName": "string",
      "lastName": "string"
    },
    "email": "string",
    "createdAt": "timestamp"
  },
  "token": "JWT_Token_String"
}
```

#### Error Responses

1. **Invalid Input**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "errors": [
       {
         "msg": "Error message",
         "param": "field_name",
         "location": "body"
       }
     ]
   }
   ```

2. **Email Already Exists**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "User already exists with this email"
   }
   ```

3. **Server Error**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "Error message"
   }
   ```

### Example Request

```bash
curl -X POST http://your-api-url/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

## Login User Endpoint

Authenticate an existing user and receive an access token.

### Endpoint

```
POST /api/users/login
```

### Request Body

```json
{
  "email": "string",    // Required, valid email format
  "password": "string"  // Required, minimum 6 characters
}
```

### Validation Rules

- **email**:
  - Required
  - Must be a valid email format
  - Case insensitive

- **password**:
  - Required
  - Minimum length: 6 characters

### Responses

#### Success Response

- **Status Code**: 200 (OK)
- **Content**:
```json
{
  "user": {
    "fullName": {
      "firstName": "string",
      "lastName": "string"
    },
    "email": "string",
    "createdAt": "timestamp"
  },
  "token": "JWT_Token_String"
}
```

#### Error Responses

1. **Invalid Input**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "errors": [
       {
         "msg": "Error message",
         "param": "field_name",
         "location": "body"
       }
     ]
   }
   ```

2. **Invalid Credentials**
   - **Status Code**: 401
   - **Content**:
   ```json
   {
     "error": "Invalid email or password"
   }
   ```

3. **Server Error**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "Error message"
   }
   ```

### Example Request

```bash
curl -X POST http://your-api-url/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

## Get User Profile Endpoint

Retrieve the profile information of the authenticated user.

### Endpoint

```
GET /api/users/profile
```

### Authentication

- Requires a valid JWT token in the request header or cookie
- Format: `Authorization: Bearer <token>` or Cookie: `token=<token>`

### Responses

#### Success Response

- **Status Code**: 200 (OK)
- **Content**:
```json
{
  "fullName": {
    "firstName": "string",
    "lastName": "string"
  },
  "email": "string",
  "createdAt": "timestamp"
}
```

#### Error Responses

1. **Unauthorized Access**
   - **Status Code**: 401
   - **Content**:
   ```json
   {
     "error": "Please authenticate"
   }
   ```

2. **Server Error**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "Error message"
   }
   ```

### Example Request

```bash
curl -X GET http://your-api-url/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Logout User Endpoint

Logout the currently authenticated user and invalidate their token.

### Endpoint

```
GET /api/users/logout
```

### Authentication

- Requires a valid JWT token in the request header or cookie
- Format: `Authorization: Bearer <token>` or Cookie: `token=<token>`

### Description

- Clears the authentication token cookie
- Blacklists the current token to prevent reuse
- Logs out the user from the current session

### Responses

#### Success Response

- **Status Code**: 200 (OK)
- **Content**:
```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

1. **Server Error**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "Error message"
   }
   ```

### Example Request

```bash
curl -X GET http://your-api-url/api/users/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --cookie "token=YOUR_JWT_TOKEN"
```

### Notes

- The endpoint will clear the authentication cookie from the client
- The token will be added to a blacklist to prevent reuse
- Subsequent requests with the same token will be rejected 

# Captain API Documentation

## Register Captain Endpoint

Register a new captain (driver) in the system.

### Endpoint

```
POST /api/captains/register
```

### Request Body

```json
{
  "fullName": {
    "firstName": "string",    // Required
    "lastName": "string"
  },
  "email": "string",         // Required, valid email format
  "password": "string",      // Required
  "vehicle": {
    "color": "string",       // Required, vehicle color
    "capacity": "number",    // Required, vehicle passenger capacity
    "vehicleType": "string", // Required, type of vehicle
    "plate": "string"        // Required, vehicle plate number
  }
}
```

### Validation Rules

- **fullName**:
  - firstName and lastName are required
  - Must be valid string values

- **email**:
  - Required
  - Must be a valid email format
  - Must be unique in the system
  - Will be stored in lowercase

- **password**:
  - Required
  - Will be hashed before storage

- **vehicle**:
  - color: Required, vehicle color
  - capacity: Required, number of passengers the vehicle can accommodate
  - vehicleType: Required, type of vehicle (e.g., "car", "van")
  - plate: Required, vehicle registration plate number

### Responses

#### Success Response

- **Status Code**: 201 (Created)
- **Content**:
```json
{
  "captain": {
    "fullName": {
      "firstName": "string",
      "lastName": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "capacity": "number",
      "vehicleType": "string",
      "plate": "string"
    },
    "createdAt": "timestamp"
  },
  "token": "JWT_Token_String"
}
```

#### Error Responses

1. **Invalid Input**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "errors": [
       {
         "msg": "Error message",
         "param": "field_name",
         "location": "body"
       }
     ]
   }
   ```

2. **Email Already Exists**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "Email already exists"
   }
   ```

3. **Server Error**
   - **Status Code**: 400
   - **Content**:
   ```json
   {
     "error": "Error message"
   }
   ```

### Example Request

```bash
curl -X POST http://your-api-url/api/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Driver"
    },
    "email": "john.driver@example.com",
    "password": "securepassword123",
    "vehicle": {
      "color": "Black",
      "capacity": 4,
      "vehicleType": "Sedan",
      "plate": "ABC123"
    }
  }'
``` 