import { createClient } from '@/core/utils/supabase/server';
import { PoliciesBoard } from './_components/PoliciesBoard';

export default async function VendorPoliciesPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>
}) {
  const { brandSlug } = await params;
  const supabase = await createClient();

  // 1. Fetch Brand Context
  const { data: brand } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name_ko')
    .eq('brand_slug', brandSlug)
    .single();

  if (!brand) return <div className="p-8 font-bold">Brand Context NotFound</div>;

  // 2. Fetch Policies
  const { data: policies } = await supabase
    .from('policy_item')
    .select('*')
    .eq('brand_id', brand.brand_id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
       <PoliciesBoard 
         brandId={brand.brand_id} 
         brandSlug={brandSlug} 
         initialPolicies={policies || []} 
       />
    </div>
  );
}
