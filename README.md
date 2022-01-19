# biological-dictionary-server

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
