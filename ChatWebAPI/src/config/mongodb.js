import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
 
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('No Connection')
  return trelloDatabaseInstance
}

export const CLOSED_DB = async () => {
  await mongoClientInstance.close()
}