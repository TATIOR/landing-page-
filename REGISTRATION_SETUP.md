## Production registration setup

The registration form at /register writes to Supabase through /api/register.

1. Create a Supabase project.
2. Run supabase/registration.sql in the Supabase SQL Editor.
3. In Vercel, add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as Production environment variables.
4. Redeploy.

Never expose SUPABASE_SERVICE_ROLE_KEY in client-side code or commit it to GitHub.
