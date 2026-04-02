import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// The 'stays' table may not be in auto-generated types yet.
// Using 'any' typed client for stays operations.
const staysClient = supabase as any;

type Stay = {
  id: string;
  slug: string;
  title: string;
  headline?: string;
  summary?: string;
  description?: string;
  best_for?: string;
  amenities?: string[];
  highlights?: string[];
  faqs?: { q: string; a: string }[];
  rules?: Record<string, string>;
  price_text?: string;
  status?: string;
  inventory_type?: string;
  inventory_total?: number;
  inventory_available?: number;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
};

type StayUpdate = Partial<Stay>;

export function useStays() {
  return useQuery({
    queryKey: ['stays'],
    queryFn: async () => {
      const { data, error } = await staysClient
        .from('stays')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Stay[];
    },
  });
}

export function useStay(slug: string) {
  return useQuery({
    queryKey: ['stay', slug],
    queryFn: async () => {
      const { data, error } = await staysClient
        .from('stays')
        .select('*')
        .eq('slug', slug)
        .eq('is_visible', true)
        .single();
      
      if (error) throw error;
      return data as Stay;
    },
    enabled: !!slug,
  });
}

export function useAllStays() {
  return useQuery({
    queryKey: ['allStays'],
    queryFn: async () => {
      const { data, error } = await staysClient
        .from('stays')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Stay[];
    },
  });
}

export function useUpdateStay() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: StayUpdate }) => {
      const { data, error } = await staysClient
        .from('stays')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['allStays'] });
    },
  });
}
