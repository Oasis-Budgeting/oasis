export default {
    client: 'sqlite3',
    connection: {
        filename: process.env.DB_PATH || './data/budget.db'
    },
    useNullAsDefault: true,
    pool: {
        afterCreate: (conn, cb) => {
            conn.run('PRAGMA foreign_keys = ON', cb);
        }
    },
    migrations: {
        directory: './src/db/migrations'
    },
    seeds: {
        directory: './src/db/seeds'
    }
};
