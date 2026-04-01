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
      deal_proposals!client_envelope_id ( proposal_id )
    `)
    .limit(1);

  console.log("TEST WITH EXPLICIT FK:", JSON.stringify(error, null, 2));
  console.log("DATA:", JSON.stringify(data, null, 2));

  const { data: d2, error: e2 } = await supabase
    .from('bride_groom_envelope')
    .select(`
      envelope_id,
      deal_proposals!deal_proposals_client_envelope_id_fkey ( proposal_id )
    `)
    .limit(1)
  
  console.log("TEST WITH CONSTRAINT NAME:", JSON.stringify(e2, null, 2));
}

check();
