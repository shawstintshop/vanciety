#!/usr/bin/env tsx
/**
 * Import salvaged products to Supabase
 * 
 * Usage:
 *   npm run import:products
 * 
 * Requires:
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config();

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  category: string;
  brand: string;
  images: string[];
  features: string[];
  is_featured: boolean;
  is_daily_deal: boolean;
  affiliate_url: string;
  rating: number;
  review_count: number;
  sku: string;
  stock_quantity: number;
  weight: string;
  dimensions: string;
}

async function importProducts() {
  console.log('🛒 Starting product import...\n');

  // Read products JSON
  const productsPath = path.join(__dirname, '../public/data/salvaged/products.json');
  const productsData: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  console.log(`📦 Found ${productsData.length} products in salvaged data\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of productsData) {
    // Check if product already exists (by SKU)
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('sku', product.sku)
      .single();

    if (existing) {
      console.log(`↷ Skipped: ${product.name} (SKU: ${product.sku}) - already exists`);
      skipped++;
      continue;
    }

    // Insert new product
    const { error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        sale_price: product.sale_price,
        category: product.category,
        brand: product.brand,
        images: product.images,
        features: product.features,
        is_featured: product.is_featured,
        is_daily_deal: product.is_daily_deal,
        affiliate_url: product.affiliate_url,
        rating: product.rating,
        review_count: product.review_count,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        weight: product.weight,
        dimensions: product.dimensions
      });

    if (error) {
      console.error(`✗ Failed: ${product.name} - ${error.message}`);
      failed++;
    } else {
      console.log(`✓ Imported: ${product.name} (${product.brand})`);
      imported++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 Import Summary');
  console.log('='.repeat(70));
  console.log(`✓ Imported:  ${imported}`);
  console.log(`↷ Skipped:   ${skipped} (already exist)`);
  console.log(`✗ Failed:    ${failed}`);
  console.log(`📦 Total:     ${productsData.length}`);
  console.log('='.repeat(70));

  process.exit(failed > 0 ? 1 : 0);
}

importProducts().catch((error) => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});
