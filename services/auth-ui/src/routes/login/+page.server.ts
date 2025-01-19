import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';

import { loginEmailSchema,loginTelnoSchema } from '../../schemas/login.schema.js';
import { config } from '../../lib/server/config.js';
import { HASH } from '../../utils/hash.js';
export const load = async ({ url, locals }) => {
  const form = await superValidate( zod(loginEmailSchema));
  const form_telno = await superValidate( zod(loginTelnoSchema));
  const domain= url.origin;
      const continueTo = url.searchParams.get('continueTo')||'';
        
  return { form,form_telno,tenant: locals.domain,configEnv:locals.configEnv };
};

export const actions = {
	loginEmail: async ({request, url, cookies,locals}) => {
		const form = await superValidate(request, zod(loginEmailSchema))
		if (!form.valid) {
			return fail(400, {
				form
			})
		}
      
    const {password, email} = form.data;
	   
        try {
           

	let logindetails = {
					password:await HASH(password),
					username:email,
					client_id:locals.client.clientId,
					client_secret: locals.client.clientSecret
				};
      console.log(1);
		  const resp = await fetch(`${config.AUTH_API}/auth/login-new`,{
				headers:{
					"Content-Type":"application/json",
				},
				method:"POST",
				body:JSON.stringify(logindetails)
			  });

			  if(!resp.ok){  
          const response = await resp.json()
          console.log(JSON.stringify(response));
          throw new Error(response.error.statusCode==401?'Invalid email or password':'An Error Occurred');
			  }
        console.log(2);
			  const respons =  await resp.json();
			
			  const tokenRqst = await fetch(`${config.AUTH_API}/auth/token-new`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({
              "code": respons.code,
              "clientId": locals.client.clientId
            })
			  });
        console.log(3);
			  if(!tokenRqst.ok){
          
				    const response = await tokenRqst.json();
            console.log(response.error);
				    throw new Error(response.error.statusCode==401?'Invalid email or password':'An Error Occurred');

			  }
        const tokenResp = await tokenRqst.json();



        let tfaTkn: any;
       
        if(locals.config.configValue.enforce2fa){

          console.log(4);
          const tfaRqstX = await fetch(`${config.AUTH_API}/auth/me`,{
            method:"GET",
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${tokenResp.accessToken}`
            }
        });
            
      if(!tfaRqstX.ok){
              
            const response = await tfaRqstX.json();
            throw new Error(response.error.statusCode==401?'Invalid email or password':'An Error Occurred');

      }

      const vv = await tfaRqstX.json();
      /*
              const tfaRqst = await fetch(`${config.AUTH_API}/auth/send-otp`,{
                      method:"POST",
                      headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${tokenResp.accessToken}`
                      },
                      body:JSON.stringify(
                        {
                          "client_id": locals.client.clientId,
                          "client_secret": locals.client.clientSecret,
                          "user_id": vv.id
                        
                      })
                  });
                      
                if(!tfaRqst.ok){
                        
                      const response = await tfaRqst.json();
                      throw new Error(response.error.statusCode==401?'Invalid email or password':'An Error Occurred');

                }
                 tfaTkn = await tfaRqst.json();*/


        }
        console.log('Hereeeeeexxx');
        console.log(tfaTkn);
      
      cookies.set('slat', tokenResp.accessToken, { 
              secure: false, 
              httpOnly: true, 
              path: '/' 
          });
      cookies.set('slrt', tokenResp.refreshToken, { 
              secure: false, 
              httpOnly: true, 
              path: '/' 
          });
      /*cookies.set('xvc', tfaTkn.key, { 
            secure: false, 
            httpOnly: true, 
            path: '/' 
        });*/

          return {
            form,
            tokenResp,
            tfaTkn
          }
        
          } catch (e: any) {
            
            return fail(
              400,{
                form,
                error:e.message=="Failed to authenticate."?"Invalid email or password":e.message,
                status: e.status
              });
          }
	},
	azure: async ({ locals }) => {
      
        const urlEncodedData = new URLSearchParams({
            client_id:locals.client.clientId,
			      client_secret: locals.client.clientSecret
        });

        try {
            const response = await fetch(`${config.AUTH_API}/auth/azure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData.toString(),
            });
			console.log(response);
            if (!response.ok) {
                const error = await response.text();
                return fail(response.status, { error });
            }

            const result = await response.json();
			
            return { success: true, data: result };
        } catch (error) {
            return fail(500, { error: 'Failed to contact the external API.' });
        }
    }
}