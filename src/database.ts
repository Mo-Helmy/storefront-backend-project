import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV
} = process.env

const database = ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB

const clint = new Pool({
  host: POSTGRES_HOST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database
})

export default clint
