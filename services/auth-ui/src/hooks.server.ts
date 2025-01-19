import { redirect, type Handle } from "@sveltejs/kit";
import { config } from "./lib/server/config";
import { configKeys } from "./utils/enums";
import { authenticateUser } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  let url = event.url;
  let locals = event.locals;
  const domain = url.origin;

 
  const continueTo = url.searchParams.get('continueTo') || '';
  const xvc = event.cookies.get('xvc');

  const response2 = await fetch(`${config.CONSOLE_API}/tenant-domains?filter=${encodeURIComponent(JSON.stringify({
    where: {
      domain
    }
  }))}`);

  const tenantDomain = await response2.json();

  const fetchTenancy = async () => {
    const response = await fetch(`${config.CONSOLE_API}/tenants/${tenantDomain[0].tenantId}`);
    const data = await response.json();
    return data;
  };

  const fetchClient = async () => {
    const response = await fetch(`${config.CONSOLE_API}/auth-clients?filter=${encodeURIComponent(JSON.stringify({
      where: {
        clientId: tenantDomain[0].otherInfo.clientId
      }
    }))}`);
    const data = await response.json();
    return data[0];
  };

  const fetchCfg = async () => {
    const response = await fetch(`${config.CONSOLE_API}/tenant-configs?filter=${encodeURIComponent(JSON.stringify({
      where: {
        tenantId: tenantDomain[0].tenantId,
        configKey: configKeys.Profile
      }
    }))}`);
    const data = await response.json();
    return data[0];
  };

  locals.tenancy = await fetchTenancy();
  locals.client = await fetchClient();
  locals.config = await fetchCfg();
  locals.continueTo = continueTo;
  locals.domain = tenantDomain[0];
  locals.configEnv = config;

  if (event.url.pathname.startsWith("/logout")) {
    // Delete all cookies
    const allCookies = event.cookies.getAll();

    for (const cookie of allCookies) {
      event.cookies.delete(cookie.name, { path: '/' });
    }

    // Optionally, redirect to the login page or home page after logout
    throw redirect(303, '/');
  }

  let user = await authenticateUser(event);

  if (user) {
    throw redirect(303, `${locals.domain.otherInfo.redirect_url}?access=${encodeURIComponent(event.cookies.get('slat') || '')}&refresh=${encodeURIComponent(event.cookies.get('slrt') || '')}&tenant=${locals.tenancy.id}&xvc=${xvc}`);
  }

  const response = await resolve(event);
  return response;
};



