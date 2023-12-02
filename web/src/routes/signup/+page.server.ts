import { API_HOST } from '$env/static/private';
import type { RequestEvent } from './$types.js';

/** @type {import('./$types').Actions} */
export const actions = {
  signup: async ({ request, fetch }: RequestEvent) => {
    const data = await request.formData();
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await fetch(`${API_HOST || 'http://localhost:3000'}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const r = await response.json();
      return r;
    } catch (e) {
      console.error(e);
    }
  }
};