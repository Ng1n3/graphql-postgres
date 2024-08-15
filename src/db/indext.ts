import { PrismaClient } from "@prisma/client"

export const getMyPrismaCLient = async (): Promise<PrismaClient> => {
  const client = new PrismaClient({log: ['error', 'info', 'query', 'warn']});
  return client
}