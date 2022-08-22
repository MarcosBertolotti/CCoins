import { Environment } from "src/app/models/environment.model";

export const environment: Environment = {
  production: false,
  PWA_URL: '$PWA_URL',
  API_URL: '$API_URL',
  AUTH_GOOGLE_CLIENT_ID: '$AUTH_GOOGLE_CLIENT_ID',
  AUTH_FACEBOOK_APPLICATION_ID: '$AUTH_FACEBOOK_APPLICATION_ID',
}