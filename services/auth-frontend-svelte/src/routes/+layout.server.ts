




export const load = (async ({locals}) => {
  
  return { 
    tenancy: locals.tenancy,
    client: locals.client,
    continue:locals.continueTo,
    redirect:locals.domain.otherInfo.redirect_url,
    tenantDomain:locals.domain,
    config:locals.config
};
});

