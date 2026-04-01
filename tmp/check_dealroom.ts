import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const contextId = 'bbbb0000-0000-0000-0000-000000000002'; // lumiere-dress
  const { data, error } = await supabase
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
    .eq('target_brand_id', contextId);

  console.log("ERROR OUTPUT:", JSON.stringify(error, null, 2));
  console.log("DATA:", JSON.stringify(data, null, 2));
}

check();
