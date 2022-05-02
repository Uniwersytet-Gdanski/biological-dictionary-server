# biological-dictionary-server

## Setup

Installing the dependencies:
```
npm install
```

In order to run the server, you need to create the following files in the root directory of the project:

### auth.json
This is a json file used to store credentials of any kind.
```json
{
	"mongodb": {
		"host": "my.mongodb.com",
		"port": 27017,
		"database": "ug-biological-dictionary",
		"username": "server",
		"password": "hard-password",
		"replicaSet": "main"
	},
	"deployToken": "token-used-to-deploy-website"
}
```

### config.json
This json file is used to store configuration of the server.
```json
{
	"port": 18292,
	"baseUrl": "http://localhost:18292",
	"domain": "localhost",
	"paging": {
		"maxPageSize": 100
	},
	"session": {
		"tokenValidityDuration": 143320,
		"tokenLength": 64
	},
	"language": "eng",
	"terms": {
		"syncInterval": 600
	},
	"requestLimiter": {
		"refreshInterval": 0.3
	},
	"websiteDirectory": "./website"
}

```

## API

BASE URL: https://biodictionary.inf.ug.edu.pl/api

### GET /api/terms
Returns fragment of all terms based on pagination parameters and informations about pages.

#### Endpoint:
```
GET /api/terms
```

#### Query parameters:
-    `pageNumber`: page number to be returned (integer, min: 1, default: 1)
-    `pageSize`: number of terms to be returned (integer, min: 1, max: 300, default: 10)

#### Responses:
- ##### 400 Bad Request
    
- ##### 200 OK
    
#### Response example:
```json
{
    "pageNumber": 1,
    "pageSize": 1,
    "maxPageSize": 300,
    "pagesCount": 2881,
    "data": [
        {
            "names": [
                "aberracja chromatyczna"
            ],
            "englishTranslations": [
                {
                    "singular": "chromatic aberration",
                    "plural": "chromatic aberrations"
                },
                {
                    "singular": "chromatic distortion",
                    "plural": "chromatic distortions"
                },
                {
                    "singular": "spherochromaticism",
                    "plural": "spherochromaticisms"
                }
            ],
            "definition": "An optical aberration occuring when a lens does not focus all colours in one place, caused by light dispersion.",
            "id": "aberracja-chromatyczna"
        }
    ],
    "nextPageUrl": "https://dict.gacko.pl/api/terms?pageSize=1&pageNumber=2",
    "previousPageUrl": null
}
```

### GET /api/terms/{id}
Returns term with given id.

#### Endpoint: 
```
GET /api/terms/{id}
```

#### Path parameters:
-    `id`: term id (string, required)

#### Responses:
- ##### 404 Not Found (term not found)
- ##### 200 OK

#### Response example:
```json
{
    "names": [
        "aberracja chromatyczna"
    ],
    "englishTranslations": [
        {
            "singular": "chromatic aberration",
            "plural": "chromatic aberrations"
        },
        {
            "singular": "chromatic distortion",
            "plural": "chromatic distortions"
        },
        {
            "singular": "spherochromaticism",
            "plural": "spherochromaticisms"
        }
    ],
    "definition": "An optical aberration occuring when a lens does not focus all colours in one place, caused by light dispersion.",
    "id": "aberracja-chromatyczna"
}
```

### DELETE /api/terms/{id}
Deletes term with given id.

#### Endpoint: 
```
DELETE /api/terms/{id}
```

#### Path parameters:
-    `id`: term id (string, required)

#### Responses:
- ##### 404 Not Found (term not found)
- ##### 204 No Content

### PUT /api/terms/{id}
Updates term with given id.

#### Endpoint: 
```
PUT /api/terms/{id}
```

#### Path parameters:
-    `id`: term id (string, required)

#### Body parameters:
- `names`: polish translations of term (array od strings, required, min length: 1) 
- `definition`: definition of term (string, required)
- `englishTranslations`: english translations of term in singular and plural versions (required, min length: 1, array of objects containing:
    - `singular`: singular translation of term (string, required)
    - `plural`: plural translation of term (string, required)

#### Responses:
- ##### 400 Bad Request
- ##### 404 Not Found (term not found)
- ##### 409 Conflict (term already exists)
- ##### 200 OK

#### Response example:
```json
{
    "names": [
        "aberracja chromatyczna"
    ],
    "englishTranslations": [
        {
            "singular": "chromatic aberration",
            "plural": "chromatic aberrations"
        },
        {
            "singular": "chromatic distortion",
            "plural": "chromatic distortions"
        },
        {
            "singular": "spherochromaticism",
            "plural": "spherochromaticisms"
        }
    ],
    "definition": "An optical aberration occuring when a lens does not focus all colours in one place, caused by light dispersion.",
    "id": "aberracja-chromatyczna"
}
```

### POST /api/terms
Adds term to database.

#### Endpoint:
```
POST /api/terms
```

#### Body parameters:
- `names`: polish translations of term (array od strings, required, min length: 1) 
- `definition`: definition of term (string, required)
- `englishTranslations`: english translations of term in singular and plural versions (required, min length: 1, array of objects containing:
    - `singular`: singular translation of term (string, required)
    - `plural`: plural translation of term (string, required)

#### Responses:
- ##### 400 Bad Request
- ##### 409 Conflict (term already exists)
- ##### 200 OK
    
#### Response example:
```json
{
    "names": [
        "aberracja chromatyczna"
    ],
    "englishTranslations": [
        {
            "singular": "chromatic aberration",
            "plural": "chromatic aberrations"
        },
        {
            "singular": "chromatic distortion",
            "plural": "chromatic distortions"
        },
        {
            "singular": "spherochromaticism",
            "plural": "spherochromaticisms"
        }
    ],
    "definition": "An optical aberration occuring when a lens does not focus all colours in one place, caused by light dispersion.",
    "id": "aberracja-chromatyczna"
}
```

### GET /api/terms-by-prefix
Returns fragment of terms with given prefix based on pagination parameters and informations about pages.

#### Endpoint: 
```
GET /api/terms-by-prefix
```

#### Query parameters:
-    `prefix`: prefix to be searched (string, required)
-    `pageNumber`: page number to be returned (integer, min: 1, default: 1)
-    `pageSize`: number of terms to be returned (integer, min: 1, max: 300, default: 10)
-    `withFullTerms`: decides if full terms should be returned (boolean, nullable, default: false)

#### Responses:
- ##### 400 Bad Request
- ##### 200 OK

#### Response example:
```json
{
    "pageNumber": 1,
    "pageSize": 1,
    "maxPageSize": 300,
    "pagesCount": 7,
    "data": [
        {
        "id": "aberracja-chromatyczna",
        "name": "aberracja chromatyczna",
        "term": {
            "names": [
                "aberracja chromatyczna"
            ],
            "englishTranslations": [
            {
                "singular": "chromatic aberration",
                "plural": "chromatic aberrations"
            },
            {
                "singular": "chromatic distortion",
                "plural": "chromatic distortions"
            },
            {
                "singular": "spherochromaticism",
                "plural": "spherochromaticisms"
            }
            ],
            "definition": "An optical aberration occuring when a lens does not focus all colours in one place, caused by light dispersion.",
            "id": "aberracja-chromatyczna"
        }
        }
    ],
    "nextPageUrl": "https://dict.gacko.pl/api/terms-by-prefix?prefix=ab&pageSize=1&pageNumber=2",
    "previousPageUrl": null
}
```

### GET /api/search-terms
Returns fragment of terms matching given query based on pagination parameters, informations about pages and score of each term.

#### Endpoint: 
```
GET /api/search-terms
```

#### Query parameters:
-    `query`: query to be searched (string, required)
-    `pageNumber`: page number to be returned (integer, min: 1, default: 1)
-    `pageSize`: number of terms to be returned (integer, min: 1, max: 300, default: 10)
-    `withFullTerms`: decides if full terms should be returned (boolean, nullable, default: false)
-    `withoutDuplicates`: decides if terms with duplicated ids should be returned (boolean, nullable, default: false)

#### Resposes:
- ##### 400 Bad Request
- ##### 200 OK

#### Response example:
```json
{
    "pageNumber": 1,
    "pageSize": 1,
    "maxPageSize": 300,
    "pagesCount": 3446,
    "data": [
        {
        "id": "aberracja-chromatyczna",
        "name": "aberracja chromatyczna",
        "score": 0.8,
        "term": {
            "names": [
            "aberracja chromatyczna"
            ],
            "englishTranslations": [
            {
                "singular": "chromatic aberration",
                "plural": "chromatic aberrations"
            },
            {
                "singular": "chromatic distortion",
                "plural": "chromatic distortions"
            },
            {
                "singular": "spherochromaticism",
                "plural": "spherochromaticisms"
            }
            ],
            "definition": "An optical aberration occuring when a lens does not focus all colours in one place, caused by light dispersion.",
            "id": "aberracja-chromatyczna"
        }
        }
    ],
    "nextPageUrl": "https://dict.gacko.pl/api/search-terms?query=abc&pageSize=1&pageNumber=2",
    "previousPageUrl": null
}
```

### POST /api/login
Creates session for user with given credentials.

#### Endpoint: 
```
POST /api/login
```

#### Body parameters:
-    `login`: login (string, required)
-    `password`: password (string, required)

#### Responses:
- ##### 400 Bad Request
- ##### 401	Unauthorized (wrong login or password)
- ##### 200 OK

#### Response example:
```json
{
    "id": "4b93f793-b866-498b-b495-ca80b56ce39d",
    "login": "mlomiak"
}
```

### POST /api/logout
Destroys session for user.

#### Endpoint: 
```
POST /api/logout
```

#### Responses:
- ##### 401	Unauthorized (no session)
- ##### 204 No Content

### GET /api/me
Returns information about user.

#### Endpoint: 
```
GET /api/me
```

#### Responses:
- ##### 401	Unauthorized (no session)
- ##### 200 OK

#### Response example:
```json
{
    "id": "4b93f793-b866-498b-b495-ca80b56ce39d",
    "login": "mlomiak"
}
```

### GET /api/terms-first-letters
Returns list of all possible first letters of terms.

#### Endpoint:
```
GET /api/terms-first-letters
```

#### Responses:
- ##### 200 OK
    
#### Response example:
```json
["a","b","c","d","e","f","g","h","i","j","k","l","ł","m","n","o","p","r","s","ś","t","u","w","z","ż"]
```
