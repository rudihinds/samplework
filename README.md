# Mirza web app

## Setup

Clone this repo, setup the .env file

```bash
git clone https://github.com/opticpower/mirza.git
cd mirza
cp .env.example .env
```

**Open your `.env` file and setup all variables according to your needs.**
_Check also the side notes on `.env.example`._

## Development

Run the following command to startup server.

```bash
docker-compose up web
```

If you haven't migrated the database yet, you will need to run the migrations and seed commands once:

```
docker-compose run web yarn migrate
```

```
docker-compose run web yarn seed
```

**If you are running it without Docker, remember to check your DB credentials and host in your `.env` file**

### Assets

For production builds you can run `npm production` or `npm build`.

Optimize SVGs with svgo:

```
# For all SVGs
svgo -r -f resources/svg --config=config/svgo.yml --disable=removeAttrs

# For icons
svgo -r -f resources/svg --config=config/svgo.yml
```

## Tests

Be ensure you have a test database.

```bash
createdb mirza_test
```

Run this command for migrations in production environment.

```bash
adonis migration:run
```

Run the following command to run tests

```bash
adonis test
```

## Print schema output

```bash
docker-compose exec postgres pg_dump -s -U postgres mirza_development > ./database/schema.sql
```
