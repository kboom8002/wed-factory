import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('deal_proposals')
    .select(`
      proposal_id,
      bride_groom_envelope ( envelope_id )
    `)
    .limit(1);

  console.log("REVERSE FETCH:", JSON.stringify(error, null, 2));
  console.log("DATA:", JSON.stringify(data, null, 2));
}

check();
