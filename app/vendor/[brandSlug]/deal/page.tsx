import { notFound } from 'next/navigation';
import { createClient } from '@/core/utils/supabase/server';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { DealBoard } from './_components/DealBoard';

export const revalidate = 0; // Ensures fresh envelopes are always fetched

export default async function VendorDealroomPage({
  params
}: {
  params: Promise<{ brandSlug: string }>
}) {
  const { brandSlug } = await params;
  
  // 1. Resolve basic brand context (we assume vertical is "studio" for this MVP routing)
  const context = await resolveBrandContext(brandSlug, 'studio' as VerticalType);
  
  if (!context) {
    notFound();
  }

  const supabase = await createClient();

  // 2. Fetch all combinations for this brand
  const { data: combinations } = await supabase
    .from('combination_type')
    .select('combination_id')
    .eq('brand_id', context.id);

  const comboIds = (combinations || []).map(c => c.combination_id);

  let pendingBriefs: any[] = [];

  // 3. Fetch Envelopes targeted at these combinations
  if (comboIds.length > 0) {
    const { data: envelopes } = await supabase
      .from('bride_groom_envelope')
      .select(`
        envelope_id,
        user_id,
        combination_id,
        schedule_window,
        budget_band,
        requirements,
        status,
        created_at,
        combination_type!inner ( title )
      `)
      .in('combination_id', comboIds)
      .eq('status', 'requested')
      .order('created_at', { ascending: false });

    // Map the shape
    pendingBriefs = (envelopes || []).map((e: any) => ({
      envelope_id: e.envelope_id,
      user_id: e.user_id,
      combination_id: e.combination_id,
      schedule_window: e.schedule_window,
      budget_band: e.budget_band,
      requirements: e.requirements,
      status: e.status,
      created_at: e.created_at,
      combination_title: e.combination_type?.title
    }));
  }

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto min-h-screen">
       <DealBoard 
          brandId={context.id} 
          pendingBriefs={pendingBriefs} 
       />
    </div>
  );
}
