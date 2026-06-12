import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

function readAdminFlag(session: Session | null): boolean {
  const value = session?.user?.app_metadata?.is_admin;

  return value === true || value === 'true';
}

export function isAdminSession(session: Session | null): boolean {
  return readAdminFlag(session);
}

export async function signInAsAdmin(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  if (!readAdminFlag(data.session)) {
    await supabase.auth.signOut();
    throw new Error('Sua conta nao possui permissao de administrador.');
  }
}

export async function getValidatedAdminSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return readAdminFlag(data.session) ? data.session : null;
}
