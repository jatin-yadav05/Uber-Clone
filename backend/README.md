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