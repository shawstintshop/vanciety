import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Create sample forum categories
    const categories = await Promise.all([
      prisma.forumCategory.upsert({
        where: { slug: 'general' },
        update: {},
        create: {
          name: 'General Discussion',
          description: 'General vanlife topics and discussions',
          slug: 'general',
          icon: '💬',
          sortOrder: 1,
        },
      }),
      prisma.forumCategory.upsert({
        where: { slug: 'builds' },
        update: {},
        create: {
          name: 'Van Builds',
          description: 'Share your build progress and get advice',
          slug: 'builds',
          icon: '🔨',
          sortOrder: 2,
        },
      }),
      prisma.forumCategory.upsert({
        where: { slug: 'technical' },
        update: {},
        create: {
          name: 'Technical Help',
          description: 'Get help with technical problems',
          slug: 'technical',
          icon: '⚙️',
          sortOrder: 3,
        },
      }),
      prisma.forumCategory.upsert({
        where: { slug: 'routes' },
        update: {},
        create: {
          name: 'Routes & Travel',
          description: 'Share routes, destinations, and travel tips',
          slug: 'routes',
          icon: '🗺️',
          sortOrder: 4,
        },
      }),
      prisma.forumCategory.upsert({
        where: { slug: 'gear' },
        update: {},
        create: {
          name: 'Gear & Equipment',
          description: 'Discuss gear, equipment, and product reviews',
          slug: 'gear',
          icon: '🎒',
          sortOrder: 5,
        },
      }),
    ]);

    // Create sample products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: 1 },
        update: {},
        create: {
          name: 'Goal Zero Yeti 1500X Portable Power Station',
          description: 'High-capacity lithium battery power station perfect for van life. Features multiple outlets and fast charging.',
          price: 1799.95,
          currency: 'USD',
          brand: 'Goal Zero',
          category: 'Power & Electrical',
          tags: ['battery', 'power', 'solar', 'lithium'],
          images: ['/images/goal-zero-yeti.jpg'],
          affiliateUrl: 'https://example.com/goal-zero-yeti',
          isAffiliate: true,
          isFeatured: true,
          stockQuantity: 25,
          rating: 4.7,
          reviewCount: 89,
        },
      }),
      prisma.product.upsert({
        where: { id: 2 },
        update: {},
        create: {
          name: 'Dometic CFX3 75DZ Dual Zone Electric Cooler',
          description: 'Dual zone electric cooler with freezer and refrigerator compartments. Perfect for extended van trips.',
          price: 1299.00,
          salePrice: 1199.00,
          currency: 'USD',
          brand: 'Dometic',
          category: 'Refrigeration',
          tags: ['cooler', 'refrigerator', 'dual-zone', 'electric'],
          images: ['/images/dometic-cfx3.jpg'],
          affiliateUrl: 'https://example.com/dometic-cfx3',
          isAffiliate: true,
          isDailyDeal: true,
          stockQuantity: 15,
          rating: 4.5,
          reviewCount: 67,
        },
      }),
      prisma.product.upsert({
        where: { id: 3 },
        update: {},
        create: {
          name: 'Renogy 400W Solar Panel Kit',
          description: 'Complete solar panel kit with charge controller, cables, and mounting hardware.',
          price: 599.99,
          currency: 'USD',
          brand: 'Renogy',
          category: 'Solar & Renewable Energy',
          tags: ['solar', 'panels', 'renewable', 'kit'],
          images: ['/images/renogy-solar.jpg'],
          affiliateUrl: 'https://example.com/renogy-solar',
          isAffiliate: true,
          isFeatured: true,
          stockQuantity: 30,
          rating: 4.6,
          reviewCount: 124,
        },
      }),
    ]);

    // Create sample locations
    const locations = await Promise.all([
      prisma.location.create({
        data: {
          name: 'Moab, Utah - Slickrock Camping',
          description: 'Beautiful red rock camping with stunning views. Perfect for mountain biking and hiking.',
          latitude: 38.5733,
          longitude: -109.5498,
          type: 'camp_spot',
          amenities: ['scenic_views', 'hiking', 'mountain_biking', 'stargazing'],
          rating: 4.8,
          reviewCount: 45,
          submittedBy: 'system', // This should be a real user ID in production
          isVerified: true,
        },
      }),
      prisma.location.create({
        data: {
          name: 'Quartzsite, Arizona - Desert Gathering',
          description: 'Popular winter gathering spot for RVers and van lifers. Great community atmosphere.',
          latitude: 33.6636,
          longitude: -114.2302,
          type: 'camp_spot',
          amenities: ['community', 'markets', 'workshops', 'water'],
          rating: 4.3,
          reviewCount: 89,
          submittedBy: 'system',
          isVerified: true,
        },
      }),
      prisma.location.create({
        data: {
          name: 'Seattle, WA - Van Life Outfitters',
          description: 'Full-service van conversion shop and supply store. Great for parts and advice.',
          latitude: 47.6062,
          longitude: -122.3321,
          type: 'business',
          amenities: ['parts', 'service', 'advice', 'installation'],
          rating: 4.9,
          reviewCount: 67,
          submittedBy: 'system',
          isVerified: true,
        },
      }),
    ]);

    logger.info('Database seeding completed successfully!');
    logger.info(`Created ${categories.length} forum categories`);
    logger.info(`Created ${products.length} products`);
    logger.info(`Created ${locations.length} locations`);

  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;