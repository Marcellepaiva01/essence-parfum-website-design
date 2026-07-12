import { supabase } from './supabase';

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { session: null, error: error.message };
  return { session: data.session, error: null };
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (isLoggedIn: boolean) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  return () => subscription.unsubscribe();
}

export async function isAdminUser(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error) return false;
  return data?.role === 'admin';
}

export async function uploadFragranceImage(file: File, fragranceId: string): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${fragranceId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('fragrance-images')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { data } = supabase.storage.from('fragrance-images').getPublicUrl(path);
  return data.publicUrl;
}
