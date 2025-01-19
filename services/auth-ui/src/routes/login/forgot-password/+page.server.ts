import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import { email,telno } from '../../../schemas/forgot-password.schema';

import { config } from '../../../lib/server/config';


export const load = async ({ url, params }) => {
  const form= await superValidate( zod(email));
  const form_telno = await superValidate( zod(telno));
  return { form,form_telno };
};

export const actions = {
	forgotPwdEmail: async ({request,url,cookies, locals}) => {
    
		const form = await superValidate(request, zod(email))
		if (!form.valid) {
			return fail(400, {
				form
			})
		}

    const f = form.data;

	   
        try {
			
	  let forgotPasswaord = {
					username:f.email,
					client_id:locals.client.clientId,
                    client_secret:locals.client.clientSecret
				};
				
		  const r = await fetch(`${config.AUTH_API}/auth/forget-password`,{
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify(forgotPasswaord)
		  });
		  console.log(r);

		  if(!r.ok){

			const resp = await r.json();

			throw new Error(resp.error.statusCode==409?resp.error.message:'An Error Occurred');
		  }
		  

			const respons =  await r.json();
			cookies.set("code",respons.code,{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})
			cookies.set("token",respons.activation_token,{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})
			cookies.set("type","forgot",{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})
			  
       return {
          form,
          tokenResp:respons
        }
        
          } catch (e: any) {
            
            return fail(
              400,{
                form,
                error:e.message=="Failed to authenticate."?"Invalid email or password":e.message,
                status: e.status
              });
          }

		
	}
}