import { config } from "dotenv";
import { subDays } from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { categories, accounts, transactions } from "@/db/schema";

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = 'user_2ufGeg2JTl8RWYtozJ5a5GoRXtv'

//TODO: DO IT SOON for SEED