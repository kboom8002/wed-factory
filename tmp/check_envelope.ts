import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('bride_groom_envelope').select('*').eq('envelope_id', '2310df48-12be-4247-80ff-f23095f6c281');
  console.log("TEST SPECIFIC:", JSON.stringify(data, null, 2));
  console.log("ERROR:", error);

  const { data: allData } = await supabase.from('bride_groom_envelope').select('envelope_id, target_brand_id, target_combination_id');
  console.log("ALL ENVELOPES:", JSON.stringify(allData, null, 2));

  const { data: brandData } = await supabase.from('brand_registry').select('brand_id, brand_slug').eq('brand_slug', 'lumiere-dress');
  console.log("LUMIERE BRAND ID:", JSON.stringify(brandData, null, 2));
}

check();
