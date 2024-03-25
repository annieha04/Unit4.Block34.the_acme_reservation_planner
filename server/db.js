//  (this will be your data layer)
const pg = require('pg');
const uuid = require('uuid');
const client = new pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner'
);

    const initTables = async () => {
        await client.connect()
        console.log('connected to database');
        let SQL = /* sql */ `
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        DROP TABLE IF EXISTS reservations;
    
        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL
        );
        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            travel_date TIMESTAMP NOT NULL DEFAULT now(),
            customer_id UUID REFERENCES customer(id) NOT NULL,
            restaurant_id UUID REFERENCES restaurant(id) NOT NULL
        );
        `
        await client.query(SQL);
    }

const createCustomer = async (name) => {
    const SQL = /*SQL*/ `INSERT INTO users(id, name) VALUES($1, $2) RETURNING *`;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows[0];
}

const createRestaurant = async (name) => {
    const SQL = /* sql */ `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows[0];
}

const createReservation = async ({restaurant_id, customer_id, travel_date}) => {
    const SQL = /*SQL*/ `
      INSERT INTO vacations(id, restaurant_id, customer_id, travel_date) VALUES($1, $2, $3, $4) RETURNING *;
    `;
    const { rows } = await client.query(SQL, [uuid.v4(), restaurant_id, customer_id, travel_date]);
    return rows;
  }

  const fetchCustomers = async () => {
    const SQL = /*SQL*/ `SELECT * from customers`
    const { rows } = await client.query(SQL);
    return rows;
  }
  const fetchRestaurants = async () => {
    const SQL = /*SQL*/ `SELECT * from restaurants`
    const { rows } = await client.query(SQL);
    return rows;
  }
  const fetchReservations = async () => {
    const SQL = /*SQL*/ `SELECT * from reservations`
    const { rows } = await client.query(SQL);
    return rows;
  }
  
  const destroyReservation =  async ({id, customer_id}) => { 
    const SQL = /*SQL*/ `DELETE FROM reservations WHERE id=$1 AND user_id=$2 RETURNING *`
    await client.query(SQL, [id, customer_id])
  }

const seed = async () => {
    await Promise.all([
        createCustomer({name: 'Lauren'}),
        createCustomer({name: 'Bob'}),
        createCustomer({name: 'Kim'}),
        createCustomer({name: 'Michelle'}),
        createRestaurant({name: 'Red Lobster'}),
        createRestaurant({name: 'Olive Garden'}),
        createRestaurant({name: 'KazuNori'}),
        createRestaurant({name: 'Cote'}),
    ]);

    console.log('Customers created: ', await fetchCustomers());
    const customer = await fetchCustomers();
    console.log('Restaurants created: ', await fetchRestaurants());
    const restaurant = await fetchCustomers();

    await Promise.all([
        createReservation({
            customer_id: users[0].id,
            restaurant_id: places[3].id,
            travel_date: '03/22/24'
        }),
        createReservation({
            customer_id: users[1].id,
            restaurant_id: places[2].id,
            travel_date: '03/23/24'
        }),
        createReservation({
            customer_id: users[2].id,
            restaurant_id: places[1].id,
            travel_date: '03/24/24'
        }),
        createReservation({
            customer_id: users[3].id,
            restaurant_id: places[0].id,
            travel_date: '06/12/24'
        }),
      ])
      console.log("Reservations created: ", await fetchReservations())
    }

module.exports = {
    client,
    initTables,
    createCustomer,
    createReservation,
    createRestaurant,
    fetchCustomers,
    fetchReservations,
    fetchRestaurants,
    destroyReservation,
    seed
}