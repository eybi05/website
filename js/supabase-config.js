// Replace these two values with your Supabase project credentials
// Dashboard → Settings → API
const SUPABASE_URL = 'https://delqctnwcctoyvakxpxm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbHFjdG53Y2N0b3l2YWt4cHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjQ0MjYsImV4cCI6MjA5NjAwMDQyNn0.O5PobHoFlcpdZmFwPxqt8eCUe5qOot0bBTfspzUhzwQ';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
