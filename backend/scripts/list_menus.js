require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');
const Restaurant = require('../src/models/Restaurant');

async function listMenus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const restaurants = await Restaurant.find({}).select('name');
    for (const r of restaurants) {
      console.log(`\n=== ${r.name} ===`);
      const items = await MenuItem.find({ restaurant: r._id }).select('name description category price image');
      if (!items.length) {
        console.log(' (no menu items)');
        continue;
      }
      items.forEach((it) => {
        console.log(`- ${it.name} | ${it.category} | ${it.price} | ${it.description} | image: ${it.image || 'none'}`);
      });
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listMenus();
