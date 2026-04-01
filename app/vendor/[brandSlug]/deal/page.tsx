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

  // 2. Fetch Envelopes targeted at this brand
  const { data: envelopes } = await supabase
    .from('bride_groom_envelope')
    .select(`
      envelope_id,
      user_id,
      target_combination_id,
      target_brand_id,
      schedule_window,
      budget_band,
      priority_tags,
      legal_names,
      status,
      created_at,
      combination_type ( title ),
      deal_proposals ( proposal_id, status, proposed_price )
    `)
    .eq('target_brand_id', context.id)
    .order('created_at', { ascending: false });

  let allBriefs: any[] = [];
  
  if (envelopes) {
    allBriefs = envelopes.map((e: any) => {
      // Find the specific proposal from this brand (if it exists)
      const myProposal = e.deal_proposals && e.deal_proposals.length > 0 ? e.deal_proposals[0] : null;

      // Determine the CRM tab state based on our proposal status, or if we haven't proposed yet
      let tab = 'inbox';
      if (myProposal) {
        if (myProposal.status === 'sent') tab = 'sent';
        if (myProposal.status === 'won') tab = 'won';
        if (myProposal.status === 'lost') tab = 'lost';
      }

      return {
        envelope_id: e.envelope_id,
        user_id: e.user_id,
        client_name: e.legal_names || '익명 고객',
        combination_id: e.target_combination_id,
        schedule_window: e.schedule_window,
        budget_band: e.budget_band,
        requirements: (e.priority_tags || []).join(', '),
        envelope_status: e.status, 
        crm_status: tab, 
        created_at: e.created_at,
        combination_title: e.combination_type?.title || '브랜드 통합 의뢰서 (Generic)',
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
