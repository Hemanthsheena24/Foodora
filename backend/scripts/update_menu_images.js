require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'menu-items');

const slugify = (s) =>
  s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const files = fs.readdirSync(IMAGES_DIR);
    const fileSet = new Set(files.map((f) => f.toLowerCase()));

    const items = await MenuItem.find({});
    let updated = 0;

    for (const item of items) {
      const name = item.name || '';
      const candidates = [
        `${name}`,
        `${slugify(name)}.jpg`,
        `${slugify(name)}.jpeg`,
        `${slugify(name)}.png`,
        `${slugify(name)}.webp`,
        `${name}.jpg`,
        `${name}.png`,
        `${name}.webp`,
      ];

      let found = null;
      for (const c of candidates) {
        // check case-insensitive
        const match = files.find((f) => f.toLowerCase() === c.toLowerCase());
        if (match) {
          found = match;
          break;
        }
      }

      if (found) {
        const imgPath = '/images/menu-items/' + found;
        if (item.image !== imgPath) {
          item.image = imgPath;
          await item.save();
          updated++;
          console.log(`Updated ${item.name} -> ${imgPath}`);
        }
      } else {
        // try more relaxed match: startsWith first word
        const firstWord = name.split(' ')[0].toLowerCase();
        const match = files.find((f) => f.toLowerCase().startsWith(firstWord));
        if (match) {
          const imgPath = '/images/menu-items/' + match;
          item.image = imgPath;
          await item.save();
          updated++;
          console.log(`Loosely matched ${item.name} -> ${imgPath}`);
        } else {
          // no image found
        }
      }
    }

    console.log(`\nDone. Updated ${updated} menu items.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
