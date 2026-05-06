/**
 * Sample data seeding script
 * Run this after starting MongoDB and connecting to the database
 * This creates sample restaurants, menu items, and users for testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Restaurant = require('./src/models/Restaurant');
const MenuItem = require('./src/models/MenuItem');

// Helper function to get image path for menu items
const getMenuItemImage = (itemName) => {
  const nameToImageMap = {
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
    'Miso Soup': '/images/menu-items/Miso Soup.webp',
    'Ramen': '/images/menu-items/Ramen.jpg',
    'Chicken Biryani': '/images/menu-items/Chicken Biryani.jpg',
    'Mutton Biryani': '/images/menu-items/Mutton Biryani.jpg',
    'Naan Bread': '/images/menu-items/Naan Bread.webp',
    'Butter Chicken': '/images/menu-items/Butter Chicken.jpg',
    'Green Curry': '/images/menu-items/Green Curry.jpg',
    'Pad Thai': '/images/menu-items/Pad Thai.jpg',
    'Tom Yum Soup': '/images/menu-items/Tom Yum Soup.webp',
    'Sticky Rice': '/images/menu-items/Sticky Rice.jpg',
    'Grilled Chicken': '/images/menu-items/French Fries.jpg',
    'BBQ Ribs': '/images/menu-items/French Fries.jpg',
    'BBQ Brisket': '/images/menu-items/French Fries.jpg',
    'Corn on Cob': '/images/menu-items/French Fries.jpg',
    'Grilled Fish': '/images/menu-items/French Fries.jpg',
    'Quinoa Buddha Bowl': '/images/menu-items/French Fries.jpg',
    'Vegan Burger': '/images/menu-items/French Fries.jpg',
    'Tofu Steak': '/images/menu-items/French Fries.jpg',
    'Green Smoothie': '/images/menu-items/beverages.webp',
    'Vegetable Wrap': '/images/menu-items/Spring Rolls.webp',
    'Spaghetti Bolognese': '/images/menu-items/Spaghetti Carbonara.webp',
    'Fettuccine Alfredo': '/images/menu-items/Spaghetti Carbonara.webp',
    'Penne Arrabbiata': '/images/menu-items/Spaghetti Carbonara.webp',
    'Lasagna': '/images/menu-items/Spaghetti Carbonara.webp',
    'Tiramisu': '/images/menu-items/Dessert Delight.avif',
    'House Special': '/images/menu-items/House Special.jpg',
    'Starter Platter': '/images/menu-items/Starter Platter.jpeg',
    'Signature Salad': '/images/menu-items/Signature Salad.webp',
    'Dessert Delight': '/images/menu-items/Dessert Delight.avif',
    'Fizzy Drink': '/images/menu-items/beverages.webp',
  };
  return nameToImageMap[itemName] || '/images/menu-items/French Fries.jpg';
};

// Helper function to get image path for restaurants
const getRestaurantImage = (restaurantName, index = 0) => {
  const nameToImageMap = {
    'Pizza Palace': '/images/restaurants/r3.jpg',
    'Burger Town': '/images/restaurants/r4.png',
    'Sushi Express': '/images/restaurants/r5.webp',
    'The Biryani House': '/images/restaurants/r6.jpg',
    'Thai Orchid': '/images/restaurants/r7.jpg',
    'BBQ Paradise': '/images/restaurants/r9.jpg',
    'Vegan Green': '/images/restaurants/Restorent 1.jpg',
    'Pasta Prime': '/images/restaurants/R2.png',
    'Red Oven': '/images/restaurants/rr8.webp',
    'Blue Spoon': '/images/restaurants/rr9.jpg',
    'Green Fork': '/images/restaurants/rr10.jpg',
    'Golden Wok': '/images/restaurants/rr11.jpg',
    'Silver Grill': '/images/restaurants/rr12.webp',
    'Urban Tiffin': '/images/restaurants/rr13.webp',
  };
  return nameToImageMap[restaurantName] || '/images/restaurants/r3.jpg';
};

// Sample user data
const users = [
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'password123',
    phone: '9876543210',
    address: '123 Main Street, City Center',
    role: 'customer',
  },
  {
    name: 'Pizza Palace',
    email: 'pizzapalace@example.com',
    password: 'password123',
    phone: '9876543211',
    address: '456 Food Street, Downtown',
    role: 'restaurant',
    restaurantName: 'Pizza Palace',
    restaurantDescription: 'Authentic Italian pizzas and pasta',
  },
  {
    name: 'Burger Town',
    email: 'burgertown@example.com',
    password: 'password123',
    phone: '9876543212',
    address: '789 Burger Lane, Uptown',
    role: 'restaurant',
    restaurantName: 'Burger Town',
    restaurantDescription: 'Delicious burgers and fast food',
  },
  {
    name: 'Sushi Express',
    email: 'sushiexpress@example.com',
    password: 'password123',
    phone: '9876543213',
    address: '321 Asian Avenue, Downtown',
    role: 'restaurant',
    restaurantName: 'Sushi Express',
    restaurantDescription: 'Fresh Japanese sushi and ramen',
  },
  {
    name: 'The Biryani House',
    email: 'biryanihouse@example.com',
    password: 'password123',
    phone: '9876543214',
    address: '654 Spice Market, Old City',
    role: 'restaurant',
    restaurantName: 'The Biryani House',
    restaurantDescription: 'Authentic Indian biryani and curries',
  },
  {
    name: 'Thai Orchid',
    email: 'thaiorchid@example.com',
    password: 'password123',
    phone: '9876543215',
    address: '987 Asia Town, Cultural District',
    role: 'restaurant',
    restaurantName: 'Thai Orchid',
    restaurantDescription: 'Authentic Thai cuisine and noodles',
  },
  {
    name: 'BBQ Paradise',
    email: 'bbqparadise@example.com',
    password: 'password123',
    phone: '9876543216',
    address: '246 Grill Lane, South Side',
    role: 'restaurant',
    restaurantName: 'BBQ Paradise',
    restaurantDescription: 'Smoky BBQ ribs and grilled meats',
  },
  {
    name: 'Vegan Green',
    email: 'vegangreen@example.com',
    password: 'password123',
    phone: '9876543217',
    address: '135 Health Street, West End',
    role: 'restaurant',
    restaurantName: 'Vegan Green',
    restaurantDescription: 'Fresh vegan and organic meals',
  },
  {
    name: 'Pasta Prime',
    email: 'pastaprime@example.com',
    password: 'password123',
    phone: '9876543218',
    address: '789 Flavor Lane, City Center',
    role: 'restaurant',
    restaurantName: 'Pasta Prime',
    restaurantDescription: 'Fresh pasta and Italian classics',
  },
];

// Sample menu data
const menus = {
  'Pizza Palace': [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato, mozzarella, and basil',
      category: 'Pizza',
      price: 250,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Pizza with pepperoni and mozzarella',
      category: 'Pizza',
      price: 300,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Vegetarian Pizza',
      description: 'Pizza with vegetables and mozzarella',
      category: 'Pizza',
      price: 280,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with bacon and eggs',
      category: 'Pasta',
      price: 220,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic and butter',
      category: 'Starters',
      price: 80,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'Burger Town': [
    {
      name: 'Classic Cheeseburger',
      description: 'Beef patty with cheese and veggies',
      category: 'Burgers',
      price: 150,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Double Patty Burger',
      description: 'Two beef patties with cheese',
      category: 'Burgers',
      price: 200,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Chicken Burger',
      description: 'Crispy chicken with mayo and lettuce',
      category: 'Burgers',
      price: 140,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'French Fries',
      description: 'Crispy golden fries',
      category: 'Sides',
      price: 60,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Coke',
      description: 'Ice cold cola',
      category: 'Beverages',
      price: 50,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'Sushi Express': [
    {
      name: 'California Roll',
      description: 'Sushi with crab and avocado',
      category: 'Sushi',
      price: 280,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Salmon Sushi',
      description: 'Fresh salmon sushi',
      category: 'Sushi',
      price: 320,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Vegetable Sushi',
      description: 'Sushi with cucumber and avocado',
      category: 'Sushi',
      price: 200,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Ramen',
      description: 'Hot noodle soup with broth',
      category: 'Noodles',
      price: 250,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Miso Soup',
      description: 'Traditional Japanese soup',
      category: 'Soups',
      price: 120,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'The Biryani House': [
    {
      name: 'Chicken Biryani',
      description: 'Fragrant rice with tender chicken',
      category: 'Biryani',
      price: 280,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Mutton Biryani',
      description: 'Premium mutton biryani with aromatic spices',
      category: 'Biryani',
      price: 350,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with butter',
      category: 'Curry',
      price: 280,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Paneer Tikka Masala',
      description: 'Cottage cheese in creamy tomato sauce',
      category: 'Curry',
      price: 240,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Naan Bread',
      description: 'Freshly baked Indian bread',
      category: 'Bread',
      price: 80,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'Thai Orchid': [
    {
      name: 'Pad Thai',
      description: 'Stir-fried noodles with shrimp and peanuts',
      category: 'Noodles',
      price: 260,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Green Curry',
      description: 'Spicy green curry with chicken',
      category: 'Curry',
      price: 280,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Tom Yum Soup',
      description: 'Spicy and sour soup with shrimp',
      category: 'Soups',
      price: 200,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Spring Rolls',
      description: 'Crispy rolls with pork and vegetables',
      category: 'Starters',
      price: 150,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Sticky Rice',
      description: 'Sweet sticky rice with mango',
      category: 'Dessert',
      price: 120,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'BBQ Paradise': [
    {
      name: 'BBQ Ribs',
      description: 'Smoky grilled ribs with BBQ sauce',
      category: 'BBQ',
      price: 450,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Grilled Chicken',
      description: 'Juicy grilled chicken with spices',
      category: 'BBQ',
      price: 300,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'BBQ Brisket',
      description: 'Slow-cooked tender brisket',
      category: 'BBQ',
      price: 500,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Corn on Cob',
      description: 'Grilled corn with butter',
      category: 'Sides',
      price: 100,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Grilled Fish',
      description: 'Fresh grilled fish fillet',
      category: 'BBQ',
      price: 350,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'Vegan Green': [
    {
      name: 'Quinoa Buddha Bowl',
      description: 'Nutritious bowl with quinoa and vegetables',
      category: 'Bowls',
      price: 220,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Vegan Burger',
      description: 'Plant-based burger with avocado',
      category: 'Burgers',
      price: 180,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Tofu Steak',
      description: 'Grilled tofu with organic vegetables',
      category: 'Main',
      price: 240,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Green Smoothie',
      description: 'Fresh organic green juice',
      category: 'Beverages',
      price: 120,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Vegetable Wrap',
      description: 'Whole wheat wrap with seasonal vegetables',
      category: 'Wraps',
      price: 160,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
  'Pasta Prime': [
    {
      name: 'Spaghetti Bolognese',
      description: 'Classic spaghetti with meat sauce',
      category: 'Pasta',
      price: 260,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Fettuccine Alfredo',
      description: 'Creamy pasta with parmesan cheese',
      category: 'Pasta',
      price: 280,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato pasta with garlic',
      category: 'Pasta',
      price: 240,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Lasagna',
      description: 'Layered pasta with meat and cheese',
      category: 'Pasta',
      price: 320,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
    {
      name: 'Tiramisu',
      description: 'Italian dessert with mascarpone',
      category: 'Dessert',
      price: 150,
      image: '/images/menu-items/margherita-pizza.jpg',
    },
  ],
};

// Seed database
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    console.log('✓ Cleared existing data');

    // Hash passwords before inserting (insertMany bypasses pre save hook)
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Create users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Create restaurants and menu items
    const restaurantUsers = createdUsers.filter((u) => u.role === 'restaurant');

    for (let i = 0; i < restaurantUsers.length; i++) {
      const restaurantUser = restaurantUsers[i];

      // Create restaurant
      const restaurant = new Restaurant({
        owner: restaurantUser._id,
        name: restaurantUser.restaurantName,
        description: restaurantUser.restaurantDescription,
        cuisineType:
          restaurantUser.restaurantName === 'Pizza Palace'
            ? ['Italian']
            : restaurantUser.restaurantName === 'Burger Town'
            ? ['American']
            : restaurantUser.restaurantName === 'Sushi Express'
            ? ['Japanese']
            : restaurantUser.restaurantName === 'The Biryani House'
            ? ['Indian']
            : restaurantUser.restaurantName === 'Thai Orchid'
            ? ['Thai']
            : restaurantUser.restaurantName === 'BBQ Paradise'
            ? ['BBQ', 'American']
            : restaurantUser.restaurantName === 'Vegan Green'
            ? ['Vegan', 'Healthy']
            : ['Italian'],
        image: getRestaurantImage(restaurantUser.restaurantName),
        rating: 4.5,
        deliveryTime: 30,
        minOrder: 50,
        address: restaurantUser.address,
        phone: restaurantUser.phone,
      });

      const savedRestaurant = await restaurant.save();
      console.log(`✓ Created restaurant: ${savedRestaurant.name}`);

      // Create menu items
      const menuItems = menus[restaurantUser.restaurantName] || [];
      const itemsToCreate = menuItems.map((item) => ({
        ...item,
        restaurant: savedRestaurant._id,
        image: getMenuItemImage(item.name),
      }));

      const createdItems = await MenuItem.insertMany(itemsToCreate);
      console.log(`  ✓ Added ${createdItems.length} menu items`);
    }

    // Create 6 random restaurants for testing
    const randomNames = [
      'Red Oven',
      'Blue Spoon',
      'Green Fork',
      'Golden Wok',
      'Silver Grill',
      'Urban Tiffin',
    ];
    const cuisines = ['Fusion', 'Mediterranean', 'Indian', 'Thai', 'Mexican', 'American'];
    const sampleMenuPool = [
      { name: 'House Special', description: 'Chef special of the day', category: 'Main', price: 250 },
      { name: 'Starter Platter', description: 'Mixed starters', category: 'Starters', price: 180 },
      { name: 'Signature Salad', description: 'Fresh seasonal salad', category: 'Salads', price: 140 },
      { name: 'Dessert Delight', description: 'Sweet finish', category: 'Dessert', price: 120 },
      { name: 'Fizzy Drink', description: 'Cold beverage', category: 'Beverages', price: 60 },
    ];

    // collect credentials to print for testers
    const randomRestaurantCreds = [];

    for (let i = 0; i < 6; i++) {
      const idx = i % randomNames.length;
      const randUser = new User({
        name: `${randomNames[idx]} Owner`,
        email: `${randomNames[idx].toLowerCase().replace(/\s+/g, '')}${i}@example.com`,
        password: 'password123',
        phone: `90000000${10 + i}`,
        address: `${100 + i} Random Street, Testville`,
        role: 'restaurant',
        restaurantName: randomNames[idx],
        restaurantDescription: `${randomNames[idx]} - freshly generated test restaurant`,
      });

      const savedUser = await randUser.save();

      // store credential for output
      randomRestaurantCreds.push({
        name: `${randomNames[idx]} ${i + 1}`,
        email: savedUser.email,
        password: 'password123',
      });

      const restaurant = new Restaurant({
        owner: savedUser._id,
        name: `${randomNames[idx]} ${i + 1}`,
        description: `${randomNames[idx]} generated for testing`,
        cuisineType: [cuisines[i % cuisines.length]],
        image: `/images/restaurants/${getRestaurantImage(randomNames[idx], i)}`,
        rating: (3.5 + (i % 2)),
        deliveryTime: 25 + i,
        minOrder: 40 + i * 5,
        address: savedUser.address,
        phone: savedUser.phone,
      });

      const savedRestaurant = await restaurant.save();
      const itemsToCreate = sampleMenuPool.map((it, j) => ({
        ...it,
        restaurant: savedRestaurant._id,
        image: getMenuItemImage(it.name),
        price: it.price + j * 10,
      }));

      const createdItems = await MenuItem.insertMany(itemsToCreate);
      console.log(`✓ Created random restaurant: ${savedRestaurant.name} with ${createdItems.length} items`);
    }

    // Print generated random restaurant credentials for testers
    console.log('\nRandom test restaurants created:');
    randomRestaurantCreds.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name}: ${r.email} / ${r.password}`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Customer: customer@example.com / password123');
    console.log('\n6 Restaurants:');
    console.log('1. Pizza Palace: pizzapalace@example.com / password123');
    console.log('2. Burger Town: burgertown@example.com / password123');
    console.log('3. Sushi Express: sushiexpress@example.com / password123');
    console.log('4. The Biryani House: biryanihouse@example.com / password123');
    console.log('5. Thai Orchid: thaiorchid@example.com / password123');
    console.log('6. BBQ Paradise: bbqparadise@example.com / password123');
    console.log('7. Vegan Green: vegangreen@example.com / password123');
    console.log('8. Pasta Prime: pastaprime@example.com / password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    process.exit();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    console.log('📦 Connected to MongoDB');
    seedDatabase();
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
