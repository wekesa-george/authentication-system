import { superValidate, message, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { newPwdSchema } from '../../../schemas/password.schema';
import { HASH } from '../../../utils/hash';

import { config } from '../../../lib/server/config';

export const load = async ({ url, params,cookies }) => {
   
    const form= await superValidate( zod(newPwdSchema));
	let code = cookies.get('code_pwd');
  return { form,code };
};

export const actions = {

	setNewPassword: async ({request,url,cookies, locals}) => {
		const form = await superValidate(request, zod(newPwdSchema))
		if (!form.valid) {
			return fail(400, {
				form
			})
		}

    const {password} = form.data;
    let password_tkn = cookies.get('token');
	let auth = cookies.get('code');
	let type = cookies.get('type');
	let code = cookies.get('code_pwd');
        try {
			
	  let newPassword = {
					password:await HASH(password),
					passwordToken: password_tkn,
					tenancyId: locals.tenancy.id,
					client_id:locals.client.clientId,
					client_secret: locals.client.clientSecret,
					code
				};
let resp:any;
				if(type=='forgot'){
					 resp = await fetch(`${config.AUTH_API}/auth/reset-password`,{
						headers:{
							"Content-Type":"application/json",
							"Authorization":`Bearer ${auth}`
						},
						method:"PATCH",
						body:JSON.stringify({
							"token": auth,
							"password": newPassword.password,
							"client_id": locals.client.clientId,
							"client_secret": locals.client.clientSecret
						})
					  });
				}else{
					 resp = await fetch(`${config.AUTH_API}/auth/sign-up/confirm-pwd`,{
						headers:{
							"Content-Type":"application/json",
							"Authorization":`Bearer ${auth}`
						},
						method:"POST",
						body:JSON.stringify(newPassword)
					  });
				}
			
		  

			  if(!resp.ok){
					const response = await resp.json();
					console.log(response.error);
					throw new Error(response.error.statusCode==409?response.error.message:'An Error Occurred');
			  }

			//  const respons =  await resp.json();

			
          return {
          form,
          //tokenResp:respons
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