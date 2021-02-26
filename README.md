# Balleilo

## Sports Media CMS

### Project environment variables

Create a `.env` file in the project root and assign environment variables:
```
MONGO_DB_CONNECTION=mongodb://localhost:27017/YOUR_DB_NAME // mongo DB connection string
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
