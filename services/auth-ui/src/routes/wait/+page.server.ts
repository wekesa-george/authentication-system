


import { config } from '../../lib/server/config.js';

export const load = (async ({url,locals}) => {
  const domain= url.origin;
  let redirect ="";
  
  return { 
    tenancy: locals.tenancy,
    client: locals.client,
    continue:locals.continueTo,
    redirect:locals.domain.otherInfo.redirect_url,
    tenantDomain:locals.domain
};

});

