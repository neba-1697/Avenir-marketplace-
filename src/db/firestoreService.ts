import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  getDoc,
  writeBatch,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';

// Fallback / Initial Seed Data
const INITIAL_STORES = [
  {
    id: 'store-bole-elec',
    name: 'Bole Premium Electronics',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1000&auto=format&fit=crop',
    description: 'Your trusted partner in Addis Ababa for original luxury high-tech computers, professional camera gear, and premium smartphones. Fully certified original distributor.',
    ownerId: 'owner-bole-elec',
    reviewsCount: 142,
    rating: 4.8,
    totalSales: 1640,
    followersCount: 890,
    location: 'Bole Road, Near Edna Mall, Addis Ababa',
    verified: true,
    categories: ['Electronics', 'Office Supplies'],
    returnPolicy: '7-day inspection guarantee with full cash escrow reversal.',
    deliveryInfo: 'Inspected and shipped in premium dual-wrap eco cartons within 3 hours.',
    verificationStatus: 'verified'
  },
  {
    id: 'store-merkato-fashion',
    name: 'Merkato High Fashion',
    logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    description: 'The finest authentic Ethiopian Handloom Habesha Kemis, custom stitched premium leather shoes, and modern local apparel designs. Honoring centuries of craftsmanship.',
    ownerId: 'owner-merkato-fash',
    reviewsCount: 310,
    rating: 4.9,
    totalSales: 3420,
    followersCount: 2200,
    location: 'Merkato Quarter, Fashion District, Addis Ababa',
    verified: true,
    categories: ['Fashion', 'Handmade Products'],
    returnPolicy: 'No-hassle size exchange within 3 days. Tailoring modification support available.',
    deliveryInfo: 'Packed in bespoke handwoven premium standard cases.',
    verificationStatus: 'verified'
  },
  {
    id: 'store-cmc-estates',
    name: 'CMC Elite Estates & Furniture',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    description: 'Exclusive secure properties, luxurious listings for rent and buy, paired with luxury home styling furniture. Built and managed entirely through legal escrows.',
    ownerId: 'owner-cmc-estates',
    reviewsCount: 54,
    rating: 4.7,
    totalSales: 89,
    followersCount: 650,
    location: 'CMC Gated Residence compound, Building B, Addis Ababa',
    verified: true,
    categories: ['Properties', 'Furniture', 'Home Goods'],
    returnPolicy: 'Escrow deposit release only after physical verification and legal title clearance.',
    deliveryInfo: 'Property tour and physical keys delivery within 24 hours of platform deposit verification.',
    verificationStatus: 'verified'
  },
  {
    id: 'store-gulele-grocer',
    name: 'Gulele Clean Groceries & Farms',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1000&auto=format&fit=crop',
    description: 'Pure high-altitude organic Arabica coffee beans (Yirgacheffe & Sidamo), organic teff grain, honey, and fresh agricultural yield directly sourced from local co-ops.',
    ownerId: 'owner-gulele-grocer',
    reviewsCount: 188,
    rating: 4.9,
    totalSales: 2100,
    followersCount: 1100,
    location: 'Gulele Subcity, Crop Union Depot, Addis Ababa',
    verified: true,
    categories: ['Groceries', 'Agricultural Products'],
    returnPolicy: 'Freshness guarantee block. Immediate 100% replacement if QC checks fail.',
    deliveryInfo: 'Cold-chain insulated shipping to preserve freshness of crops.',
    verificationStatus: 'verified'
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-macbook',
    storeId: 'store-bole-elec',
    name: 'MacBook Pro 16" M3 Max (Premium Spec)',
    price: 165000,
    originalPrice: 178000,
    description: 'Supercharged power with Apple M3 Max chip, 36GB unified RAM, and 1TB ultra-fast SSD. Ideal for 3D animators and professional local developers. Ethiopian keyboard configuration.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-laptop-at-home-42296-large.mp4',
    rating: 4.8,
    reviewsCount: 38,
    totalSales: 105,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'prod-s24',
    storeId: 'store-bole-elec',
    name: 'Samsung Galaxy S24 Ultra (5G, 512GB)',
    price: 92000,
    originalPrice: 97500,
    description: 'Built-in S-Pen, Titanium Body, and unmatched Nightography 200MP camera system, coupled with Google AI circle search live features. Guaranteed genuine PTA approved.',
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-modern-smartphone-close-up-40409-large.mp4',
    rating: 4.7,
    reviewsCount: 52,
    totalSales: 140,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'prod-kemis',
    storeId: 'store-merkato-fashion',
    name: 'Luxury Habesha Kemis (Royal Gold Stitches)',
    price: 18500,
    originalPrice: 22000,
    description: 'Authentic 100% fine cotton traditional Habesha Kemis dress. Painstakingly handloom-woven and decorated with premium tilet gold embroidery. Perfect for wedding hosting and national holidays.',
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-white-dress-walking-slowly-34351-large.mp4',
    rating: 5.0,
    reviewsCount: 88,
    totalSales: 220,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'prod-boots',
    storeId: 'store-merkato-fashion',
    name: 'Anbessa Style Premium Leather Chelsea Boots',
    price: 6200,
    originalPrice: 7500,
    description: 'Meticulously crafted from full-grain high-grade Ethiopian cow hide. Built-to-last durable welted sole with double elastic gores. Elevating urban street styles in Addis.',
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-new-pair-of-shoes-40899-large.mp4',
    rating: 4.9,
    reviewsCount: 104,
    totalSales: 410,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'prod-coffeetable',
    storeId: 'store-cmc-estates',
    name: 'Classic Teak Wood Central Coffee Table',
    price: 29000,
    originalPrice: 34000,
    description: 'Bold minimalist living room center table hand-welded from premium local Teak wood. Resistant surface finish showing rich natural warm grain structures.',
    category: 'Home Goods',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    reviewsCount: 12,
    totalSales: 16,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'prod-yirgacheffe',
    storeId: 'store-gulele-grocer',
    name: 'Top grade Yirgacheffe Coffee Beans (1kg Organic Light Roast)',
    price: 1200,
    originalPrice: 1500,
    description: 'Exceptional Sidamo-border garden coffee light roasted to perfection. Unveils subtle jasmine aromas and sweet lemon-citrus notes. 100% export quality. Whole beans.',
    category: 'Groceries',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-41315-large.mp4',
    rating: 4.9,
    reviewsCount: 160,
    totalSales: 890,
    verificationStatus: 'verified',
    status: 'active'
  }
];

const INITIAL_SERVICES = [
  {
    id: 'serv-plumber',
    storeId: 'store-cmc-estates',
    name: 'Licensed Residential Plumber Kazanchis & Bole',
    providerName: 'Kazanchis Tech Plumbers',
    price: 450,
    chargeType: 'hourly' as const,
    description: 'Certified leakage correction, high-performance water pump installations, and structural pipeline overhauls. Background-checked and quality controlled by Avenir.',
    category: 'Plumbing Services',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop',
    location: 'Kazanchis, Addis Ababa',
    rating: 4.8,
    reviewsCount: 34,
    contactThroughPlatformOnly: true,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'serv-electrician',
    storeId: 'store-bole-elec',
    name: 'Premium Commercial & Domestic Electrician',
    providerName: 'Bole Auto-Electrical Team',
    price: 550,
    chargeType: 'hourly' as const,
    description: 'Three-phase factory-grade industrial diagnosis, home inverter backup setups, and secure electrical board installations. Rapid 1 hours deployment.',
    category: 'Electrician Services',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
    location: 'Bole Road, Addis Ababa',
    rating: 4.9,
    reviewsCount: 46,
    contactThroughPlatformOnly: true,
    verificationStatus: 'verified',
    status: 'active'
  }
];

const INITIAL_PROPERTIES = [
  {
    id: 'prop-bole-apartment',
    storeId: 'store-cmc-estates',
    name: 'Modern 3-Bedroom Executive Apartment',
    price: 8500000,
    category: 'Properties',
    description: 'Ultra-secure premium residence at Bole Kazanchis axis. Features customized European kitchen fittings, continuous generator back-up, dedicated security, and expansive views of Bole skyline.',
    bedrooms: 3,
    bathrooms: 2,
    areaSqM: 185,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-keys-with-keychain-in-front-of-house-43202-large.mp4',
    location: 'Bole Road, behind Atlas Hotel, Addis Ababa',
    contactThroughPlatformOnly: true,
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: 'prop-kazanchis-comm',
    storeId: 'store-cmc-estates',
    name: 'High-Exposure Brand New Corporate Office Space',
    price: 150000,
    category: 'Properties',
    description: 'Multi-floor premium corporate commercial space ideally suited for banks, tech headquarters, or premium clinics. Equipped with full fiber-optic broadband access, safe exit paths, and central HVAC.',
    areaSqM: 420,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    location: 'Kazanchis Financial Hub, Ring Road Circle, Addis Ababa',
    contactThroughPlatformOnly: true,
    verificationStatus: 'verified',
    status: 'active'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 'vid-s24-unbox',
    title: 'Cinematic unboxing of the S24 Ultra in Bole store!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-modern-smartphone-close-up-40409-large.mp4',
    description: 'See the beauty of raw Titanium with camera checks. Secured in Telebirr escrow!',
    storeId: 'store-bole-elec',
    storeName: 'Bole Premium Electronics',
    storeLogo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
    likes: 940,
    views: 7420,
    productTags: [
      { itemId: 'prod-s24', itemType: 'product', name: 'Samsung Galaxy S24 Ultra', price: 92000 }
    ]
  },
  {
    id: 'vid-kemis-weaving',
    title: 'How our master weavers craft traditional Habesha Kemis',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-white-dress-walking-slowly-34351-large.mp4',
    description: 'Behind the scenes at Merkato. Gold thread embroidered by local weavers in Addis.',
    storeId: 'store-merkato-fashion',
    storeName: 'Merkato High Fashion',
    storeLogo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop',
    likes: 1890,
    views: 12400,
    productTags: [
      { itemId: 'prod-kemis', itemType: 'product', name: 'Luxury Habesha Kemis', price: 18500 }
    ]
  }
];

const INITIAL_AUDITS = [
  {
    id: 'log-1',
    userId: 'system',
    userName: 'Avenir System',
    action: 'PLATFORM_ONLINE',
    details: 'Avenir persistent cloud database and telemetry layers initialized successfully.',
    time: new Date().toISOString()
  }
];

// Helper to seed database if empty
export async function seedDatabaseIfEmpty() {
  try {
    const storesSnap = await getDocs(collection(db, 'stores'));
    if (storesSnap.empty) {
      console.log('Firestore is empty. Starting seeding initialization...');
      
      const batch = writeBatch(db);

      // 1. Seed Stores
      INITIAL_STORES.forEach(st => {
        batch.set(doc(db, 'stores', st.id), st);
      });

      // 2. Seed Products/Services/Properties as Products
      INITIAL_PRODUCTS.forEach(p => {
        batch.set(doc(db, 'products', p.id), p);
      });
      INITIAL_SERVICES.forEach(s => {
        batch.set(doc(db, 'products', s.id), s);
      });
      INITIAL_PROPERTIES.forEach(pr => {
        batch.set(doc(db, 'products', pr.id), pr);
      });

      // 3. Seed Default Users for simulation
      const demoUsers = [
        { id: 'user-buyer-demo', email: 'nebilshebab949@gmail.com', firstName: 'Nebil', lastName: 'Shebab', userType: 'admin', isEmailVerified: true, isPhoneVerified: true },
        { id: 'owner-bole-elec', email: 'bole@avenir.et', firstName: 'Bole', lastName: 'Seller', userType: 'seller', isEmailVerified: true, isPhoneVerified: true },
        { id: 'owner-merkato-fash', email: 'merkato@avenir.et', firstName: 'Merkato', lastName: 'Weaver', userType: 'seller', isEmailVerified: true, isPhoneVerified: true },
        { id: 'owner-cmc-estates', email: 'cmc@avenir.et', firstName: 'CMC', lastName: 'Agent', userType: 'seller', isEmailVerified: true, isPhoneVerified: true },
        { id: 'owner-gulele-grocer', email: 'gulele@avenir.et', firstName: 'Gulele', lastName: 'Farmer', userType: 'seller', isEmailVerified: true, isPhoneVerified: true }
      ];
      demoUsers.forEach(u => {
        batch.set(doc(db, 'users', u.id), u);
      });

      // 4. Seed Audit Logs
      INITIAL_AUDITS.forEach(log => {
        batch.set(doc(db, 'audit_logs', log.id), log);
      });

      await batch.commit();
      console.log('Database successfully seeded with elegant product catalog!');
    }
  } catch (err) {
    console.error('Error seeding database: ', err);
  }
}

// Data Access Service
export async function fetchFullCatalog() {
  try {
    await seedDatabaseIfEmpty();

    const [storesSnap, productsSnap, auditsSnap, ordersSnap, onbsSnap] = await Promise.all([
      getDocs(collection(db, 'stores')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'audit_logs')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'seller_verifications'))
    ]);

    const stores = lg(storesSnap).map((s: any) => ({
      ...s,
      logo: s.logo || s.logoUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
      logoUrl: s.logoUrl || s.logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
      banner: s.banner || s.bannerUrl || 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1000&auto=format&fit=crop',
      bannerUrl: s.bannerUrl || s.banner || 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1000&auto=format&fit=crop',
      verified: s.verified !== undefined ? s.verified : true
    }));

    const allProducts = lg(productsSnap);
    const auditLogs = lg(auditsSnap).sort((a: any, b: any) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime());
    const orders = lg(ordersSnap);
    const onboardings = lg(onbsSnap);

    // Partition and map into UI expected formats with full image/imageUrl and title/name compatibility
    const products = allProducts
      .filter((p: any) => !p.id.startsWith('serv-') && !p.id.startsWith('prop-'))
      .map((p: any) => ({
        ...p,
        image: p.image || p.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
        imageUrl: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'
      }));

    const services = allProducts
      .filter((p: any) => p.id.startsWith('serv-'))
      .map((s: any) => ({
        ...s,
        image: s.image || s.imageUrl || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop',
        imageUrl: s.imageUrl || s.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop'
      }));

    const properties = allProducts
      .filter((p: any) => p.id.startsWith('prop-'))
      .map((pr: any) => {
        let propertyType = pr.propertyType;
        if (!propertyType) {
          propertyType = pr.id.includes('apartment') ? 'apartment' : 'commercial';
        }
        let listingType = pr.listingType;
        if (!listingType) {
          listingType = pr.price > 1000000 ? 'buy' : 'rent';
        }
        return {
          ...pr,
          title: pr.title || pr.name || 'Premium Property Listing',
          name: pr.name || pr.title || 'Premium Property Listing',
          image: pr.image || pr.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
          imageUrl: pr.imageUrl || pr.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
          propertyType,
          listingType
        };
      });

    return {
      stores,
      products,
      services,
      properties,
      videos: INITIAL_VIDEOS, // Static visual dynamic elements
      orders,
      onboardings,
      supportTickets: [],
      auditLogs
    };
  } catch (err: any) {
    console.error('Error in fetchFullCatalog:', err);
    return { stores: [], products: [], services: [], properties: [], videos: [], orders: [], onboardings: [], supportTickets: [], auditLogs: [], error: err.message };
  }
}

function lg(snap: any) {
  const arr: any[] = [];
  snap.forEach((doc: any) => {
    arr.push({ ...doc.data(), id: doc.id });
  });
  return arr;
}

// --- PERSISTENT WRITE & TRANSITION MUTATIONS ---

export async function submitOnboarding(onboarding: any, auditLog: any) {
  await setDoc(doc(db, 'seller_verifications', onboarding.id), onboarding);
  await setDoc(doc(db, 'audit_logs', auditLog.id), auditLog);
}

export async function reviewOnboarding(id: string, status: any, rejectComment?: string) {
  const verificationRef = doc(db, 'seller_verifications', id);
  const snap = await getDoc(verificationRef);
  if (!snap.exists()) {
    throw new Error('Onboarding request not found');
  }

  const request = snap.data();
  // Update status
  await updateDoc(verificationRef, { verificationStatus: status });

  if (status === 'Approved') {
    const storeId = `store-${request.businessName.toLowerCase().replace(/\s+/g, '-')}`;
    const storeRef = doc(db, 'stores', storeId);
    const storeSnap = await getDoc(storeRef);
    if (!storeSnap.exists()) {
      const newStore = {
        id: storeId,
        name: request.businessName,
        logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1000&auto=format&fit=crop',
        description: `Official vetted workspace of ${request.businessName}. Fully approved by Avenir manual inspectors.`,
        ownerId: request.ownerId || `owner-${Date.now()}`,
        reviewsCount: 0,
        rating: 5.0,
        totalSales: 0,
        followersCount: 1,
        location: 'Addis Ababa, Ethiopia',
        verified: true,
        categories: [request.category === 'product' ? 'Electronics' : request.category === 'service' ? 'Services' : 'Properties'],
        returnPolicy: 'Standard 7 days physical verification escrow block.',
        deliveryInfo: 'Inspected and sent within 24 hours of purchase.',
        verificationStatus: 'verified'
      };
      await setDoc(storeRef, newStore);
    }
  }

  // Create audit log
  const logId = `log-${Date.now()}`;
  const newAudit = {
    id: logId,
    userId: 'admin-1',
    userName: 'Avenir Super Admin',
    action: `ONBOARDING_${status?.toUpperCase() || 'UNKNOWN'}`,
    details: `Onboarding ID: ${id} updated to ${status}. ${rejectComment ? `Reason: ${rejectComment}` : 'Store generated'}.`,
    time: new Date().toISOString()
  };
  await setDoc(doc(db, 'audit_logs', logId), newAudit);
}

export async function addListing(type: string, storeId: string, name: string, price: number, description: string, category: string, image?: string, info?: any) {
  const itemId = `${type === 'product' ? 'prod' : type === 'service' ? 'serv' : 'prop'}-${Date.now().toString().slice(-6)}`;
  const itemRef = doc(db, 'products', itemId);

  if (type === 'product') {
    const newProduct = {
      id: itemId,
      storeId,
      name,
      price: Number(price),
      description,
      category,
      imageUrl: image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
      rating: 5.0,
      reviewsCount: 0,
      totalSales: 0,
      verificationStatus: 'verified',
      status: 'active'
    };
    await setDoc(itemRef, newProduct);
  } else if (type === 'service') {
    const newService = {
      id: itemId,
      storeId,
      name,
      providerName: 'Verified Provider',
      price: Number(price),
      chargeType: (info?.chargeType as any) || 'fixed',
      description,
      category,
      imageUrl: image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop',
      location: info?.location || 'Addis Ababa',
      rating: 5.0,
      reviewsCount: 0,
      contactThroughPlatformOnly: true,
      verificationStatus: 'verified',
      status: 'active'
    };
    await setDoc(itemRef, newService);
  } else if (type === 'property') {
    const newProperty = {
      id: itemId,
      storeId,
      name,
      price: Number(price),
      listingType: (info?.listingType as any) || 'buy',
      propertyType: (info?.propertyType as any) || 'apartment',
      description,
      category: 'Properties',
      bedrooms: info?.bedrooms ? Number(info.bedrooms) : undefined,
      bathrooms: info?.bathrooms ? Number(info.bathrooms) : undefined,
      areaSqM: info?.areaSqM ? Number(info.areaSqM) : undefined,
      imageUrl: image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
      location: info?.location || 'Addis Ababa',
      contactThroughPlatformOnly: true,
      verificationStatus: 'verified',
      status: 'active'
    };
    await setDoc(itemRef, newProperty);
  }

  // Generate audit log log-listing
  const logId = `log-${Date.now()}`;
  const newAudit = {
    id: logId,
    userId: storeId,
    userName: 'Seller Store',
    action: 'NEW_LISTING_PUBLISHED',
    details: `${type?.toUpperCase() || 'UNKNOWN'} Listing "${name}" created inside Store ID "${storeId}"`,
    time: new Date().toISOString()
  };
  await setDoc(doc(db, 'audit_logs', logId), newAudit);

  return itemId;
}

export async function placeOrder(order: any, auditLog: any) {
  await setDoc(doc(db, 'orders', order.id), order);
  
  // Increment sales
  if (order.items && Array.isArray(order.items)) {
    for (const it of order.items) {
      const prRef = doc(db, 'products', it.itemId);
      const prSnap = await getDoc(prRef);
      if (prSnap.exists()) {
        const sales = prSnap.data().totalSales || 0;
        await updateDoc(prRef, { totalSales: sales + (it.quantity || 1) });
      }
    }
  }

  await setDoc(doc(db, 'audit_logs', auditLog.id), auditLog);
}

export async function updateOrderStatus(id: string, status: any, comment?: string, qcPassed?: boolean) {
  const orderRef = doc(db, 'orders', id);
  const snap = await getDoc(orderRef);
  if (!snap.exists()) {
    throw new Error('Target order not found');
  }

  const order = snap.data();
  const updates: any = { status };

  const metrics: Record<string, number> = {
    'Order Received': 10,
    'Seller Confirmed': 20,
    'Awaiting Inspection': 30,
    'Inspection Approved': 50,
    'Ready For Pickup': 60,
    'Picked Up': 70,
    'In Transit': 80,
    'Out For Delivery': 90,
    'Delivered': 95,
    'Buyer Confirmed': 100,
  };

  updates.trackingProgress = metrics[status] || 50;

  const locationMapping: Record<string, { lat: number; lng: number; name: string }> = {
    'Order Received': { lat: 9.02, lng: 38.75, name: 'Seller Packing Warehouse, Addis Ababa' },
    'Seller Confirmed': { lat: 9.025, lng: 38.755, name: 'Ready for Collection Dispatch' },
    'Awaiting Inspection': { lat: 9.01, lng: 38.78, name: 'Avenir Central QC Inspection Hub' },
    'Inspection Approved': { lat: 9.01, lng: 38.78, name: 'Passed - Prepared for courier pickup' },
    'Ready For Pickup': { lat: 9.011, lng: 38.782, name: 'Avenir Courier Loading Zone' },
    'Picked Up': { lat: 9.014, lng: 38.775, name: 'Avenir Logistics Van #4' },
    'In Transit': { lat: 9.022, lng: 38.761, name: 'Ring Road Kazanchis Intersection' },
    'Out For Delivery': { lat: 9.028, lng: 38.752, name: 'Bole Subcity Circle Dispatch' },
    'Delivered': { lat: 9.03, lng: 38.745, name: 'Destination Address front porch' },
    'Buyer Confirmed': { lat: 9.03, lng: 38.745, name: 'Escrow released 100% to sellers.' },
  };

  if (locationMapping[status]) {
    updates.trackingLocation = locationMapping[status];
  }

  if (status === 'Inspection Approved') {
    updates.inspectionReport = {
      inspectorName: 'Avenir Senior Inspector (Habtamu)',
      passed: qcPassed !== false,
      comment: comment || 'Certified physical packaging intact. Sourcing verifies original product serial matches PTA official listing.',
      date: new Date().toLocaleDateString(),
    };
  }

  if (status === 'Buyer Confirmed') {
    if (order.payment) {
      updates.payment = {
        ...order.payment,
        status: 'released'
      };
    }
  }

  // Update tracking history
  const history = order.trackingHistory || [];
  history.push({
    status: status,
    time: new Date().toLocaleString(),
    note: comment || `Status successfully transited to ${status}.`
  });
  updates.trackingHistory = history;

  await updateDoc(orderRef, updates);

  // Audit Log
  const logId = `log-${Date.now()}`;
  const newAudit = {
    id: logId,
    userId: 'logistics-manager',
    userName: 'Avenir Logistics Control',
    action: `ORDER_PROGRESS_${(status || '').toUpperCase().replace(/\s+/g, '_')}`,
    details: `Order status of ${id} moved to "${status}".`,
    time: new Date().toISOString()
  };
  await setDoc(doc(db, 'audit_logs', logId), newAudit);

  return { ...order, ...updates };
}

