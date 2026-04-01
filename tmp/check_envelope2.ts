import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const contextId = 'bbbb0000-0000-0000-0000-000000000002'; // lumiere-dress brand_id
  const { data: envelopes, error } = await supabase
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
    .eq('target_brand_id', contextId)
    .order('created_at', { ascending: false });

  console.log("ERROR:", JSON.stringify(error, null, 2));
  console.log("DATA LENGTH:", envelopes?.length);
  if(envelopes && envelopes.length > 0) {
    console.log("FIRST ITEM:", JSON.stringify(envelopes[0], null, 2));
  }
}

check();
