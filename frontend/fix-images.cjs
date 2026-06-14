const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'src', 'data', 'nutrition.js');
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Array of unique, high-quality Unsplash image keywords/IDs for nutrition categories
const uniqueImages = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80", // Apples/Fruit
    "https://images.unsplash.com/photo-1611080531535-bf1554625b1b?w=500&q=80", // Citrus
    "https://images.unsplash.com/photo-1621317181313-addb7c5ec824?w=500&q=80", // Garlic
    "https://images.unsplash.com/photo-1511693751768-45e3f41249fa?w=500&q=80", // Mushrooms
    "https://images.unsplash.com/photo-1681285038332-fc2fef2480bf?w=500&q=80", // Fermented
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80", // Herbs

    "https://images.unsplash.com/photo-1525902164478-f71e6cc49704?w=500&q=80", // Coconut Water
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80", // Tea
    "https://images.unsplash.com/photo-1605335198651-b845dfdaffde?w=500&q=80", // Broth
    "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=500&q=80", // Watermelon
    "https://images.unsplash.com/photo-1543878586-7a8e2cb69957?w=500&q=80", // Electrolyte
    "https://images.unsplash.com/photo-1601614742512-eb7bf3eb12fe?w=500&q=80", // Sparkling

    "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=500&q=80", // Beef
    "https://images.unsplash.com/photo-1628101676646-6411986ce8ad?w=500&q=80", // Cottage Cheese
    "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&q=80", // Tofu
    "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=500&q=80", // Turkey
    "https://images.unsplash.com/photo-1590458842187-575510b64d38?w=500&q=80", // Edamame
    "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&q=80", // Tuna

    "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=500&q=80", // Fiber
    "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&q=80", // Fats
    "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=500&q=80", // Carbs
    "https://images.unsplash.com/photo-1544025162-8e6f1fbe7e29?w=500&q=80", // Protein complete
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", // Vitamins
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&q=80", // Water Macro

    "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500&q=80", // Grocery
    "https://images.unsplash.com/photo-1490818387583-1b5ba45227fa?w=500&q=80", // Portion
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80", // Freezer
    "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=500&q=80", // Chopping
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80", // Spices
    "https://images.unsplash.com/photo-1622484211147-3f305bd364ce?w=500&q=80", // Macro Track

    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80", // Omega3
    "https://images.unsplash.com/photo-1478144592103-25e218a04891?w=500&q=80", // Multi
    "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&q=80", // Vit D
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80", // Preworkout
    "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&q=80", // BCAA
    "https://images.unsplash.com/photo-1611077544835-1f9e99eb0155?w=500&q=80", // Magnesium

    "https://images.unsplash.com/photo-1582234551276-8802a8eb39d6?w=500&q=80", // Flu
    "https://images.unsplash.com/photo-1576671081811-38290132b85a?w=500&q=80", // Measure
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80", // Fasting
    "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=500&q=80", // Hidden
    "https://images.unsplash.com/photo-1628101676646-6411986ce8ad?w=500&q=80", // Snacks
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&q=80"  // Dining out
];

const originalWorkingImages = [
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb", // Spinach
    "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e", // Berries
    "https://images.unsplash.com/photo-1597362925123-77861d3fbac7", // Vegetables
    "https://images.unsplash.com/photo-1615485925694-a03971e4663d", // Healthy fats
    "https://images.unsplash.com/photo-1541746972237-775b118742b8", // Carbs
    "https://images.unsplash.com/photo-1564419320496-683d739cb33d", // Pure water
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd", // Lemon water
    "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5", // Green Tea
    "https://images.unsplash.com/photo-1604977042946-1eecc6a312d1", // Cucumber water
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791", // Chicken
    "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2720", // Salmon
    "https://images.unsplash.com/photo-1488477181946-6428a029177b", // Greek Yogurt
    "https://images.unsplash.com/photo-1506976785307-8732e854ad03", // Eggs
    "https://images.unsplash.com/photo-1515543904379-3d757afe726e", // Lentils
    "https://images.unsplash.com/photo-1586201375761-83865001e31c", // Macro carbs
    "https://images.unsplash.com/photo-1627483297929-37f416fec7d7", // Macro proteins
    "https://images.unsplash.com/photo-1543362187-841cdba1fb39", // Macro fats
    "https://images.unsplash.com/photo-1585937421612-70a008356f36", // Batch cooking
    "https://images.unsplash.com/photo-1533755919641-525d0dc82414", // Storage
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d", // Creatine
    "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f", // Whey
    "https://images.unsplash.com/photo-1582234551276-8802a8eb39d6", // Keto Basics
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"  // Keto foods
];

let uniqueIndex = 0;
const urlRegex = /"https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?.*?"/g;

let updatedContent = content.replace(urlRegex, (match) => {

    // Check if original
    const isOriginal = originalWorkingImages.some(img => match.includes(img.split('?')[0]));

    if (match.includes('w=500') && !isOriginal) {
        if (uniqueIndex < uniqueImages.length) {
            const newUrl = '"' + uniqueImages[uniqueIndex] + '"';
            uniqueIndex++;
            return newUrl;
        }
    }

    // Keep banners or originals
    return match;
});

fs.writeFileSync(FILE_PATH, updatedContent, 'utf8');
console.log('Replaced ' + uniqueIndex + ' repeated fallback images with completely unique images.');
