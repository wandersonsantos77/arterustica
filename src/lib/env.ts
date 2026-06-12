function getRequiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[name];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`A variavel de ambiente ${name} nao esta configurada.`);
  }

  return value;
}

export const env = {
  supabaseUrl: getRequiredEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('VITE_SUPABASE_ANON_KEY'),
} as const;
