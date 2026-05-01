import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const client = supabase as any;

export type StayImage = {
  id: string;
  stay_id: string;
  url: string;
  alt: string;
  position: number;
  focal_x: number;
  focal_y: number;
  created_at: string;
};

/** Fetch all images for a specific stay, ordered by position */
export function useStayImages(stayId: string | undefined) {
  return useQuery({
    queryKey: ['stayImages', stayId],
    queryFn: async () => {
      const { data, error } = await client
        .from('stay_images')
        .select('*')
        .eq('stay_id', stayId)
        .order('position', { ascending: true });
      if (error) throw error;
      return data as StayImage[];
    },
    enabled: !!stayId,
  });
}

/** Fetch the first image for each stay (for thumbnails) */
export function useAllStayThumbnails() {
  return useQuery({
    queryKey: ['stayThumbnails'],
    queryFn: async () => {
      // Fetch all images ordered by position, then deduplicate to first per stay
      const { data, error } = await client
        .from('stay_images')
        .select('*')
        .order('position', { ascending: true });
      if (error) throw error;
      
      const images = data as StayImage[];
      const thumbnailMap: Record<string, StayImage> = {};
      for (const img of images) {
        if (!thumbnailMap[img.stay_id]) {
          thumbnailMap[img.stay_id] = img;
        }
      }
      return thumbnailMap;
    },
  });
}

/** Fetch all images grouped by stay_id */
export function useAllStayImages() {
  return useQuery({
    queryKey: ['allStayImages'],
    queryFn: async () => {
      const { data, error } = await client
        .from('stay_images')
        .select('*')
        .order('position', { ascending: true });
      if (error) throw error;

      const images = data as StayImage[];
      const grouped: Record<string, StayImage[]> = {};
      for (const img of images) {
        if (!grouped[img.stay_id]) grouped[img.stay_id] = [];
        grouped[img.stay_id].push(img);
      }
      return grouped;
    },
  });
}

/** Upload an image to storage + insert a DB row */
export function useUploadStayImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stayId,
      file,
      alt,
      position,
    }: {
      stayId: string;
      file: File;
      alt: string;
      position: number;
    }) => {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${stayId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('stay-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('stay-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Insert DB row
      const { data, error } = await client
        .from('stay_images')
        .insert({
          stay_id: stayId,
          url: publicUrl,
          alt,
          position,
        })
        .select()
        .single();

      if (error) throw error;
      return data as StayImage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stayImages', variables.stayId] });
      queryClient.invalidateQueries({ queryKey: ['stayThumbnails'] });
      queryClient.invalidateQueries({ queryKey: ['allStayImages'] });
    },
  });
}

/** Delete an image from storage + DB */
export function useDeleteStayImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ image }: { image: StayImage }) => {
      // Extract storage path from the full URL
      // URL format: https://xxx.supabase.co/storage/v1/object/public/stay-images/path
      const urlParts = image.url.split('/storage/v1/object/public/stay-images/');
      if (urlParts.length === 2) {
        const storagePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from('stay-images').remove([storagePath]);
      }

      // Delete DB row
      const { error } = await client
        .from('stay_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stayImages'] });
      queryClient.invalidateQueries({ queryKey: ['stayThumbnails'] });
      queryClient.invalidateQueries({ queryKey: ['allStayImages'] });
    },
  });
}

/** Batch reorder images — updates position for each image */
export function useReorderStayImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stayId,
      orderedIds,
    }: {
      stayId: string;
      orderedIds: string[];
    }) => {
      // Update each image's position
      const updates = orderedIds.map((id, index) =>
        client
          .from('stay_images')
          .update({ position: index })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      const firstError = results.find((r: any) => r.error);
      if (firstError?.error) throw firstError.error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stayImages', variables.stayId] });
      queryClient.invalidateQueries({ queryKey: ['stayThumbnails'] });
      queryClient.invalidateQueries({ queryKey: ['allStayImages'] });
    },
  });
}

/** Update an image's alt text or focal point */
export function useUpdateStayImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<StayImage, 'alt' | 'focal_x' | 'focal_y'>>;
    }) => {
      const { data, error } = await client
        .from('stay_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as StayImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stayImages'] });
      queryClient.invalidateQueries({ queryKey: ['stayThumbnails'] });
      queryClient.invalidateQueries({ queryKey: ['allStayImages'] });
    },
  });
}
