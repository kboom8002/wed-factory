import { createClient } from '@/core/utils/supabase/server';
import ClientInbox from './ClientInbox';

export const metadata = {
  title: 'Admin Inbox - Zero Result Queue'
};

export default async function InboxPage() {
  const supabase = await createClient();

  // 1. Fetch pending zero result queries
  const { data: pendingQueries } = await supabase
    .from('zero_result_query')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  // 2. Fetch all registered brands for assignment
  const { data: brands } = await supabase
    .from('brand_registry')
    .select('id, brand_name, vertical_type')
    .order('vertical_type', { ascending: true });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Inbox & Zero-Result Backlog</h1>
        <p className="text-gray-500 font-medium">
          고객이 통합 검색에서 원하시는 답변을 찾지 못해 제보한 "Zero-Result" 큐입니다. <br/>
          즉석에서 답변을 작성(L0 Publish)하여 해당 브랜드의 영구 SSoT 자산으로 환전시킬 수 있습니다.
        </p>
      </div>
      
      <ClientInbox 
        initialQueries={pendingQueries || []} 
        brands={brands || []} 
      />
    </div>
  );
}
