# Code Challenge: SuperHeroes - FLASK - SQLALCHEMY - REACT - POSTGRESQL

## Description

This is a code challenge to practice the following technologies:

- Flask
- SQLAlchemy
- React
- PostgreSQL
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-restful (for REST API)
- Vite (for React)
- Postman (for API testing)
- Faker (for generating fake data)
- pytest (for testing)
- importlib-resources (for importing files)
- ipdb (for debugging)
- pipenv (for managing dependencies)
- npm (for managing frontend dependencies)


## Instructions

## Requirements

1. Install Python 3.8.x and above (https://www.python.org/downloads/)
2. Install PostgreSQL 12.x (https://www.postgresql.org/download/)
3. Install Node.js 12.x (https://nodejs.org/en/download/)
4. Install NPM (https://www.npmjs.com/get-npm)
5. Install Yarn (https://classic.yarnpkg.com/en/docs/install)
6. Install Git (https://git-scm.com/downloads)
7. Install Visual Studio Code (https://code.visualstudio.com/download)
8. Install VS Code Extensions:
    - Python (ms-python.python)
    - GitLens (eamodio.gitlens)
    - Markdown All in One (yzhang.markdown-all-in-one)
    - Visual Studio IntelliCode (VisualStudioExptTeam.vscodeintellicode)
    - connect to server (ms-vscode.vscode-node-azure-pack)
    - Python Indent (KevinRose.vsc-python-indent)
    
    
## Setup

### 1. Clone the repo

```bash
git clone git@github.com:levos-snr/superheroes.git 
-------------------------or---------------------------
git clone https://github.com/levos-snr/superheroes.git
```

### 2. Create a virtual environment
The instructions assume you changed into the `code-challenge` folder **prior**
to opening the code editor.

To download the dependencies for the frontend and backend, run:

```console
pipenv install
pipenv shell
npm install --prefix client
```
You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

You can run your React app on [`localhost:4000`](http://localhost:4000) by
running:

```sh
npm run dev --prefix client
```


### 3. Install dependencies
 ```bash
 [packages]
 Faker = "*"
 Flask = "*"
 Flask-Migrate = "*"
 Flask-SQLAlchemy = "*"
 importlib-resources = "*"
 ipdb = "*"
 pytest = "*"
 flask-restful = "*"
 sqlalchemy-serializer = "*"
 
 [requires]
 python_full_version = "3.12"
 
 ```
 
 ```bash
 [node]
 "dependencies": {
   "@testing-library/jest-dom": "^6.5.0",
   "@testing-library/react": "^16.0.1",
   "@testing-library/user-event": "^14.5.2",
   "react": "^18.3.1",
   "react-dom": "^18.3.1",
   "react-router-dom": "^6.26.2",
   "react-scripts": "^5.0.1",
   "web-vitals": "^4.2.3"
 },
 "devDependencies": {
   "@eslint/js": "^9.11.1",
   "@types/react": "^18.3.10",
   "@types/react-dom": "^18.3.0",
   "@vitejs/plugin-react": "^4.3.2",
   "eslint": "^9.11.1",
   "eslint-plugin-react": "^7.37.0",
   "eslint-plugin-react-hooks": "^5.1.0-rc.0",
   "eslint-plugin-react-refresh": "^0.4.12",
   "globals": "^15.9.0",
   "vite": "^5.4.8"
 },
 ```
 

```bash
pipenv install

In this repo:

- There is a Flask application with some features built out.
- There is a fully built React frontend application.
- There are tests included which you can run using `pytest -x`.
- There is a file `postman_collection.json` that
  contains a Postman collection of requests for testing each route you will
  implement.

Depending on your preference, you can either check your API by:
  
  - Using Postman to make requests
  - Running `pytest -x` and seeing if your code passes the tests
  - Running the React application in the browser and interacting with the API via
    the frontend
    You can import `postman_collection.json` into Postman by
    pressing the `Import` button.
    
    ![import postman](https://curriculum-content.s3.amazonaws.com/6130/phase-4-code-challenge-instructions/import_collection.png)
    
    Select `Upload Files`, navigate to this repo folder, and select
    `postman_collection.json` as the file to import.

    You are not being assessed on React, and you don't have to update any of the
    React code; the frontend code is available just so that you can test out the
    behavior of your API in a realistic setting
    
    
## Models for Hero

You will implement an API for the following data model:

![domain diagram](https://curriculum-content.s3.amazonaws.com/6130/code-challenge-2/domain.png)

The file `server/models.py` defines the model classes **without relationships**.
Use the following commands to create the initial database `app.db`:


```bash
export FLASK_APP=server/app.py
flask db init
flask db upgrade head
```


```python
class Hero(db.Model, SerializerMixin):
    __tablename__ = 'heroes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    super_name = db.Column(db.String)

    # Relationship
    hero_powers = db.relationship('HeroPower', back_populates='hero', cascade='all, delete-orphan')
    powers = association_proxy('hero_powers', 'power')

    # Serialization rules so that we can serialize the related Heroes and Powers
    serialize_rules = ('-hero_powers.hero', '-powers.heroes')

    def __repr__(self):
        return f'<Hero {self.id}>'
        
        
        class Power(db.Model, SerializerMixin):
            __tablename__ = 'powers'
        
            id = db.Column(db.Integer, primary_key=True)
            name = db.Column(db.String)
            description = db.Column(db.String)
        
            # Relationship to HeroPower
            hero_powers = db.relationship('HeroPower', back_populates='power', cascade='all, delete-orphan')
            heroes = association_proxy('hero_powers', 'hero')
        
            # Serialization rules so that we can serialize the related Heroes
            serialize_rules = ('-hero_powers.power', '-heroes.powers')
        
            # Validation rules
            @validates('description')
            def validate_description(self, key, description):
                if not description or len(description) < 20:
                    raise ValueError("Description must be present and at least 20 characters long.")
                return description
        
            def __repr__(self):
                return f'<Power {self.id}>'
                class HeroPower(db.Model, SerializerMixin):
                    __tablename__ = 'hero_powers'
                
                    id = db.Column(db.Integer, primary_key=True)
                    strength = db.Column(db.String, nullable=False)
                
                    # Relationships to Hero and Power
                    hero_id = db.Column(db.Integer, db.ForeignKey('heroes.id'))
                    power_id = db.Column(db.Integer, db.ForeignKey('powers.id'))
                
                    hero = db.relationship('Hero', back_populates='hero_powers')
                    power = db.relationship('Power', back_populates='hero_powers')
                
                    # Serialization rules so that we can serialize the related Hero and Power
                    serialize_rules = ('-hero.hero_powers', '-power.hero_powers')
                
                    # Validation rules
                    @validates('strength')
                    def validate_strength(self, key, strength):
                        valid_strengths = ['Strong', 'Weak', 'Average']
                        if strength not in valid_strengths:
                            raise ValueError("Strength must be one of: Strong, Weak, Average")
                        return strength
                
                    # custom __repr__ method
                    def __repr__(self):
                        return f'<HeroPower {self.id}>'
```





Now you can implement the relationships as shown in the ER Diagram:

- A `Hero` has many `Power`s through `HeroPower`
- A `Power` has many `Hero`s through `HeroPower`
- A `HeroPower` belongs to a `Hero` and belongs to a `Power`

Update `server/models.py` to establish the model relationships. Since a
`HeroPower` belongs to a `Hero` and a `Power`, configure the model to cascade
deletes.

Set serialization rules to limit the recursion depth.

Run the migrations and seed the database:

```console
flask db revision --autogenerate -m 'message'
flask db upgrade head
python server/seed.py
```

## Routes

Set up the following routes. Make sure to return JSON data in the format
specified along with the appropriate HTTP verb.

Recall you can specify fields to include or exclude when serializing a model
instance to a dictionary using to_dict() (don't forget the comma if specifying a
single field).

NOTE: If you choose to implement a Flask-RESTful app, you need to add code to
instantiate the `Api` class in server/app.py.

### GET /heroes

Return JSON data in the format below:

```json
[
  {
    "id": 1,
    "name": "Kamala Khan",
    "super_name": "Ms. Marvel"
  },
  {
    "id": 2,
    "name": "Doreen Green",
    "super_name": "Squirrel Girl"
  },
  {
    "id": 3,
    "name": "Gwen Stacy",
    "super_name": "Spider-Gwen"
  },
  {
    "id": 4,
    "name": "Janet Van Dyne",
    "super_name": "The Wasp"
  },
  {
    "id": 5,
    "name": "Wanda Maximoff",
    "super_name": "Scarlet Witch"
  },
  {
    "id": 6,
    "name": "Carol Danvers",
    "super_name": "Captain Marvel"
  },
  {
    "id": 7,
    "name": "Jean Grey",
    "super_name": "Dark Phoenix"
  },
  {
    "id": 8,
    "name": "Ororo Munroe",
    "super_name": "Storm"
  },
  {
    "id": 9,
    "name": "Kitty Pryde",
    "super_name": "Shadowcat"
  },
  {
    "id": 10,
    "name": "Elektra Natchios",
    "super_name": "Elektra"
  }
]
```

### GET /heroes/:id

If the `Hero` exists, return JSON data in the format below:

```json
{
  "id": 1,
  "name": "Kamala Khan",
  "super_name": "Ms. Marvel",
  "hero_powers": [
    {
      "hero_id": 1,
      "id": 1,
      "power": {
        "description": "gives the wielder the ability to fly through the skies at supersonic speed",
        "id": 2,
        "name": "flight"
      },
      "power_id": 2,
      "strength": "Strong"
    }
  ]
}
```

If the `Hero` does not exist, return the following JSON data, along with the
appropriate HTTP status code:

```json
{
  "error": "Hero not found"
}
```

### GET /powers

Return JSON data in the format below:

```json
[
  {
    "description": "gives the wielder super-human strengths",
    "id": 1,
    "name": "super strength"
  },
  {
    "description": "gives the wielder the ability to fly through the skies at supersonic speed",
    "id": 2,
    "name": "flight"
  },
  {
    "description": "allows the wielder to use her senses at a super-human level",
    "id": 3,
    "name": "super human senses"
  },
  {
    "description": "can stretch the human body to extreme lengths",
    "id": 4,
    "name": "elasticity"
  }
]
```

### GET /powers/:id

If the `Power` exists, return JSON data in the format below:

```json
{
  "description": "gives the wielder super-human strengths",
  "id": 1,
  "name": "super strength"
}
```

If the `Power` does not exist, return the following JSON data, along with the
appropriate HTTP status code:

```json
{
  "error": "Power not found"
}
```

### PATCH /powers/:id

This route should update an existing `Power`. It should accept an object with
the following properties in the body of the request:

```json
{
  "description": "Valid Updated Description"
}
```

If the `Power` exists and is updated successfully (passes validations), update
its description and return JSON data in the format below:

```json
{
  "description": "Valid Updated Description",
  "id": 1,
  "name": "super strength"
}
```

If the `Power` does not exist, return the following JSON data, along with the
appropriate HTTP status code:

```json
{
  "error": "Power not found"
}
```

If the `Power` is **not** updated successfully (does not pass validations),
return the following JSON data, along with the appropriate HTTP status code:

```json
{
  "errors": ["validation errors"]
}
```

### POST /hero_powers

This route should create a new `HeroPower` that is associated with an existing
`Power` and `Hero`. It should accept an object with the following properties in
the body of the request:

```json
{
  "strength": "Average",
  "power_id": 1,
  "hero_id": 3
}
```

If the `HeroPower` is created successfully, send back a response with the data
related to the new `HeroPower`:

```json
{
  "id": 11,
  "hero_id": 3,
  "power_id": 1,
  "strength": "Average",
  "hero": {
    "id": 3,
    "name": "Gwen Stacy",
    "super_name": "Spider-Gwen"
  },
  "power": {
    "description": "gives the wielder super-human strengths",
    "id": 1,
    "name": "super strength"
  }
}
```

If the `HeroPower` is **not** created successfully, return the following JSON
data, along with the appropriate HTTP status code:

```json
{
  "errors": ["validation errors"]
}
```

