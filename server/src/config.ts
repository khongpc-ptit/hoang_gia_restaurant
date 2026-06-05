import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  config({
    path: '.env'
  })

  if (!fs.existsSync(path.resolve('.env'))) {
    console.log('Không tìm thấy file môi trường .env')
    process.exit(1)
  }
}

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  GUEST_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  GUEST_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  INITIAL_EMAIL_OWNER: z.string(),
  INITIAL_PASSWORD_OWNER: z.string(),
  DOMAIN: z.string(),
  PROTOCOL: z.string(),
  UPLOAD_FOLDER: z.string(),
  HOST: z.string().default('0.0.0.0'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  PUBLIC_API_URL: z.string().optional(),
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}
const envConfig = configServer.data
export const API_URL = envConfig.PUBLIC_API_URL || `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof configSchema> {}
  }
}
