import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import { signUpEmailSchema,signUpTelnoSchema } from '../../../schemas/sign-up.schema';
import { config } from '../../../lib/server/config';

export const load = async ({ url, params }) => {
  const form= await superValidate( zod(signUpEmailSchema));
  const form_telno = await superValidate( zod(signUpTelnoSchema));
  return { form,form_telno };
};




export const actions = {
	signUp: async ({request,url,cookies, locals}) => {
		const form = await superValidate(request, zod(signUpEmailSchema))
		if (!form.valid) {
			return fail(400, {
				form
			})
		}

    const {fullname, email} = form.data;

	   
        try {
			
	  let signUpDetails = {
					firstName:fullname.split(' ')[0],
					lastName:fullname.split(' ')[1],
                    defaultTenantId: locals.tenancy.id,
					email:email.toLowerCase().trim(),
					clientId:locals.client.clientId
				};
				
		  const r = await fetch(`${config.AUTH_API}/auth/sign-up/create-token`,{
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				email:email.toLowerCase().trim()
			})
		  });
		  if(!r.ok){
			const response = await r.json();
			console.log(response);
			throw new Error(response.error.statusCode==409?response.error.message:'An Error Occurred');
		  }
		  const {code} = await r.json();

		  const resp = await fetch(`${config.AUTH_API}/auth/sign-up/create-user`,{
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${code}`
				},
				method:"POST",
				body:JSON.stringify(signUpDetails)
			  });

			  if(!resp.ok){
					const response = await resp.json();
					
					throw new Error(response.error.statusCode==409?response.error.message:'An Error Occurred');
			  }

			  const respons =  await resp.json();

			  cookies.set("token",respons.activation_token,{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})

			cookies.set("code",code,{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})
			cookies.set("type",'signup',{
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

		
	},
	signUpPhone: async ({request,url,cookies, locals}) => {

		const form = await superValidate(request, zod(signUpTelnoSchema))
		const {fullname, telno} = form.data;

		if (!form.valid) {
			return fail(400, {
				form
			})
		}
		console.log(2);

   

	   
        try {
			console.log(3);
	  let signUpDetails = {
					firstName:fullname.split(' ')[0],
					lastName:fullname.split(' ')[1],
                    defaultTenantId: locals.tenancy.id,
					telno:telno.toLowerCase().trim(),
					clientId:locals.client.clientId
				};
				console.log(4);	
		  const r = await fetch(`${config.AUTH_API}/auth/sign-up/create-token`,{
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				email:telno.toLowerCase().trim()+'@telias.tel'
			})
		  });
		  console.log(5);
		  if(!r.ok){
			const response = await r.json();
			console.log(response);
			throw new Error(response.error.statusCode==409?response.error.message:'An Error Occurred');
		  }
		  const {code} = await r.json();
		  console.log(6);
		  const resp = await fetch(`${config.AUTH_API}/auth/sign-up/create-user-mobile`,{
				headers:{
					"Content-Type":"application/json",
					"Authorization":`Bearer ${code}`
				},
				method:"POST",
				body:JSON.stringify(signUpDetails)
			  });

			  if(!resp.ok){
					const response = await resp.json();
					
					throw new Error(response.error.statusCode==409?response.error.message:'An Error Occurred');
			  }
			  console.log(7);
			  const respons =  await resp.json();

			  cookies.set("token",respons.activation_token,{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})

			cookies.set("code",code,{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})
			cookies.set("type",'signup',{
				httpOnly:true,
				path:"/",
				secure:true,
				sameSite:'lax'
			})
			console.log(8);
          return {
          form,
          tokenResp:respons
          }
        
          } catch (e: any) {
            console.log(e);
            return fail(
              400,{
                form,
                error:e.message=="Failed to authenticate."?"Invalid email or password":e.message,
                status: e.status
              });
          }

		
	}
}