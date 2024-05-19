import Dexie from 'dexie';

// Initialize the Dexie database instance
const db = new Dexie('SportsDatabase');

// Define the database schema
db.version(1).stores({
  matches: '++id,date,points,rebounds,assists,blocks'
});

// Export the database instance
export default db;
