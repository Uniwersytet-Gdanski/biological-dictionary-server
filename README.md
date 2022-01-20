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
	"deployToken": "ciazowy-specjalista-123"
}
```

### config.json
This json file is used to store configuration of the server.
```json
{
	"port": 18292,
	"baseUrl": "http://dict.gacko.pl",
	"maxPageSize": 300,
	"tokenValidityDuration": 533224,
	"tokenLength": 64
}
```

## API

BASE URL: https://dict.gacko.pl/api

### GET /api/entries
Returns fragment of all entries based on pagination parameters and informations about pages.

#### Endpoint:
```
GET /api/entries
```

#### Query parameters:
-    `pageNumber`: page number to be returned (integer, min: 1, default: 1)
-    `pageSize`: number of entries to be returned (integer, min: 1, max: 300, default: 10)

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
            "englishTerms": [
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
    "nextPageUrl": "https://dict.gacko.pl/api/entries?pageSize=1&pageNumber=2",
    "previousPageUrl": null
}
```

### GET /api/entries/{id}
Returns entry with given id.

#### Endpoint: 
```
GET /api/entries/{id}
```

#### Path parameters:
-    `id`: entry id (string, required)

#### Responses:
- ##### 404 Not Found (entry not found)
- ##### 200 OK

#### Response example:
```json
{
    "names": [
        "aberracja chromatyczna"
    ],
    "englishTerms": [
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

### DELETE /api/entries/{id}
Deletes entry with given id.

#### Endpoint: 
```
DELETE /api/entries/{id}
```

#### Path parameters:
-    `id`: entry id (string, required)

#### Responses:
- ##### 404 Not Found (entry not found)
- ##### 204 No Content

### POST /api/entries
Adds entry to database.

#### Endpoint:
```
POST /api/entries
```

#### Body parameters:
- `names`: polish translations of entry (array od strings, required, min length: 1) 
- `definition`: definition of entry (string, required)
- `englishTerms`: english translations of entry in singular and plural versions (required, min length: 1, array of objects containing:
    - `singular`: singular translation of entry (string, required)
    - `plural`: plural translation of entry (string, required)

#### Responses:
- ##### 400 Bad Request

- ##### 409 Conflict (entry already exists)
    
- ##### 200 OK
    
#### Response example:
```json
{
    "names": [
        "aberracja chromatyczna"
    ],
    "englishTerms": [
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

### GET /api/entries-by-prefix
Returns fragment of entries with given prefix based on pagination parameters and informations about pages.

#### Endpoint: 
```
GET /api/entries-by-prefix
```

#### Query parameters:
-    `prefix`: prefix to be searched (string, required)
-    `pageNumber`: page number to be returned (integer, min: 1, default: 1)
-    `pageSize`: number of entries to be returned (integer, min: 1, max: 300, default: 10)
-    `withoutFullEntries`: decides if full entries should be returned (boolean, nullable, default: false)

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
        "entry": {
            "names": [
            "aberracja chromatyczna"
            ],
            "englishTerms": [
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
    "nextPageUrl": "https://dict.gacko.pl/api/entries-by-prefix?prefix=ab&pageSize=1&pageNumber=2",
    "previousPageUrl": null
}
```

### GET /api/search-entries
Returns fragment of entries matching given query based on pagination parameters, informations about pages and score of each entry.

#### Endpoint: 
```
GET /api/search-entries
```

#### Query parameters:
-    `query`: query to be searched (string, required)
-    `pageNumber`: page number to be returned (integer, min: 1, default: 1)
-    `pageSize`: number of entries to be returned (integer, min: 1, max: 300, default: 10)
-    `withoutFullEntries`: decides if full entries should be returned (boolean, nullable, default: false)

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
        "entry": {
            "names": [
            "aberracja chromatyczna"
            ],
            "englishTerms": [
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
    "nextPageUrl": "https://dict.gacko.pl/api/search-entries?query=abc&pageSize=1&pageNumber=2",
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
- ##### 204 No Content

### GET /api/entries-first-letters
Returns list of all possible first letters of entries.

#### Endpoint:
```
GET /api/entries-first-letters
```

#### Responses:
- ##### 200 OK
    
#### Response example:
```json
["a","b","c","d","e","f","g","h","i","j","k","l","ł","m","n","o","p","r","s","ś","t","u","w","z","ż"]
```
