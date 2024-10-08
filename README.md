# Brusnika CRM backend

Client management system backend.

# Configuration

By default will look for `./.env`. Environment variable examples located in [.env.example](./.env.example).
To configure firebase replace [firebase.json](./firebase.json).
To configure postgresql certificate replace [postgresql.pem](./postgresql.pem).

# Deployments

The project uses Node.js version 22.3.0 or above and npm version 10.8.1 or above.

Install dependencies:

```shell
npm i
```

Build project:

```shell
npm run build
```

## Production Deployments

Run project:

```shell
npm run start:prod
```


## Staging Deployments

Run project:

```shell
npm run start:dev
```

# Database

The project uses a PostgreSQL 16.3 database.

To insert fake data into the database:

```shell
npm run seed:up
```

To delete all data from the database:

```shell
npm run seed:down
```

# Message queue

The project uses a RabbitMQ message queue.
