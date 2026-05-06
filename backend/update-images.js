/**
 * Script to update restaurant and menu item images from the public/images folder
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');
const MenuItem = require('./src/models/MenuItem');

// Image mapping for all 14 restaurants
const restaurantImages = {
  'Pizza Palace': '/images/restaurants/Restorent 1.jpg',
  'Burger Town': '/images/restaurants/R2.png',
  'Sushi Express': '/images/restaurants/r3.jpg',
  'The Biryani House': '/images/restaurants/r4.png',
  'Thai Orchid': '/images/restaurants/r5.webp',
  'BBQ Paradise': '/images/restaurants/r6.jpg',
  'Vegan Green': '/images/restaurants/r7.jpg',
  'Pasta Prime': '/images/restaurants/r8.webp',
  'Red Oven 1': '/images/restaurants/rr8.webp',
  'Blue Spoon 2': '/images/restaurants/rr9.jpg',
  'Green Fork 3': '/images/restaurants/r10.jpg',
  'Golden Wok 4': '/images/restaurants/rr10.jpg',
  'Silver Grill 5': '/images/restaurants/rr11.jpg',
  'Urban Tiffin 6': '/images/restaurants/rr12.webp',
};

const menuItemImages = {
  'Margherita Pizza': '/images/menu-items/Margherita Pizza.jpg',
  'Pepperoni Pizza': '/images/menu-items/Pepperoni Pizza.jpg',
  'Vegetarian Pizza': '/images/menu-items/Vegetarian Pizza.webp',
  'Spaghetti Carbonara': '/images/menu-items/Spaghetti Carbonara.webp',
  'Garlic Bread': '/images/menu-items/Garlic Bread.webp',
  'Classic Cheeseburger': '/images/menu-items/Classic Cheeseburger.jpg',
  'Double Patty Burger': '/images/menu-items/Double Patty Burger.webp',
  'Chicken Burger': '/images/menu-items/Chicken Burger.webp',
  'French Fries': '/images/menu-items/French Fries.jpg',
  'Coke': '/images/menu-items/coke.jpg',
  'California Roll': '/images/menu-items/California Roll.webp',
  'Salmon Sushi': '/images/menu-items/Salmon Sushi.jpg',
  'Vegetable Sushi': '/images/menu-items/Vegetable Sushie.jpg',
  'Ramen': '/images/menu-items/Ramen.jpg',
  'Miso Soup': '/images/menu-items/Miso Soup.webp',
  'Chicken Biryani': '/images/menu-items/Chicken Biryani.jpg',
  'Mutton Biryani': '/images/menu-items/Mutton Biryani.jpg',
  'Green Curry': '/images/menu-items/Green Curry.jpg',
  'Tom Yum Soup': '/images/menu-items/Tom Yum Soup.webp',
  'Pad Thai': '/images/menu-items/Pad Thai.jpg',
  'Spring Rolls': '/images/menu-items/Spring Rolls.webp',
  'Sticky Rice': '/images/menu-items/Sticky Rice.jpg',
  'Paneer Tikka Masala': '/images/menu-items/Paneer-Tikka-Masala-3.jpg',
  'Naan Bread': '/images/menu-items/Naan Bread.webp',
  'Butter Chicken': '/images/menu-items/Butter Chicken.jpg',
  'House Special': '/images/menu-items/House Special.jpg',
  'Starter Platter': '/images/menu-items/Starter Platter.jpeg',
  'Signature Salad': '/images/menu-items/Signature Salad.webp',
  'Dessert Delight': '/images/menu-items/Dessert Delight.avif',
  'Green Smoothie': '/images/menu-items/beverages.webp',
};

async function updateImages() {
  try {
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Update restaurant images
    console.log('\n🍽️ Updating restaurant images...');
    for (const [restaurantName, imagePath] of Object.entries(restaurantImages)) {
      const updated = await Restaurant.findOneAndUpdate(
        { name: restaurantName },
        { image: imagePath },
        { new: true }
      );
      if (updated) {
        console.log(`✓ Updated ${restaurantName}`);
      }
    }

    // Update menu item images
    console.log('\n🍔 Updating menu item images...');
    for (const [itemName, imagePath] of Object.entries(menuItemImages)) {
      const updated = await MenuItem.findOneAndUpdate(
        { name: itemName },
        { image: imagePath },
        { new: true }
      );
      if (updated) {
        console.log(`✓ Updated ${itemName}`);
      }
    }

    console.log('\n✅ All images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

updateImages();
