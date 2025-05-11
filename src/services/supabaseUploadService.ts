import { supabase } from '../lib/supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param pathPrefix - The folder path (e.g., company_id, user_id)
 * @param fileName - Optional custom file name (default: timestamp + extension)
 * @returns The public URL of the uploaded file
 */
export async function uploadToSupabaseStorage(
  file: File,
  bucket: string,
  pathPrefix: string,
  fileName?: string
): Promise<string> {
  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error('Authentication error');
  if (!session) throw new Error('No active session');

  // Generate file name if not provided
  const ext = file.name.split('.').pop();
  const name = fileName || `${Date.now()}.${ext}`;
  const filePath = `${pathPrefix}/${name}`;

  // Upload
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!publicUrl) throw new Error('Failed to get public URL');
  return publicUrl;
}
