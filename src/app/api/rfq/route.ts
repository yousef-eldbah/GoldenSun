import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const rfqItemSchema = z.object({
  product_id: z.string().optional().default(''),
  product_name: z.string().min(1, 'Product name is required'),
  quantity_tons: z.number().positive('Quantity must be greater than 0'),
  preferred_packaging: z.string().optional().default('Standard Export Box'),
});

const rfqSubmissionSchema = z.object({
  company_name: z.string().min(2, 'Company name is required for B2B export quotes'),
  contact_name: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Valid business email is required'),
  phone_whatsapp: z.string().min(5, 'Valid WhatsApp / phone number is required'),
  country: z.string().min(2, 'Destination country is required'),
  port_of_discharge: z.string().min(2, 'Port of discharge is required'),
  incoterm: z.enum(['FOB', 'CIF', 'CFR']).default('FOB'),
  estimated_etd: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  gdpr_consent: z.boolean().default(true),
  items: z.array(rfqItemSchema).min(1, 'At least one product item must be selected'),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = rfqSubmissionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const rfqNumber = `SG-${year}-${randomCode}`;

    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured on server. Cannot save RFQ.');
      return NextResponse.json(
        {
          success: false,
          error: 'Database service is currently unconfigured. Please submit via WhatsApp directly.',
          rfq_number: rfqNumber,
        },
        { status: 503 }
      );
    }

    // Insert RFQ header
    const { data: rfqRow, error: rfqError } = await supabase
      .from('rfqs')
      .insert({
        rfq_number: rfqNumber,
        company_name: data.company_name,
        contact_name: data.contact_name,
        email: data.email,
        phone_whatsapp: data.phone_whatsapp,
        country: data.country,
        port_of_discharge: data.port_of_discharge,
        incoterm: data.incoterm,
        estimated_etd: data.estimated_etd || new Date().toISOString().split('T')[0],
        notes: data.notes,
        gdpr_consent: data.gdpr_consent,
        status: 'new',
      })
      .select()
      .single();

    if (rfqError || !rfqRow) {
      console.error('Supabase RFQ Insert Error:', rfqError);
      return NextResponse.json(
        {
          success: false,
          error: rfqError?.message || 'Failed to record quote in database.',
        },
        { status: 500 }
      );
    }

    // Insert RFQ items
    const itemsToInsert = data.items.map((item) => ({
      rfq_id: rfqRow.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity_tons: item.quantity_tons,
      preferred_packaging: item.preferred_packaging,
    }));

    const { error: itemsError } = await supabase
      .from('rfq_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Supabase RFQ Items Insert Error:', itemsError);
      // Rollback: delete the rfq header since items failed
      await supabase.from('rfqs').delete().eq('id', rfqRow.id);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save quote items. Please try again or contact us via WhatsApp.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rfq_number: rfqNumber,
      message: 'Quote request submitted successfully',
      created_at: rfqRow.created_at || new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('RFQ API Route Exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unexpected server error occurred.',
      },
      { status: 500 }
    );
  }
}
