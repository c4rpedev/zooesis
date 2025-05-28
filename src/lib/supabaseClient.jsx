
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    let supabaseInstance;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file and accessible.");
      
      // Provide a non-functional Supabase client to prevent further errors down the line
      // if the app attempts to use it without being properly configured.
      // This is a defensive measure.
      supabaseInstance = {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
          signUp: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
          signOut: () => Promise.resolve({ error: null }),
          resetPasswordForEmail: () => Promise.resolve({ error: null }),
          updateUser: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
        },
        from: () => ({
          select: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
          insert: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
          update: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
          delete: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
          upsert: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
        }),
        storage: {
          from: () => ({
            upload: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
          }),
        },
        functions: {
          invoke: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
        }
        // Add other Supabase methods here if your app uses them before full init
      };
    } else {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
        global: {
          fetch: (...args) => fetch(...args),
        },
      });
    }

    export const supabase = supabaseInstance;
  