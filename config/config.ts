// import dotenv from 'dotenv';

// dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const App_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// console.log("link", App_URL, PORT, DATABASE_URL);