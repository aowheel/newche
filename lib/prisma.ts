import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const runtime = "edge";
const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
