const schema = {
    "title": "A registration form",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string",
            "title": "First name"
        },
        "lastName": {
            "type": "string",
            "title": "Last name"
        },
        "age": {
            "type": "integer",
            "title": "Age"
        },
        "bio": {
            "type": "string",
            "title": "Bio"
        },
        "password": {
            "type": "string",
            "title": "Password",
            "minLength": 3
        },
        "telephone": {
            "type": "string",
            "title": "Telephone",
            "minLength": 10
        }
    }
};

const schemaB = {
    "title": "A registration form",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string",
            "title": "First name"
        },
        "lastName": {
            "type": "string",
            "title": "Last name"
        },
        "age": {
            "type": "integer",
            "title": "Age"
        },
        "bio": {
            "type": "string",
            "title": "Bio"
        },
        "password": {
            "type": "string",
            "title": "Password",
            "minLength": 3
        },
        "telephone": {
            "type": "string",
            "title": "Telephone",
            "minLength": 10
        }
    }
};