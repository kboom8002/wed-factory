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

  let allBriefs: any[] = [];

  // 3. Fetch Envelopes targeted at these combinations, AND any existing proposals made by THIS brand
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
        client_name,
        combination_type!inner ( title ),
        deal_proposals ( proposal_id, status, proposed_price )
      `)
      .in('combination_id', comboIds)
      .eq('deal_proposals.brand_id', context.id) // Only bring in proposals from THIS brand
      .order('created_at', { ascending: false });

    allBriefs = (envelopes || []).map((e: any) => {
      // Find the specific proposal from this brand (if it exists)
      const myProposal = e.deal_proposals && e.deal_proposals.length > 0 ? e.deal_proposals[0] : null;

      // Determine the CRM tab state based on our proposal status, or if we haven't proposed yet
      let crm_status = 'inbox'; // default
      if (myProposal) {
        if (myProposal.status === 'pending') crm_status = 'sent';
        if (myProposal.status === 'accepted') crm_status = 'won';
        if (myProposal.status === 'rejected' || myProposal.status === 'cancelled' || myProposal.status === 'refunded') crm_status = 'lost';
      }

      return {
        envelope_id: e.envelope_id,
        user_id: e.user_id,
        client_name: e.client_name,
        combination_id: e.combination_id,
        schedule_window: e.schedule_window,
        budget_band: e.budget_band,
        requirements: e.requirements,
        envelope_status: e.status, // requested, proposed, closed, rejected
        crm_status, // inbox, sent, won, lost
        created_at: e.created_at,
        combination_title: e.combination_type?.title,
        proposal: myProposal
      };
    });
  }

  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto min-h-screen">
       <DealBoard 
          brandId={context.id} 
          allBriefs={allBriefs} 
       />
    </div>
  );
}
