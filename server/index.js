// (will be your express application and setup functions, we called this init in guided practice)

require('dotenv').config()
const express = require('express');
const client = new pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner'
);
const app = express();
app.use(express.json());

const init = async () => {
    await client.connect();
    console.log('db connected ')
    await initTables();
    console.log('tables created')
    await seed();
    console.log('data seeded')

    app.listen(process.env.PORT, () => {
        app.listen(port, () => console.log(`listening on port ${port}`));
    });
};

    app.use((err, req, res, next) => {
        res.status(500).send(err.message);
    })

    init();