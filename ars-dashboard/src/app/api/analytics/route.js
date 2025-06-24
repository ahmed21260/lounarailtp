import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';

// Remplace par l'ID de ta propriété GA4 (ex: 'properties/XXXXXXXXX')
const propertyId = 'properties/494264551';

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(process.cwd(), 'securite ++/groovy-axis-463908-m2-582ee91c904f.json')
});

export async function GET() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' }
      ],
      dimensions: [
        { name: 'pagePath' }
      ]
    });
    return NextResponse.json({ data: response.rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 