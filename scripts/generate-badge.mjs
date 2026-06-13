import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://targmmjjkvszbgrbflpy.supabase.co';
const supabaseAnonKey = 'sb_publishable_0lfQSxr_pidkmIRjfigpdA_5MkN_w_Y';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateBadge() {
  try {
    const today = new Date();
    const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
    const past7Days = [];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      past7Days.push(dateStr);
      labels.push(daysOfWeek[d.getDay()]);
    }

    const startStr = past7Days[0];
    const endStr = past7Days[6];

    const { data: dbData, error } = await supabase
      .from('page_visits')
      .select('visit_date, visits')
      .gte('visit_date', startStr)
      .lte('visit_date', endStr)
      .order('visit_date', { ascending: true });

    if (error) {
      console.error('Error fetching visits:', error);
      process.exit(1);
    }

    const visitsByDate = {};
    if (dbData) {
      dbData.forEach(row => {
        visitsByDate[row.visit_date] = row.visits;
      });
    }

    const dataPoints = past7Days.map(dateStr => visitsByDate[dateStr] || 0);
    const maxV = Math.max(1, ...dataPoints);

    // SVG dimensions
    const width = 400;
    const height = 200;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = dataPoints.map((val, i) => {
      const x = padding + (i / 6) * chartWidth;
      const y = height - padding - (val / maxV) * chartHeight;
      return `${x},${y}`;
    }).join(" ");

    // Draw the X axis labels
    const xAxisLabels = labels.map((label, i) => {
      const x = padding + (i / 6) * chartWidth;
      return `<text x="${x}" y="${height - 15}" font-family="-apple-system, sans-serif" font-size="12" fill="#8895a3" text-anchor="middle">周${label}</text>`;
    }).join("\n");

    // Hand-drawn border path
    const borderPath = `M 10,10 Q 200,5 390,12 Q 395,100 388,190 Q 200,195 12,188 Q 5,100 10,10 Z`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f6ef7" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>

  <!-- Background and Hand-drawn Border -->
  <path d="${borderPath}" fill="#ffffff" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  
  <!-- Title -->
  <text x="${padding}" y="25" font-family="-apple-system, sans-serif" font-size="14" fill="#151c25" font-weight="bold">本周访问量趋势</text>
  
  <!-- Grid lines -->
  <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#e0e7ed" stroke-dasharray="4" />
  <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e0e7ed" stroke-dasharray="4" />

  <!-- Data Line -->
  <polyline points="${points}" fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Data Points -->
  ${dataPoints.map((val, i) => {
    const x = padding + (i / 6) * chartWidth;
    const y = height - padding - (val / maxV) * chartHeight;
    return `<circle cx="${x}" cy="${y}" r="4" fill="#ffffff" stroke="#4f6ef7" stroke-width="2" />
            <text x="${x}" y="${y - 10}" font-family="-apple-system, sans-serif" font-size="10" fill="#4f6ef7" font-weight="bold" text-anchor="middle">${val}</text>`;
  }).join("\n  ")}

  <!-- X Axis Labels -->
  ${xAxisLabels}
</svg>`;

    fs.writeFileSync('./public/visits-badge.svg', svg);
    const totalVisits = dataPoints.reduce((a,b)=>a+b, 0);
    console.log(`Successfully generated chart with ${totalVisits} visits this week.`);
  } catch (err) {
    console.error('Script failed:', err);
    process.exit(1);
  }
}

generateBadge();
