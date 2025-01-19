import { superValidate, message, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { activationSchema } from '../../../schemas/activation.schema';
import { config } from '../../../lib/server/config';

export const load = async ({ url, params }) => {
  const form= await superValidate( zod(activationSchema));
  return { form };
};

export const actions = {
  
	activateAccount: async ({request, url, cookies,locals}) => {
		const form = await superValidate(request, zod(activationSchema))
		if (!form.valid) {
			return fail(400, {
				form
			})
		}
    
    const {token} = form.data;
   let activation_code = cookies.get('token');
   let auth = cookies.get('code');
   let type = cookies.get('type');

        try {
             
	  let activationDetails = {
         
          "tenancyId": locals.tenancy.id,
          "client_id": locals.client.clientId,
          "client_secret": locals.client.clientSecret,
          token,
          activation_code
				};

        let resp :any;
       
if(type=='forgot'){
   resp = await fetch(`${config.AUTH_API}/auth/forget-password/verify-token-email`,{
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${auth}` 
    },
    method:"POST",
    body:JSON.stringify(activationDetails)
    });
}else{
   resp = await fetch(`${config.AUTH_API}/auth/sign-up/verify-token-email`,{
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${auth}` 
    },
    method:"POST",
    body:JSON.stringify(activationDetails)
    });
}
		  

			  if(!resp.ok){
					const response = await resp.json();
          console.log(response.error);
					throw new Error(response.error.statusCode==409?response.error.message:'An Error Occurred');
			  }

			  const respons =  await resp.json();
			  cookies.set("token",respons.password_token,{
          httpOnly:true,
          path:"/",
          secure:true,
          sameSite:'lax'
        })
        cookies.set("code_pwd",respons.token,{
          httpOnly:true,
          path:"/",
          secure:true,
          sameSite:'lax'
        })


        console.log(respons);
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