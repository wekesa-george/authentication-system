
import { InfisicalSDK } from '@infisical/sdk';
const client = new InfisicalSDK({
  // @ts-ignore
  siteUrl: import.meta.env.VITE_INFISICAL_DOMAIN
});

async function getSecrets() {
  await client.auth().universalAuth.login({
    // @ts-ignore
    clientId: import.meta.env.VITE_INFISICAL_CLIENT_ID,
    // @ts-ignore
    clientSecret: import.meta.env.VITE_INFISICAL_CLIENT_SECRET
    
  });

  const allSecrets = await client.secrets().listSecrets({
    // @ts-ignore
    environment: 'dev',
    // @ts-ignore
    projectId: import.meta.env.VITE_PROJECT_ID,
  
    // @ts-ignore
    secretPath: "/auth-ui",
  });


  return allSecrets;
}

// @ts-ignore
function convertToSecretObject(secrets) {
  // @ts-ignore
  return secrets.reduce((acc, secret) => {
    acc[secret.secretKey] = secret.secretValue;
    return acc;
  }, {});
}

// Use top-level await to ensure code runs in order
const ret = await getSecrets();
const newSecrets = convertToSecretObject(ret.secrets);

const config = {
  AUTH_API:newSecrets.PRIVATE_AUTH_API,
  ADMIN_API: newSecrets.PRIVATE_ADMIN_API,
  PB_URL: newSecrets.PRIVATE_PB_URL,
  MAPS_API_KEY: newSecrets.PRIVATE_MAPS_API_KEY,
  PB_USER: newSecrets.PRIVATE_PB_USER,
  PB_USER_PWD: newSecrets.PRIVATE_PB_PASSWORD,
  REDIRECT: newSecrets.PRIVATE_REDIRECT,
  CONSOLE_API: newSecrets.PRIVATE_CONSOLE_API,
};

// Export the config after newSecrets is set
export { config };
