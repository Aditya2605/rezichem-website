// scripts/seed.js
// Run: node scripts/seed.js
// Requires DATABASE_URL in .env.local

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon')
    ? { rejectUnauthorized: false }
    : false,
});

const DEFAULT_CATEGORY_IMAGE_URL = '/images/placeholders/category-default.svg';
const DEFAULT_PRODUCT_IMAGE_URL = '/images/placeholders/product-default.svg';

// ─── Categories (from Rezichem product brochure) ──────────────────────────────
const categories = [
  {
    name: 'Antibacterial / Antimicrobial',
    slug: 'antibacterial-antimicrobial',
    description: 'Broad and narrow spectrum antibiotics and antimicrobial agents for bacterial infections.',
  },
  {
    name: 'NSAIDs / Pain Management',
    slug: 'nsaids-pain-management',
    description: 'Anti-inflammatory, analgesic, anti-rheumatoid, anti-spasmodic and muscle relaxant formulations.',
  },
  {
    name: 'Nutrition & Vitamins',
    slug: 'nutrition-vitamins',
    description: 'Nutritional supplements, vitamins, minerals, haematopoietic and metabolic formulations.',
  },
  {
    name: 'Androgens / Steroids & Gynaec',
    slug: 'steroids-gynaec',
    description: 'Anabolic steroids, corticosteroids and gynaecological products.',
  },
  {
    name: 'Enzymes / Digestive Supplements',
    slug: 'enzymes-digestive',
    description: 'Digestive enzyme supplements and probiotic formulations for gastrointestinal health.',
  },
  {
    name: 'Anti Allergic / Antiasthmetics / Expectorants',
    slug: 'anti-allergic-expectorants',
    description: 'Antihistamines, antiasthmatics, expectorants and mucolytics for respiratory conditions.',
  },
  {
    name: 'Hyperacidity / Reflux / Ulcers',
    slug: 'hyperacidity-reflux-ulcers',
    description: 'Proton pump inhibitors, antacids and gastroprotective agents for acid-related disorders.',
  },
  {
    name: 'Anthelmintics',
    slug: 'anthelmintics',
    description: 'Broad-spectrum antiparasitic agents for treatment of worm infestations.',
  },
  {
    name: 'Ayurvedic Drug',
    slug: 'ayurvedic-drug',
    description: 'Traditional herbal and ayurvedic formulations for holistic healthcare.',
  },
  {
    name: 'Anti Emetics',
    slug: 'anti-emetics',
    description: 'Antiemetic drugs for prevention and treatment of nausea and vomiting.',
  },
  {
    name: 'Dental',
    slug: 'dental',
    description: 'Oral care and dental hygiene formulations.',
  },
  {
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Dermatological preparations for skin conditions, infections and care.',
  },
  {
    name: 'Injections',
    slug: 'injections',
    description: 'Injectable pharmaceutical preparations including antibiotics, vitamins and specialty drugs.',
  },
];

// ─── Products (all extracted from Rezichem brochure PDFs) ────────────────────
// Format: { name, slug, category, composition, dosage_form, description }
const products = [

  // ── ANTIBACTERIAL / ANTIMICROBIAL ──────────────────────────────────────────
  { name: 'REZOFF TAB', slug: 'rezoff-tab', category: 'antibacterial-antimicrobial', composition: 'Ofloxacin 200mg', dosage_form: 'Tablet', description: 'Fluoroquinolone antibiotic effective against gram-positive and gram-negative bacteria including respiratory, urinary and gastrointestinal infections.' },
  { name: 'REZOFF-OZ TAB', slug: 'rezoff-oz-tab', category: 'antibacterial-antimicrobial', composition: 'Ofloxacin 200mg & Ornidazole 500mg', dosage_form: 'Tablet', description: 'Combination of fluoroquinolone antibiotic and antiprotozoal agent. Effective against mixed bacterial and protozoal infections.' },
  { name: 'REZOFF-M SUSP', slug: 'rezoff-m-susp', category: 'antibacterial-antimicrobial', composition: 'Ofloxacin 50mg & Metronidazole 100mg', dosage_form: 'Suspension', description: 'Paediatric suspension combining Ofloxacin and Metronidazole for bacterial and protozoal gastrointestinal infections.' },
  { name: 'REZOFF-RD SUSP', slug: 'rezoff-rd-susp', category: 'antibacterial-antimicrobial', composition: 'Ofloxacin 50mg & Racecadotril 10mg', dosage_form: 'Suspension', description: 'Antibiotic combined with enkephalinase inhibitor for infective diarrhoea in children.' },
  { name: 'REZIMOX-CV 625 TAB', slug: 'rezimox-cv-625-tab', category: 'antibacterial-antimicrobial', composition: 'Amoxycillin 500mg & Clavulanic Acid 125mg', dosage_form: 'Tablet', description: 'Broad-spectrum penicillin combined with beta-lactamase inhibitor. Effective against resistant bacterial strains in respiratory, ENT and urinary infections.' },
  { name: 'REZIMOX-CV DRY SYP', slug: 'rezimox-cv-dry-syp', category: 'antibacterial-antimicrobial', composition: 'Amoxycillin 200mg & Clavulanic Acid 28.50mg', dosage_form: 'Dry Syrup', description: 'Paediatric dry syrup of Amoxicillin-Clavulanate combination for bacterial infections in children.' },
  { name: 'REZIMOX-CV DS DRY SYP', slug: 'rezimox-cv-ds-dry-syp', category: 'antibacterial-antimicrobial', composition: 'Amoxycillin 400mg & Clavulanic Acid 57mg', dosage_form: 'Dry Syrup', description: 'Double-strength paediatric dry syrup for more severe bacterial infections requiring higher dosing.' },
  { name: 'RIVOMAC-500 TAB', slug: 'rivomac-500-tab', category: 'antibacterial-antimicrobial', composition: 'Levofloxacin 500mg', dosage_form: 'Tablet', description: 'Third-generation fluoroquinolone with excellent activity against respiratory pathogens, urinary tract and skin infections.' },
  { name: 'RIVOMAC-OZ SYP', slug: 'rivomac-oz-syp', category: 'antibacterial-antimicrobial', composition: 'Levofloxacin 50mg & Ornidazole 125mg', dosage_form: 'Syrup', description: 'Paediatric combination of Levofloxacin with Ornidazole for mixed infections.' },
  { name: 'REZIFIX-100 TAB', slug: 'rezifix-100-tab', category: 'antibacterial-antimicrobial', composition: 'Cefixime 100mg', dosage_form: 'Tablet', description: 'Third-generation oral cephalosporin antibiotic for respiratory, urinary and enteric bacterial infections.' },
  { name: 'REZIFIX-200 TAB', slug: 'rezifix-200-tab', category: 'antibacterial-antimicrobial', composition: 'Cefixime 200mg + Lactobacillus 120 million spores', dosage_form: 'Tablet', description: 'Cefixime combined with Lactobacillus to prevent antibiotic-associated diarrhoea while treating bacterial infections.' },
  { name: 'REZIFIX-DS DRY SYP', slug: 'rezifix-ds-dry-syp', category: 'antibacterial-antimicrobial', composition: 'Cefixime 100mg', dosage_form: 'Dry Syrup', description: 'Paediatric dry syrup for bacterial infections including otitis media, pharyngitis and urinary tract infections.' },
  { name: 'REZIFIX-O TAB', slug: 'rezifix-o-tab', category: 'antibacterial-antimicrobial', composition: 'Cefixime 200mg & Ofloxacin 200mg', dosage_form: 'Tablet', description: 'Dual antibiotic combination offering broad-spectrum coverage against resistant organisms.' },
  { name: 'REZIFIX-O DRY SYP', slug: 'rezifix-o-dry-syp', category: 'antibacterial-antimicrobial', composition: 'Cefixime 50mg & Ofloxacin 50mg', dosage_form: 'Dry Syrup', description: 'Paediatric dual antibiotic dry syrup for mixed bacterial infections.' },
  { name: 'REZITHRAL-500 TAB', slug: 'rezithral-500-tab', category: 'antibacterial-antimicrobial', composition: 'Azithromycin 500mg', dosage_form: 'Tablet', description: 'Macrolide antibiotic for community-acquired pneumonia, sinusitis, skin and soft tissue infections.' },
  { name: 'REZITHRAL-250 TAB', slug: 'rezithral-250-tab', category: 'antibacterial-antimicrobial', composition: 'Azithromycin 250mg', dosage_form: 'Tablet', description: 'Macrolide antibiotic with excellent tissue penetration for respiratory and ENT infections.' },
  { name: 'REZITHRAL-XL SUSP', slug: 'rezithral-xl-susp', category: 'antibacterial-antimicrobial', composition: 'Azithromycin 200mg', dosage_form: 'Suspension', description: 'Paediatric azithromycin suspension for bacterial infections in children.' },
  { name: 'REZIDOX-200 TAB', slug: 'rezidox-200-tab', category: 'antibacterial-antimicrobial', composition: 'Cefpodoxime 200mg', dosage_form: 'Tablet', description: 'Third-generation oral cephalosporin for respiratory, urinary and skin infections.' },
  { name: 'REZIDOX DRY SYP', slug: 'rezidox-dry-syp', category: 'antibacterial-antimicrobial', composition: 'Cefpodoxime 50mg', dosage_form: 'Dry Syrup', description: 'Paediatric cefpodoxime suspension for bacterial infections in children.' },
  { name: 'REZIDOX-CV 325 TAB', slug: 'rezidox-cv-325-tab', category: 'antibacterial-antimicrobial', composition: 'Cefpodoxime 200mg + Clavulanic Acid 125mg', dosage_form: 'Tablet', description: 'Cefpodoxime with beta-lactamase inhibitor for resistant bacterial infections.' },
  { name: 'REZIDOX-CV DRY SYP', slug: 'rezidox-cv-dry-syp', category: 'antibacterial-antimicrobial', composition: 'Cefpodoxime 100mg & Clavulanic Acid 62.50mg', dosage_form: 'Dry Syrup', description: 'Paediatric combination antibiotic dry syrup for resistant bacterial infections.' },

  // ── NSAIDs / PAIN MANAGEMENT ───────────────────────────────────────────────
  { name: 'REZINAC-P TAB (Alu/Alu)', slug: 'rezinac-p-tab-alu', category: 'nsaids-pain-management', composition: 'Aceclofenac 100mg, Paracetamol 325mg', dosage_form: 'Tablet (Alu/Alu)', description: 'NSAID and analgesic combination for mild to moderate pain in arthritis, dental pain and post-operative pain.' },
  { name: 'REZINAC-P SYP', slug: 'rezinac-p-syp', category: 'nsaids-pain-management', composition: 'Aceclofenac 50mg, Paracetamol 125mg', dosage_form: 'Syrup', description: 'Paediatric analgesic and anti-inflammatory syrup for fever and pain management.' },
  { name: 'REZINAC-SP TAB', slug: 'rezinac-sp-tab', category: 'nsaids-pain-management', composition: 'Aceclofenac 100mg, Paracetamol 325mg, Serratiopeptidase 10mg', dosage_form: 'Tablet', description: 'Triple action tablet with NSAID, analgesic and enzyme for faster pain relief and reduction of swelling.' },
  { name: 'REZINAC-MR TAB', slug: 'rezinac-mr-tab', category: 'nsaids-pain-management', composition: 'Aceclofenac 100mg, Paracetamol 325mg, Chlorzoxazone 250mg', dosage_form: 'Tablet', description: 'NSAID combined with muscle relaxant for musculoskeletal pain, back pain and spasms.' },
  { name: 'REZINAC-P TAB (Blister)', slug: 'rezinac-p-tab-blister', category: 'nsaids-pain-management', composition: 'Aceclofenac 100mg, Paracetamol 325mg', dosage_form: 'Tablet (Blister)', description: 'NSAID and analgesic combination in blister pack for pain and fever management.' },
  { name: 'REZIPRAIN PLUS TAB', slug: 'reziprain-plus-tab', category: 'nsaids-pain-management', composition: 'Aceclofenac 100mg, Thiocolchicoside 4mg', dosage_form: 'Tablet', description: 'NSAID with muscle relaxant for acute musculoskeletal disorders and back pain.' },
  { name: 'REZIPRAIN FORTE TAB', slug: 'reziprain-forte-tab', category: 'nsaids-pain-management', composition: 'Aceclofenac 100mg, Thiocolchicoside 4mg, Paracetamol 325mg', dosage_form: 'Tablet', description: 'Triple combination of NSAID, muscle relaxant and analgesic for severe musculoskeletal pain.' },
  { name: 'REZIDASE OINT', slug: 'rezidase-oint', category: 'nsaids-pain-management', composition: 'Benzyl Alcohol 1%, Diclofenac Diethyl 1.16%, Linseed Oil 3.00%, Menthol 2%, Methyl Salicylate 10%', dosage_form: 'Ointment', description: 'Topical analgesic ointment for local application in joint pain, muscle pain and sports injuries.' },
  { name: 'REZIDASE PLUS TAB', slug: 'rezidase-plus-tab', category: 'nsaids-pain-management', composition: 'Diclofenac Potassium 50mg, Serratiopeptidase 10mg, Paracetamol 325mg', dosage_form: 'Tablet', description: 'Combination analgesic with enzyme for post-surgical pain, dental pain and inflammatory conditions.' },
  { name: 'REZICOX-T TAB', slug: 'rezicox-t-tab', category: 'nsaids-pain-management', composition: 'Etoricoxib 60mg, Thiocolchicoside 4mg', dosage_form: 'Tablet', description: 'COX-2 selective NSAID with muscle relaxant for osteoarthritis and musculoskeletal pain.' },
  { name: 'REZINIM-650 TAB', slug: 'rezinim-650-tab', category: 'nsaids-pain-management', composition: 'Paracetamol 650mg', dosage_form: 'Tablet', description: 'Effective analgesic and antipyretic for fever and mild to moderate pain.' },
  { name: 'REZINIM SYP', slug: 'rezinim-syp', category: 'nsaids-pain-management', composition: 'Paracetamol 250mg', dosage_form: 'Syrup', description: 'Paracetamol syrup for fever and pain management in children and adults.' },
  { name: 'REZINIM-P TAB', slug: 'rezinim-p-tab', category: 'nsaids-pain-management', composition: 'Nimesulide 100mg, Paracetamol 325mg', dosage_form: 'Tablet', description: 'COX-2 preferential NSAID with paracetamol for dysmenorrhoea, dental pain and post-operative pain.' },
  { name: 'RUTOZESIC TAB', slug: 'rutozesic-tab', category: 'nsaids-pain-management', composition: 'Trypsin 48mg, Bromelain 96mg, Rutoside 100mg', dosage_form: 'Tablet', description: 'Proteolytic enzyme combination for reducing oedema and inflammation in trauma and surgery.' },
  { name: 'REZISPAS TAB', slug: 'rezispas-tab', category: 'nsaids-pain-management', composition: 'Drotaverine HCl 80mg, Mefenamic Acid 250mg', dosage_form: 'Tablet', description: 'Antispasmodic combined with NSAID for abdominal cramps, dysmenorrhoea and renal colic.' },
  { name: 'REZIFLAM SUSP', slug: 'reziflam-susp', category: 'nsaids-pain-management', composition: 'Ibuprofen 100mg, Paracetamol 162.5mg', dosage_form: 'Suspension', description: 'Paediatric anti-inflammatory and analgesic suspension for fever and pain in children.' },

  // ── NUTRITION & VITAMINS ───────────────────────────────────────────────────
  { name: 'METHODISE PB TAB', slug: 'methodise-pb-tab', category: 'nutrition-vitamins', composition: 'Methylcobalamin 1500mcg, Pregabalin 75mg SR', dosage_form: 'Tablet', description: 'Neuroprotective combination of Methylcobalamin with Pregabalin for neuropathic pain and nerve damage.' },
  { name: 'METHODISE PLUS TAB', slug: 'methodise-plus-tab', category: 'nutrition-vitamins', composition: 'Methylcobalamin 1500mcg, Alpha Lipoic Acid 100mg, Folic Acid 1.5mg, Vitamin B1 10mg, Vitamin B6 3mg', dosage_form: 'Tablet', description: 'Comprehensive neurological health supplement with antioxidant support for peripheral neuropathy.' },
  { name: 'REZOSE CAP', slug: 'rezose-cap', category: 'nutrition-vitamins', composition: 'Ginseng extract 42.50mg, Nicotinamide 15mg, Vitamin C 6mg, Vitamin E 1.5mg, Multivitamins & Minerals', dosage_form: 'Softgel Capsule', description: 'Multivitamin and multimineral softgel capsule with Ginseng for daily nutritional needs and energy.' },
  { name: 'REZIFOL TAB', slug: 'rezifol-tab', category: 'nutrition-vitamins', composition: 'Folic Acid 5mg', dosage_form: 'Tablet', description: 'Folic acid supplement for prevention of neural tube defects and treatment of megaloblastic anaemia.' },
  { name: 'REXIFER-XT SYP', slug: 'rexifer-xt-syp', category: 'nutrition-vitamins', composition: 'Ferrous Ascorbate 30mg & Folic Acid 550mcg', dosage_form: 'Syrup', description: 'Iron and folic acid syrup for iron-deficiency anaemia in children and pregnant women.' },
  { name: 'REXIFER-XT TAB', slug: 'rexifer-xt-tab', category: 'nutrition-vitamins', composition: 'Ferrous Ascorbate 100mg, Folic Acid 1.5mg, Zinc 22.5mg', dosage_form: 'Tablet', description: 'Iron-folic acid-zinc combination for anaemia and micronutrient deficiency.' },
  { name: 'REXIFER SYP', slug: 'rexifer-syp', category: 'nutrition-vitamins', composition: 'Ferric Ammonium Citrate 200mg, Folic Acid 1mg, Vitamin B12 5mcg', dosage_form: 'Syrup', description: 'Haematinic syrup for iron deficiency anaemia and nutritional deficiencies.' },
  { name: 'REXIFER CAP', slug: 'rexifer-cap', category: 'nutrition-vitamins', composition: 'Elemental Iron 100mg, Folic Acid 1.5mg, Cyanocobalamin 10mcg, Selenium 65mcg, Zinc Sulphate Mono 61.8mg', dosage_form: 'Capsule', description: 'Comprehensive haematinic capsule with iron, folic acid, B12, zinc and selenium for anaemia management.' },
  { name: 'REZIPLEX DROP', slug: 'reziplex-drop', category: 'nutrition-vitamins', composition: 'Vitamin B1 0.75mg, Vitamin B2 0.75mg, Niacinamide 7.5mg, D-Panthenol 0.25mg, Vitamin E 1000mcg, Vitamin C 40mg, Vitamin A 2000mg, Manganese Sulphate 1.5mg', dosage_form: 'Drops', description: 'Multivitamin drops for infants and young children to meet daily nutritional requirements.' },
  { name: 'REZIPLEX SYP', slug: 'reziplex-syp', category: 'nutrition-vitamins', composition: 'Vitamin B1 2mg, Vitamin B2 3mg, Niacinamide 10mg, D-Panthenol 3mg, Vitamin E 5mg, Vitamin C 40mg, Vitamin A 3000mg, Vitamin D3 400 IU, Zinc Sulphate 0.6mg, Selenium 10mcg', dosage_form: 'Syrup', description: 'Comprehensive multivitamin and mineral syrup for children for growth and development.' },
  { name: 'REZIPLEX CAP', slug: 'reziplex-cap', category: 'nutrition-vitamins', composition: 'Multivitamins, Zinc Sulphate 10mg, Spirulina 25mg, Selenium 10mcg, Vitamin D3 400 IU', dosage_form: 'Capsule', description: 'Adult multivitamin capsule with spirulina and minerals for overall health and immunity.' },
  { name: 'REZIPLEX-L 100ML SYP', slug: 'reziplex-l-100-syp', category: 'nutrition-vitamins', composition: 'L-Lysine 150mg, Vitamin B3 45mg, Vitamin B1 10mg, Vitamin B6 3mg, D-Panthenol 20mg, Cyanocobalamin 5mg', dosage_form: 'Syrup (100ml)', description: 'L-Lysine enriched multivitamin syrup for appetite stimulation and growth in children.' },
  { name: 'REZIPLEX-L 200ML SYP', slug: 'reziplex-l-200-syp', category: 'nutrition-vitamins', composition: 'L-Lysine 150mg, Vitamin B3 45mg, Vitamin B1 10mg, Vitamin B6 3mg, D-Panthenol 20mg, Cyanocobalamin 5mg', dosage_form: 'Syrup (200ml)', description: 'Larger pack of L-Lysine enriched multivitamin syrup for appetite and growth support.' },
  { name: 'REZIPLEX PLUS SYP', slug: 'reziplex-plus-syp', category: 'nutrition-vitamins', composition: 'Lycopene 2000mcg, Zinc 3mg, Selenium 35mcg, Vitamin B1 5mg, Vitamin B2 5mg, Vitamin B6 1.5mg, Vitamin B12 1.5mcg, Folic Acid 0.5mg & Minerals', dosage_form: 'Syrup', description: 'Antioxidant-rich multivitamin syrup with Lycopene for immune support and cellular protection.' },
  { name: 'REZIPLEX PLUS CAP', slug: 'reziplex-plus-cap', category: 'nutrition-vitamins', composition: 'Lycopene 4800mcg, Vitamin A 400 IU, Vitamin E 8mg, Vitamin C 50mg, Zinc Sulphate 7.5mg, Selenium Dioxide 70mcg', dosage_form: 'Softgel Capsule', description: 'Antioxidant softgel capsule with Lycopene for men\'s health, cellular protection and immunity.' },
  { name: 'REZIPRO CAP', slug: 'rezipro-cap', category: 'nutrition-vitamins', composition: 'Probiotic & Prebiotic', dosage_form: 'Capsule', description: 'Probiotic and prebiotic capsule for restoration of normal gut flora and digestive health.' },
  { name: 'REZIPRO SACHET', slug: 'rezipro-sachet', category: 'nutrition-vitamins', composition: 'Lactobacillus Acidophilus 0.48gm, Lactobacillus Rhamnosus 0.48gm, Bifidobacterium Bifidum 0.48gm, Saccharomyces Boulardii 0.05gm, Fructooligosaccharide 300mg', dosage_form: 'Sachet', description: 'Multi-strain probiotic sachet for antibiotic-associated diarrhoea and restoration of gut microbiome.' },
  { name: 'REZICAL TAB', slug: 'rezical-tab', category: 'nutrition-vitamins', composition: 'Calcium Carbonate 1250mg, Vitamin D3 250 IU', dosage_form: 'Tablet', description: 'Calcium and Vitamin D3 supplement for bone health, osteoporosis prevention and calcium deficiency.' },
  { name: 'REZICAL PLUS TAB', slug: 'rezical-plus-tab', category: 'nutrition-vitamins', composition: 'Calcium Citrate 1000mg, Vitamin D3 200 IU, Magnesium 100mg, Zinc Sulphate 10mg', dosage_form: 'Tablet', description: 'Advanced bone health supplement with better-absorbed Calcium Citrate, Magnesium and Zinc.' },
  { name: 'REZICAL-K2 TAB', slug: 'rezical-k2-tab', category: 'nutrition-vitamins', composition: 'Calcitriol 0.25mcg, Calcium Citrate Malate 1250mg, DHA 10mg, Zinc 4mg, Vitamin K2-7 90mcg, Cyanocobalamin 100mg, Magnesium Hydroxide 50mg', dosage_form: 'Tablet', description: 'Complete bone health tablet with Vitamin K2-7 to direct calcium to bones and prevent arterial calcification.' },
  { name: 'REZIVIT POWDER', slug: 'rezivit-powder', category: 'nutrition-vitamins', composition: 'Protein, Zinc, Minerals with DHA — Swiss Chocolate Flavour', dosage_form: 'Powder', description: 'Nutritional protein powder with DHA and minerals in Swiss chocolate flavour for complete nutrition.' },
  { name: 'REZIVIT GOLD POWDER', slug: 'rezivit-gold-powder', category: 'nutrition-vitamins', composition: 'Protein, Cyanocobalamin with DHA & Lycopene — Dry Fruits Flavour', dosage_form: 'Powder', description: 'Premium nutritional powder with protein, DHA, Lycopene and B12 in dry fruits flavour.' },
  { name: 'ENERZION POWDER', slug: 'enerzion-powder', category: 'nutrition-vitamins', composition: 'Dextrose 17.5gm, Sucrose 14gm, Zinc Sulphate 32.5mg, Ascorbic Acid 50mg', dosage_form: 'Powder', description: 'Oral rehydration and energy supplement with dextrose, sucrose, zinc and Vitamin C.' },

  // ── ANDROGENS / STEROIDS & GYNAEC ──────────────────────────────────────────
  { name: 'REZIFLU TAB', slug: 'reziflu-tab', category: 'steroids-gynaec', composition: 'Fluconazole 150mg', dosage_form: 'Tablet', description: 'Antifungal agent for vaginal candidiasis, oral thrush and other fungal infections.' },
  { name: 'REZICORT-6 TAB', slug: 'rezicort-6-tab', category: 'steroids-gynaec', composition: 'Deflazacort 6mg', dosage_form: 'Tablet', description: 'Corticosteroid with fewer metabolic side effects for inflammatory and autoimmune conditions.' },
  { name: 'REZICORT SYP', slug: 'rezicort-syp', category: 'steroids-gynaec', composition: 'Deflazacort 6mg', dosage_form: 'Syrup', description: 'Paediatric Deflazacort syrup for inflammatory, allergic and autoimmune disorders in children.' },

  // ── ENZYMES / DIGESTIVE SUPPLEMENTS ───────────────────────────────────────
  { name: 'REZIZYME 200ML SYP', slug: 'rezizyme-200-syp', category: 'enzymes-digestive', composition: 'Fungal Diastase 50mg, Pepsin 10mg, Vitamin B Complex', dosage_form: 'Syrup (200ml)', description: 'Digestive enzyme syrup with Fungal Diastase, Pepsin and Vitamin B Complex for indigestion and poor appetite.' },
  { name: 'REZIZYME 100ML SYP', slug: 'rezizyme-100-syp', category: 'enzymes-digestive', composition: 'Fungal Diastase 50mg, Pepsin 10mg, Vitamin B Complex', dosage_form: 'Syrup (100ml)', description: 'Digestive enzyme syrup for improved digestion and nutrient absorption.' },
  { name: 'REZIZYME DROP', slug: 'rezizyme-drop', category: 'enzymes-digestive', composition: 'Alpha Amylase 20mg, Papain 10mg, Dill Oil 2mg, Anise Oil 2mg, Caraway Oil 2mg', dosage_form: 'Drops', description: 'Digestive enzyme drops with carminative oils for infantile colic, flatulence and digestive discomfort.' },

  // ── ANTI ALLERGIC / ANTIASTHMETICS / EXPECTORANTS ─────────────────────────
  { name: 'REZISTROL SYP', slug: 'rezistrol-syp', category: 'anti-allergic-expectorants', composition: 'Cyproheptadine HCl 2mg, Tricholine Citrate 275mg, Sorbitol Base', dosage_form: 'Syrup', description: 'Appetite stimulant and antihistamine syrup with Cyproheptadine for poor appetite and allergic conditions.' },
  { name: 'REZICET-M TAB', slug: 'rezicet-m-tab', category: 'anti-allergic-expectorants', composition: 'Levocetirizine 5mg, Montelukast 10mg', dosage_form: 'Tablet', description: 'Combination antihistamine and leukotriene antagonist for allergic rhinitis, urticaria and asthma prevention.' },
  { name: 'REZICET-M SYP', slug: 'rezicet-m-syp', category: 'anti-allergic-expectorants', composition: 'Levocetirizine 2.5mg, Montelukast 4mg', dosage_form: 'Syrup', description: 'Paediatric antiallergic syrup for allergic rhinitis and asthma prophylaxis in children.' },
  { name: 'REZICOF SYP 60/100ML', slug: 'rezicof-syp', category: 'anti-allergic-expectorants', composition: 'Dextromethorphan 15mg, Chlorpheniramine Maleate 2mg, Phenylephrine HCl 5mg', dosage_form: 'Syrup (Sugar Free)', description: 'Non-narcotic cough suppressant with antihistamine and decongestant for dry cough and cold.' },
  { name: 'REZICOF-BM SYP 100ML', slug: 'rezicof-bm-syp', category: 'anti-allergic-expectorants', composition: 'Bromohexine 2mg, Terbutaline 1.25mg, Guaiphensin 50mg', dosage_form: 'Syrup (100ml)', description: 'Mucolytic and bronchodilator combination for productive cough with bronchospasm.' },
  { name: 'REZICOF-AM SYP 60/100ML', slug: 'rezicof-am-syp', category: 'anti-allergic-expectorants', composition: 'Ambroxol HCl 15mg, Terbutaline 1.25mg, Guaiphensin 50mg', dosage_form: 'Syrup', description: 'Expectorant with bronchodilator for cough with thick mucus and bronchospasm.' },
  { name: 'REZICOF-LS SYP 60/100ML', slug: 'rezicof-ls-syp', category: 'anti-allergic-expectorants', composition: 'Ambroxol HCl 30mg, Levosalbutamol 1.0mg, Guaiphensin 50mg', dosage_form: 'Syrup', description: 'Mucolytic with long-acting bronchodilator for chronic obstructive airway disease and productive cough.' },
  { name: 'REZIVERT TAB', slug: 'rezivert-tab', category: 'anti-allergic-expectorants', composition: 'Betahistine 16mg', dosage_form: 'Tablet', description: 'Histamine analogue for vertigo, tinnitus and Meniere\'s disease.' },
  { name: 'REZICOLD TAB', slug: 'rezicold-tab', category: 'anti-allergic-expectorants', composition: 'Paracetamol 500mg, Phenylephrine 5mg, Chlorpheniramine Maleate 2mg, Caffeine 30mg', dosage_form: 'Tablet', description: 'Cold and flu tablet combining antipyretic, decongestant, antihistamine and caffeine.' },
  { name: 'REZICOLD SYP', slug: 'rezicold-syp', category: 'anti-allergic-expectorants', composition: 'Chlorpheniramine Maleate 1mg, Phenylephrine 2.5mg, Paracetamol 125mg', dosage_form: 'Syrup', description: 'Paediatric cold and fever syrup with antihistamine, decongestant and antipyretic.' },

  // ── HYPERACIDITY / REFLUX / ULCERS ─────────────────────────────────────────
  { name: 'REZITOP-40 TAB', slug: 'rezitop-40-tab', category: 'hyperacidity-reflux-ulcers', composition: 'Pantoprazole 40mg', dosage_form: 'Tablet', description: 'Proton pump inhibitor for peptic ulcer disease, GERD and Zollinger-Ellison syndrome.' },
  { name: 'REZITOP-D TAB', slug: 'rezitop-d-tab', category: 'hyperacidity-reflux-ulcers', composition: 'Pantoprazole 40mg, Domperidone 10mg', dosage_form: 'Tablet', description: 'PPI with prokinetic agent for GERD with regurgitation and functional dyspepsia.' },
  { name: 'REZITOP DSR CAP', slug: 'rezitop-dsr-cap', category: 'hyperacidity-reflux-ulcers', composition: 'Pantoprazole 40mg, Domperidone 30mg (DSR)', dosage_form: 'Capsule', description: 'Delayed-release PPI with sustained-release prokinetic for effective 24-hour acid control and motility improvement.' },
  { name: 'REZIB-LV CAP', slug: 'rezib-lv-cap', category: 'hyperacidity-reflux-ulcers', composition: 'Rabeprazole 20mg, Levosulpride 75mg (SR)', dosage_form: 'Capsule', description: 'Rabeprazole with Levosulpride for GERD, functional dyspepsia and delayed gastric emptying.' },
  { name: 'REZIB DSR CAP', slug: 'rezib-dsr-cap', category: 'hyperacidity-reflux-ulcers', composition: 'Rabeprazole 20mg, Domperidone 30mg (DSR)', dosage_form: 'Capsule', description: 'Combination of Rabeprazole and Domperidone for comprehensive management of acid reflux and nausea.' },
  { name: 'REZIB-20 TAB', slug: 'rezib-20-tab', category: 'hyperacidity-reflux-ulcers', composition: 'Rabeprazole 20mg', dosage_form: 'Tablet', description: 'Proton pump inhibitor for gastric and duodenal ulcer treatment and acid-related disorders.' },
  { name: 'REZICID GEL SUSP', slug: 'rezicid-gel-susp', category: 'hyperacidity-reflux-ulcers', composition: 'Aluminium Hydroxide 0.291gm, Magnesium Hydroxide 98mg, Oxetacaine 10mg', dosage_form: 'Gel Suspension (Sugar Free)', description: 'Antacid gel suspension with local anaesthetic for immediate relief from acidity and heartburn.' },
  { name: 'REZIPRAZ-DSR CAP', slug: 'rezipraz-dsr-cap', category: 'hyperacidity-reflux-ulcers', composition: 'Esomeprazole 40mg, Domperidone 30mg (DSR)', dosage_form: 'Capsule (Mono Pack)', description: 'S-isomer of Omeprazole with Domperidone for superior acid suppression and motility improvement.' },
  { name: 'REZIPRAZ-LV CAP', slug: 'rezipraz-lv-cap', category: 'hyperacidity-reflux-ulcers', composition: 'Esomeprazole 40mg, Levosulpride 75mg (SR)', dosage_form: 'Capsule', description: 'Esomeprazole with Levosulpride for GERD and functional gastrointestinal disorders.' },
  { name: 'REZICID-O SYP', slug: 'rezicid-o-syp', category: 'hyperacidity-reflux-ulcers', composition: 'Sucralfate 1gm, Oxetacaine 20mg', dosage_form: 'Syrup (Sugar Free)', description: 'Mucosal protectant with local anaesthetic for peptic ulcers and oesophagitis.' },

  // ── ANTHELMINTICS ───────────────────────────────────────────────────────────
  { name: 'REZBEND TAB', slug: 'rezbend-tab', category: 'anthelmintics', composition: 'Albendazole 400mg + Ivermectin 6mg', dosage_form: 'Tablet', description: 'Broad-spectrum anthelmintic combination for roundworms, tapeworms, filaria and other parasitic infections.' },
  { name: 'REZBEND SUSP', slug: 'rezbend-susp', category: 'anthelmintics', composition: 'Albendazole 200mg + Ivermectin 3mg', dosage_form: 'Suspension', description: 'Paediatric anthelmintic suspension for worm infestations in children.' },

  // ── AYURVEDIC DRUG ─────────────────────────────────────────────────────────
  { name: 'REZILIV 200ML SYP', slug: 'reziliv-200-syp', category: 'ayurvedic-drug', composition: 'Herbal Liver Tonic', dosage_form: 'Syrup (200ml)', description: 'Herbal liver tonic for liver protection, detoxification and management of hepatic disorders.' },
  { name: 'REZILIV 100ML SYP', slug: 'reziliv-100-syp', category: 'ayurvedic-drug', composition: 'Herbal Liver Tonic', dosage_form: 'Syrup (100ml)', description: 'Herbal liver tonic for liver health maintenance and protection against hepatotoxins.' },
  { name: 'REZILIV-XL SYP', slug: 'reziliv-xl-syp', category: 'ayurvedic-drug', composition: 'Silymarin 35mg, L-Ornithine L-Aspartate 150mg, Inositol 10mg, Racemethionine 50mg, Taurine 50mg, Lecithin 125mg, Tricholine Citrate 500mg, Folic Acid 150mg, D-Panthenol 5mg', dosage_form: 'Syrup', description: 'Advanced hepatoprotective syrup with Silymarin and amino acids for alcoholic liver disease and fatty liver.' },
  { name: 'REZITONE SYP', slug: 'rezitone-syp', category: 'ayurvedic-drug', composition: 'Herbal formulation for Leucorrhoea', dosage_form: 'Syrup', description: 'Ayurvedic herbal syrup for management of leucorrhoea and female reproductive health.' },
  { name: 'ADNATE OIL', slug: 'adnate-oil', category: 'ayurvedic-drug', composition: 'Herbal formulation for Orthoritis', dosage_form: 'Oil', description: 'Herbal oil for external application in arthritis, joint pain and orthopaedic conditions.' },
  { name: 'KOFMADHU SYP', slug: 'kofmadhu-syp', category: 'ayurvedic-drug', composition: 'Madhu (Honey), Haldi (Turmeric) & Tulsi (Basil)', dosage_form: 'Syrup', description: 'Traditional herbal cough syrup with Honey, Turmeric and Tulsi for soothing throat irritation.' },
  { name: 'FLAYMES OIL', slug: 'flaymes-oil', category: 'ayurvedic-drug', composition: 'Herbal Pain Reliever Oil', dosage_form: 'Oil', description: 'Herbal pain reliever oil for local application in muscle and joint pain.' },

  // ── ANTI EMETICS ───────────────────────────────────────────────────────────
  { name: 'REZISTRON TAB', slug: 'rezistron-tab', category: 'anti-emetics', composition: 'Ondansetron HCl 4mg', dosage_form: 'Tablet', description: 'Selective 5-HT3 antagonist for prevention of chemotherapy-induced and post-operative nausea and vomiting.' },
  { name: 'REZISTRON SYP/DROP', slug: 'rezistron-syp-drop', category: 'anti-emetics', composition: 'Ondansetron HCl 2mg', dosage_form: 'Syrup / Drops', description: 'Paediatric Ondansetron preparation for nausea and vomiting in children.' },

  // ── DENTAL ─────────────────────────────────────────────────────────────────
  { name: 'REZIFRESH MOUTHWASH', slug: 'rezifresh-mouthwash', category: 'dental', composition: 'Chlorhexidine Gluconate 0.2%, Sodium Fluoride 0.05%, Zinc Chloride 0.09%', dosage_form: 'Mouthwash', description: 'Antiseptic mouthwash with Chlorhexidine for prevention of plaque, gingivitis and dental infections.' },

  // ── SKIN CARE ──────────────────────────────────────────────────────────────
  { name: 'KITOZOLE TAB', slug: 'kitozole-tab', category: 'skin-care', composition: 'Itraconazole 100mg', dosage_form: 'Tablet', description: 'Broad-spectrum oral antifungal for onychomycosis, dermatophytosis, candidiasis and pityriasis versicolor.' },
  { name: 'KITOZOLE SHAMPOO', slug: 'kitozole-shampoo', category: 'skin-care', composition: 'Ketoconazole 2.0%', dosage_form: 'Shampoo', description: 'Antifungal shampoo for dandruff, seborrhoeic dermatitis and tinea capitis.' },
  { name: 'QNR CREAM', slug: 'qnr-cream', category: 'skin-care', composition: 'Hydroquinone 2%, Tretinoin 0.025%, Mometasone Furoate 0.1%', dosage_form: 'Cream', description: 'Depigmenting cream for melasma, hyperpigmentation and uneven skin tone.' },
  { name: 'QNR FACE WASH', slug: 'qnr-face-wash', category: 'skin-care', composition: 'Aloevera with Neem & Tulsi', dosage_form: 'Face Wash', description: 'Herbal face wash with Aloe vera, Neem and Tulsi for daily skin cleansing and acne prevention.' },
  { name: 'QNR HAND SANITIZER', slug: 'qnr-hand-sanitizer', category: 'skin-care', composition: 'Alcohol-based Hand Sanitizer', dosage_form: 'Hand Sanitizer', description: 'Alcohol-based hand sanitizer for effective hand hygiene and protection against germs.' },

  // ── INJECTIONS ─────────────────────────────────────────────────────────────
  { name: 'REZITRAX-250 MG', slug: 'rezitrax-250-inj', category: 'injections', composition: 'Ceftriaxone 250mg', dosage_form: 'Injection', description: 'Third-generation cephalosporin injection for severe bacterial infections in paediatric patients.' },
  { name: 'REZITRAX-500 MG', slug: 'rezitrax-500-inj', category: 'injections', composition: 'Ceftriaxone 500mg', dosage_form: 'Injection', description: 'Ceftriaxone injection for moderate to severe bacterial infections.' },
  { name: 'REZITRAX-1000 MG', slug: 'rezitrax-1000-inj', category: 'injections', composition: 'Ceftriaxone 1000mg', dosage_form: 'Injection', description: 'High-dose Ceftriaxone injection for serious bacterial infections, meningitis and septicaemia.' },
  { name: 'REZITRAX-S 375 MG', slug: 'rezitrax-s-375-inj', category: 'injections', composition: 'Ceftriaxone 250mg & Sulbactam 125mg', dosage_form: 'Injection', description: 'Ceftriaxone with beta-lactamase inhibitor for infections caused by resistant organisms.' },
  { name: 'REZITRAX-S 1.5 GM', slug: 'rezitrax-s-1-5-inj', category: 'injections', composition: 'Ceftriaxone Sodium 1000mg & Sulbactam 500mg', dosage_form: 'Injection', description: 'High-dose combination injection for severe and resistant bacterial infections in hospital settings.' },
  { name: 'REZITRAX-T 281.25 MG', slug: 'rezitrax-t-281-inj', category: 'injections', composition: 'Ceftriaxone Sodium 250mg + Tazobactam 31.25mg', dosage_form: 'Injection', description: 'Ceftriaxone with Tazobactam for extended-spectrum beta-lactamase producing organism infections.' },
  { name: 'REZITRAX-T 1.125 GM', slug: 'rezitrax-t-1125-inj', category: 'injections', composition: 'Ceftriaxone Sodium 1000mg + Tazobactam 125mg', dosage_form: 'Injection', description: 'High-dose Ceftriaxone-Tazobactam combination for serious hospital-acquired infections.' },
  { name: 'REZIZONE-1 GM', slug: 'rezizone-1-inj', category: 'injections', composition: 'Cefoperazone 1 GM', dosage_form: 'Injection', description: 'Third-generation cephalosporin injection for hospital-acquired infections and pseudomonal infections.' },
  { name: 'REZIZONE-1.5 GM', slug: 'rezizone-1-5-inj', category: 'injections', composition: 'Cefoperazone 1000mg & Sulbactam 500mg', dosage_form: 'Injection', description: 'Cefoperazone-Sulbactam combination for severe polymicrobial and resistant infections.' },
  { name: 'METHODISE INJ', slug: 'methodise-inj', category: 'injections', composition: 'Methylcobalamin 1500mcg', dosage_form: 'Injection', description: 'Active form of Vitamin B12 injection for peripheral neuropathy, diabetic neuropathy and B12 deficiency.' },
  { name: 'METHODIZE PLUS INJ', slug: 'methodize-plus-inj', category: 'injections', composition: 'Methylcobalamin 1000mcg, Pyridoxine HCl IP 100mg, Nicotinamide IP 10mg, Benzyl Alcohol 2% w/v', dosage_form: 'Injection', description: 'B-vitamin combination injection for neuropathy, neuritis and vitamin B deficiency states.' },
  { name: 'REZISTRON INJ', slug: 'rezistron-inj', category: 'injections', composition: 'Ondansetron HCl 2mg', dosage_form: 'Injection', description: 'Injectable antiemetic for chemotherapy, radiotherapy and post-operative nausea and vomiting.' },
  { name: 'REZITOP INJ', slug: 'rezitop-inj', category: 'injections', composition: 'Pantoprazole 40mg', dosage_form: 'Injection', description: 'IV proton pump inhibitor for severe acid-related disorders, stress ulcer prophylaxis and GI bleeding.' },
  { name: 'REZILONE-25 INJ', slug: 'rezilone-25-inj', category: 'injections', composition: 'Nandrolone Decanoate 25mg', dosage_form: 'Injection', description: 'Anabolic steroid injection for anaemia of renal failure, osteoporosis and muscle wasting conditions.' },
  { name: 'REZILONE-50 INJ', slug: 'rezilone-50-inj', category: 'injections', composition: 'Nandrolone Decanoate 50mg', dosage_form: 'Injection', description: 'Higher dose anabolic steroid injection for severe muscle wasting, aplastic anaemia and osteoporosis.' },
  { name: 'REZIDASE-AQ INJ', slug: 'rezidase-aq-inj', category: 'injections', composition: 'Diclofenac 75mg', dosage_form: 'Injection', description: 'Injectable NSAID for acute pain management in post-operative and musculoskeletal conditions.' },
];

// ─── Seed function ─────────────────────────────────────────────────────────────
async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('🌱 Starting seed...\n');

    // Insert categories
    const catIdMap = {};
    let catCount = 0;
    for (const cat of categories) {
      const res = await client.query(
        `INSERT INTO categories (name, slug, description, image_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
           SET name = EXCLUDED.name,
               description = EXCLUDED.description,
               image_url = EXCLUDED.image_url
         RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.image_url ?? DEFAULT_CATEGORY_IMAGE_URL]
      );
      catIdMap[cat.slug] = res.rows[0].id;
      catCount++;
    }
    console.log(`✅ ${catCount} categories seeded`);

    // Insert products
    let prodCount = 0;
    let skipped = 0;
    for (const p of products) {
      const catId = catIdMap[p.category];
      if (!catId) {
        console.warn(`  ⚠️  Category not found: "${p.category}" for product "${p.name}"`);
        skipped++;
        continue;
      }
      await client.query(
        `INSERT INTO products (name, slug, category_id, composition, dosage_form, description, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (category_id, slug) DO UPDATE
           SET name = EXCLUDED.name,
               composition = EXCLUDED.composition,
               dosage_form = EXCLUDED.dosage_form,
               description = EXCLUDED.description,
               image_url = EXCLUDED.image_url`,
        [p.name, p.slug, catId, p.composition, p.dosage_form, p.description, p.image_url ?? DEFAULT_PRODUCT_IMAGE_URL]
      );
      prodCount++;
    }
    console.log(`✅ ${prodCount} products seeded${skipped ? ` (${skipped} skipped)` : ''}`);

    await client.query('COMMIT');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   Categories : ${catCount}`);
    console.log(`   Products   : ${prodCount}`);
    console.log('\n   You can now run: npm run dev\n');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seed failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
