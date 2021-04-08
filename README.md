# Balleilo

## Sports Media CMS

### Project environment variables

Create a `.env` file in the project root and assign environment variables:
```
API_BALLEILO_KEY=YOUR_API_BALLEILO_KEY // secret key used for dashboard and API authorization
API_SPORTS_KEY=YOUR_API_SPORTS_KEY // API key from api-sports.io
BACKEND_PORT=8080 // backend API port
MONGO_DB_CONNECTION=mongodb://localhost:27017/YOUR_DB_NAME // mongo DB connection string
TELEGRAM_BOT_API_TOKEN=YOUR_TOKEN // telegram bot token that sends messages to channels
```

### Working with migrations

How to create a migration:
```
./node_modules/.bin/migrate-mongo create YOUR_MIGRATION_NAME
```

How to run **ALL UNAPPLIED** migrations:
```
./node_modules/.bin/migrate-mongo up
```

How to revert **ONLY THE LAST APPLIED** migration:
```
./node_modules/.bin/migrate-mongo down
```
