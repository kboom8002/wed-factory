import { createClient } from '@/core/utils/supabase/server';
import { AnswersBoard } from './_components/AnswersBoard';

export default async function VendorAnswersPage({
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

  if (!brand) return <div>Brand NotFound</div>;

  // 2. Fetch AnswerCards
  const { data: answers } = await supabase
    .from('answer_card')
    .select('*')
    .eq('brand_id', brand.brand_id)
    .order('updated_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
       <AnswersBoard 
         brandId={brand.brand_id} 
         brandSlug={brandSlug} 
         initialAnswers={answers || []} 
       />
    </div>
  );
}
