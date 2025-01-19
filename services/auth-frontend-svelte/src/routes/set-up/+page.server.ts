import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import { configSchema } from '../../schemas/configs.schema';
import { countries } from '../../utils/countries';
import { timezones } from '../../utils/timezones';
import { currencies } from '../../utils/currencies';

export const load = async ({ url, params }) => {
  const form = await superValidate( zod(configSchema));
  return { form , countries,timezones,currencies};
};