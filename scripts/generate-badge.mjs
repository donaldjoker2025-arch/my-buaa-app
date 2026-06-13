import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://targmmjjkvszbgrbflpy.supabase.co';
const supabaseAnonKey = 'sb_publishable_0lfQSxr_pidkmIRjfigpdA_5MkN_w_Y';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateBadge() {
  try {
    // 获取全部日期的浏览量
    const { data, error } = await supabase
      .from('page_visits')
      .select('visits');

    if (error) {
      console.error('Error fetching visits:', error);
      process.exit(1);
    }

    const totalVisits = data.reduce((sum, row) => sum + row.visits, 0);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="40" viewBox="0 0 180 40">
  <path d="M 5,5 Q 90,2 175,6 Q 178,20 176,35 Q 85,38 6,34 Q 2,20 5,5 Z" fill="#f8fafb" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <text x="90" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" fill="#4f6ef7" font-weight="bold" text-anchor="middle">
    Total Visits: ${totalVisits}
  </text>
</svg>`;

    fs.writeFileSync('./public/visits-badge.svg', svg);
    console.log(`Successfully generated badge with ${totalVisits} visits.`);
  } catch (err) {
    console.error('Script failed:', err);
    process.exit(1);
  }
}

generateBadge();
