import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });
export const prisma = new PrismaClient({
    adapter,
    // log: ["query", "error", "warn", "info"],
});

// export { prisma };