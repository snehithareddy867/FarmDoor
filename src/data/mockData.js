export const CATEGORIES = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    tagline: 'Farm-fresh & pesticide free',
    count: '38 Varieties',
    icon: 'Carrot',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    description: 'Crisp leafy greens, heirloom tomatoes, and root crops harvested this morning.',
  },
  {
    id: 'fruits',
    name: 'Fruits',
    tagline: 'Naturally ripened on branch',
    count: '24 Varieties',
    icon: 'Apple',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    description: 'Sun-kissed orchard apples, hand-picked berries, and seasonal citrus.',
  },
  {
    id: 'dairy',
    name: 'Dairy',
    tagline: 'Pure & grass-fed daily',
    count: '16 Products',
    icon: 'Milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    description: 'A2 raw milk, farm-churned butter, fresh paneer, and artisanal yogurt.',
  },
  {
    id: 'grains',
    name: 'Grains & Pulses',
    tagline: 'Stone-ground & unpolished',
    count: '29 Staples',
    icon: 'Wheat',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Heirloom rice, ancient millets, whole wheat, and high-protein lentils.',
  },
  {
    id: 'other',
    name: 'Other Farm Products',
    tagline: 'Artisanal & wild crafted',
    count: '22 Specialties',
    icon: 'Sprout',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'Raw wildflower honey, cold-pressed oils, organic spices, and herbs.',
  },
];

export const PRODUCTS = [
  {
    id: 1,
    name: 'Heirloom Vine Tomatoes',
    category: 'vegetables',
    price: 3.49,
    unit: 'kg',
    farmerName: 'Ramesh Patel',
    farmName: 'Green Valley Organic Haven',
    farmLocation: 'Nashik, Maharashtra',
    availability: 'Harvested Today',
    inStock: true,
    rating: 4.9,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    tag: '100% Organic',
    description: 'Sweet, juicy heirloom tomatoes picked fresh at peak ripeness. Grown with zero chemical pesticides using age-old drip irrigation.',
    harvestDate: 'Today, 6:00 AM',
    nutrition: 'High in Lycopene, Vitamin C & Potassium'
  },
  {
    id: 2,
    name: 'Tender Baby Spinach & Greens',
    category: 'vegetables',
    price: 2.29,
    unit: 'bundle (400g)',
    farmerName: 'Anita Sharma',
    farmName: 'Kaveri Basin Eco Farms',
    farmLocation: 'Mandya, Karnataka',
    availability: 'In Stock - 45 left',
    inStock: true,
    rating: 4.8,
    reviewsCount: 62,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    tag: 'Hydro-Washed',
    description: 'Velvety, vitamin-rich baby spinach leaves washed with clean spring water and packed in biodegradable kraft packaging.',
    harvestDate: 'Today, 5:30 AM',
    nutrition: 'Rich in Iron, Folate, and Vitamins A & K'
  },
  {
    id: 3,
    name: 'Himachal Crisp Royal Apples',
    category: 'fruits',
    price: 4.99,
    unit: 'kg (approx. 5 pcs)',
    farmerName: 'Vikram Thakur',
    farmName: 'Snowline Apple Orchards',
    farmLocation: 'Shimla, Himachal Pradesh',
    availability: 'In Stock - Fresh Lot',
    inStock: true,
    rating: 5.0,
    reviewsCount: 118,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    tag: 'Tree-Ripened',
    description: 'High-altitude, sweet and crunchy apples grown in cool mountain valleys without chemical wax coatings.',
    harvestDate: 'Yesterday, 3:00 PM',
    nutrition: 'High dietary fiber, antioxidant flavonoids'
  },
  {
    id: 4,
    name: 'Fresh Desi Cow A2 Milk',
    category: 'dairy',
    price: 2.75,
    unit: '1 Liter Bottle',
    farmerName: 'Sukhwinder Singh',
    farmName: 'Gau Seva Pastoral Dairy',
    farmLocation: 'Ludhiana, Punjab',
    availability: 'Morning Batch Ready',
    inStock: true,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    tag: 'Pure Grass-Fed',
    description: 'Unprocessed, pasteurized wholesome A2 cow milk from free-range indigenous cows fed organic green fodder.',
    harvestDate: 'Today, 4:30 AM',
    nutrition: 'Natural A2 beta-casein, Calcium, B12'
  },
  {
    id: 5,
    name: 'Traditional Churned Cultured Butter',
    category: 'dairy',
    price: 5.40,
    unit: '350g Jar',
    farmerName: 'Radha Bai',
    farmName: 'Bilona Heritage Dairy',
    farmLocation: 'Anand, Gujarat',
    availability: 'Limited Batch',
    inStock: true,
    rating: 5.0,
    reviewsCount: 79,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
    tag: 'Hand-Churned',
    description: 'Slow-churned using traditional earthen pot techniques from cultured curd. Golden, rich, aromatic with zero preservatives.',
    harvestDate: 'Yesterday morning',
    nutrition: 'Healthy fats, butyric acid, Vitamin A'
  },
  {
    id: 6,
    name: 'Stone-Ground Ancient Khapli Wheat',
    category: 'grains',
    price: 6.20,
    unit: '5 kg Bag',
    farmerName: 'Balwant Deshmukh',
    farmName: 'Sahyadri Agro Collective',
    farmLocation: 'Satara, Maharashtra',
    availability: 'In Stock',
    inStock: true,
    rating: 4.8,
    reviewsCount: 53,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    tag: 'Low Glycemic',
    description: 'Nutrient-dense ancient emmer wheat (Khapli) stone-ground cold to retain natural germ, bran, and essential minerals.',
    harvestDate: 'Milled this week',
    nutrition: 'High dietary fiber, gut-friendly low gluten index'
  },
  {
    id: 7,
    name: 'Raw Forest Wildflower Honey',
    category: 'other',
    price: 7.50,
    unit: '500g Glass Jar',
    farmerName: 'Devraj Soren',
    farmName: 'Nilgiri Tribal Apiary Project',
    farmLocation: 'Nilgiri Hills, Tamil Nadu',
    availability: 'Fresh Harvest Batch',
    inStock: true,
    rating: 5.0,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    tag: 'Raw & Unfiltered',
    description: '100% natural wild honey harvested ethically from wild bee colonies in flowering subtropical forests. Never heated or micro-filtered.',
    harvestDate: 'Season Harvest Oct 2026',
    nutrition: 'Enzymes, pollen, live antioxidants'
  },
  {
    id: 8,
    name: 'Cold-Pressed Golden Mustard Oil',
    category: 'other',
    price: 4.85,
    unit: '1 Liter',
    farmerName: 'Gurdeep Mann',
    farmName: 'Doaba Organic Press',
    farmLocation: 'Jalandhar, Punjab',
    availability: 'In Stock - 30 bottles',
    inStock: true,
    rating: 4.7,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    tag: 'Wood-Pressed Kachi Ghani',
    description: 'Pure virgin mustard oil extracted on wooden presses below 40°C. Pungent aroma and rich golden clarity for authentic cooking.',
    harvestDate: 'Freshly pressed 3 days ago',
    nutrition: 'Optimal Omega-3 to Omega-6 ratio, MUFA'
  },
  {
    id: 9,
    name: 'Rainbow Bell Peppers (Trio Pack)',
    category: 'vegetables',
    price: 3.10,
    unit: '3 pcs pack',
    farmerName: 'Kishore Reddy',
    farmName: 'Deccan Polyhouse Farms',
    farmLocation: 'Medak, Telangana',
    availability: 'In Stock - Picked Today',
    inStock: true,
    rating: 4.9,
    reviewsCount: 37,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    tag: 'Crunchy & Sweet',
    description: 'Vibrant red, yellow, and green bell peppers grown in controlled climate shade-nets with organic bio-fertilizers.',
    harvestDate: 'Today, 7:00 AM',
    nutrition: 'Triple Vitamin C of an orange, Vitamin A'
  },
  {
    id: 10,
    name: 'Fragrant Hand-Pounded Dehraduni Basmati',
    category: 'grains',
    price: 8.90,
    unit: '5 kg Eco Sack',
    farmerName: 'Mahesh Rawat',
    farmName: 'Himalayan Foothill Grains',
    farmLocation: 'Dehradun, Uttarakhand',
    availability: 'Aged 12 Months',
    inStock: true,
    rating: 4.9,
    reviewsCount: 68,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    tag: 'Authentic Aroma',
    description: 'Extra-long grain traditional Basmati irrigated with pristine snow-melt water from the upper Ganges tributaries.',
    harvestDate: 'Natural aged grain harvest',
    nutrition: 'Naturally gluten-free, low amylose'
  },
  {
    id: 11,
    name: 'Sweet Ruby Pomegranate',
    category: 'fruits',
    price: 4.20,
    unit: 'kg (approx. 4 pcs)',
    farmerName: 'Sanjay Jadhav',
    farmName: 'Solapur Sun-Dry Farms',
    farmLocation: 'Solapur, Maharashtra',
    availability: 'In Stock',
    inStock: true,
    rating: 4.8,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1541345023926-55d6e0853f4b?auto=format&fit=crop&w=800&q=80',
    tag: 'Bhagwa Variety',
    description: 'Plump, glossy rubies bursting with sweet-tart juice. Hand-selected for deep red arils and soft seeds.',
    harvestDate: 'Yesterday afternoon',
    nutrition: 'Punicalagins, Vitamin C, heart-friendly polyphenols'
  },
  {
    id: 12,
    name: 'Country Fresh Free-Range Eggs',
    category: 'dairy',
    price: 3.80,
    unit: 'Pack of 12',
    farmerName: 'Arjun Das',
    farmName: 'Green Meadows Pasture',
    farmLocation: 'Coorg, Karnataka',
    availability: 'Daily Fresh Run',
    inStock: true,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    tag: 'Pasture-Raised',
    description: 'Farm-fresh brown eggs from free-range hens that forage freely on natural open pastures with green grass, herbs, and insects.',
    harvestDate: 'Collected this morning',
    nutrition: 'High Omega-3, Choline, complete proteins'
  }
];

export const TRUST_METRICS = [
  { value: '500+', label: 'Local Family Farms', sub: 'Directly empowered' },
  { value: '24 hrs', label: 'Farm-to-Door Speed', sub: 'Harvest to dinner table' },
  { value: '85%', label: 'Direct Farmer Payout', sub: 'No middleman deduction' },
  { value: '18,500+', label: 'Healthy Households', sub: 'Fed fresh every week' }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Farmers List Fresh Harvests',
    desc: 'Local growers list crops as soon as they are ready to pick. You see exact harvest dates, farm locations, and the real people growing your food.',
    icon: 'Tractor',
    badge: 'Fair Prices by Farmers'
  },
  {
    step: '02',
    title: 'You Choose & Customize',
    desc: 'Select peak seasonal produce, crisp vegetables, farm-churned dairy, and artisan staples. Build your custom basket or recurring fresh box.',
    icon: 'ShoppingBag',
    badge: 'Transparent & Traceable'
  },
  {
    step: '03',
    title: 'Harvested & Dispatched Fast',
    desc: 'Produce is picked at sunrise, carefully packed in temperature-controlled eco-crates, and delivered straight to your home within 24 hours.',
    icon: 'Truck',
    badge: 'Zero Storage Middlemen'
  }
];

export const WHY_US_FEATURES = [
  {
    title: 'Direct Farmer Connections',
    desc: 'Every item is tagged with the farmer’s name, their ancestral farm location, and agricultural practices. Know exactly who feeds your family.',
    icon: 'Users',
    highlight: '100% Traceable'
  },
  {
    title: 'Fresh Agricultural Products',
    desc: 'Say goodbye to supermarket cold-storage produce sitting for weeks. Our food goes from soil to your kitchen within hours of picking.',
    icon: 'Leaf',
    highlight: 'Harvested at Peak Ripeness'
  },
  {
    title: 'Transparent & Fair Pricing',
    desc: 'Over 85% of your bill goes straight to the farmer’s account. You get premium organic food at fair market rates, not supermarket markups.',
    icon: 'ShieldCheck',
    highlight: 'Ethical Economy'
  },
  {
    title: 'Flexible Delivery Options',
    desc: 'Select convenient morning doorstep drop-offs, evening deliveries, or pause and resume your weekly grocery schedule whenever you travel.',
    icon: 'Clock',
    highlight: 'Morning & Evening Slots'
  }
];

export const COMPARISON_DATA = [
  {
    feature: 'Time from Harvest to Table',
    farmToHome: 'Under 24 Hours',
    supermarket: '7 to 21 Days (cold chain storage)'
  },
  {
    feature: 'Farmer Revenue Share',
    farmToHome: '85% to 90% direct payout',
    supermarket: 'Only 15% to 25% (eaten by middlemen)'
  },
  {
    feature: 'Chemical Wax & Ripening Agents',
    farmToHome: '0% Guaranteed (Nature-ripened)',
    supermarket: 'Frequent artificial gas & wax coating'
  },
  {
    feature: 'Farm & Grower Traceability',
    farmToHome: 'Exact farm, location & harvest log',
    supermarket: 'Generic barcodes, anonymous origins'
  },
  {
    feature: 'Packaging Sustainability',
    farmToHome: 'Compostable kraft & reusable crates',
    supermarket: 'Excessive single-use plastic wraps'
  }
];

export const FARMER_BENEFITS = [
  'Zero commission fees for your first 90 days',
  'Automated doorstep pickup from your farm gate',
  'Instant weekly bank settlements with zero delay',
  'Access to direct demand forecasts & soil analytics',
  'Fair price guarantee protected against broker cartels',
  'Dedicated local agri-support manager in your language'
];

