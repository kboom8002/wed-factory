import { createClient } from '@/core/utils/supabase/server';
import ClientDealroom from './ClientDealroom';

export const metadata = {
  title: 'Admin Dealroom - Vendor Envelope Pipeline'
};

export default async function DealroomPage() {
  const supabase = await createClient();

  // 1. Fetch pending & matched BrideGroomEnvelopes
  const { data: envelopes } = await supabase
    .from('bride_groom_envelope')
    .select('*')
    .neq('status', 'closed') // open for proposals
    .order('created_at', { ascending: false });

  // 2. Fetch brands for assigning proposal
  const { data: brands } = await supabase
    .from('brand_registry')
    .select('id, brand_name, vertical_type')
    .order('vertical_type', { ascending: true });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">B2B Dealroom (역제안소)</h1>
        <p className="text-gray-500 font-medium">
          고객이 제출한 핏 브리프(요청서) 목록입니다. 각 요청서 조건에 맞춰 <strong className="text-blue-600">Vendor Envelope(역제안 견적)</strong>를 발송하세요.
          고객은 개별 My-Space 매직링크에서 해당 제안들을 비교하고 최종 확정(Deal)할 수 있습니다.
        </p>
      </div>
      
      <ClientDealroom 
        initialEnvelopes={envelopes || []} 
        brands={brands || []} 
      />
    </div>
  );
}
