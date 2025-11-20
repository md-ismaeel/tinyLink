// config/config.ts

export const PORT = process.env.PORT || 3000;
export const DATABASE_URI = process.env.DATABASE_URL || '';

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const App_URL = rawAppUrl.replace(/\/$/, '');

// console.log("link", App_URL, PORT, DATABASE_URI);