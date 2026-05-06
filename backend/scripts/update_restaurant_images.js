require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('../src/models/Restaurant');

const mapping = {
  'Pizza Palace': 'R2.png',
  'Burger Town': 'Restorent 1.jpg',
  'Sushi Express': 'r3.jpg',
  'The Biryani House': 'r4.png',
  'Thai Orchid': 'r5.webp',
  'BBQ Paradise': 'r6.jpg',
  'Vegan Green': 'r7.jpg',
  'Pasta Prime': 'r8.webp',
};

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    for (const [name, file] of Object.entries(mapping)) {
      const imgPath = '/images/restaurants/' + file;
      const res = await Restaurant.findOneAndUpdate(
        { name },
        { $set: { image: imgPath } },
        { new: true }
      );

      if (res) {
        console.log(`Updated ${name} -> ${imgPath}`);
      } else {
        console.log(`Restaurant not found: ${name}`);
      }
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
}

updateImages();
