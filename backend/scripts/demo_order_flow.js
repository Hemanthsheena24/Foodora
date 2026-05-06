require('dotenv').config();
const axios = require('axios');

const API = process.env.API_URL || 'http://localhost:5000/api';

async function run() {
  try {
    console.log('1) Login as customer');
    const custLogin = await axios.post(`${API}/auth/login`, { email: 'customer@example.com', password: 'password123' });
    const customerToken = custLogin.data.token;
    console.log(' - Customer logged in, token length:', customerToken.length);

    console.log('2) Get restaurants and pick Pizza Palace');
    const restaurants = await axios.get(`${API}/restaurants`);
    const pizza = restaurants.data.restaurants.find(r => r.name && r.name.toLowerCase().includes('pizza')) || restaurants.data.restaurants[0];
    console.log(' - Selected restaurant:', pizza.name, pizza._id);

    console.log('3) Get menu for restaurant');
    const menuRes = await axios.get(`${API}/restaurants/${pizza._id}/menu`);
    const menuItem = menuRes.data.menuItems[0];
    console.log(' - Selected menu item:', menuItem.name, menuItem._id, 'price', menuItem.price);

    console.log('4) Create order as customer');
    const orderBody = {
      restaurantId: pizza._id,
      items: [{ menuItemId: menuItem._id, quantity: 1 }],
      deliveryAddress: '123 Demo Street',
      notes: 'Test order from demo script',
    };

    const orderRes = await axios.post(`${API}/orders`, orderBody, { headers: { Authorization: `Bearer ${customerToken}` } });
    const order = orderRes.data.order;
    console.log(' - Order created:', order._id, 'status:', order.status);

    console.log('5) Login as restaurant owner');
    // find restaurant owner email from DB, but known seeded email for Pizza Palace
    const restLogin = await axios.post(`${API}/auth/login`, { email: 'pizzapalace@example.com', password: 'password123' });
    const restToken = restLogin.data.token;
    console.log(' - Restaurant logged in, token length:', restToken.length);

    console.log('6) Accept the order (restaurant)');
    const acceptRes = await axios.post(`${API}/orders/${order._id}/accept`, {}, { headers: { Authorization: `Bearer ${restToken}` } });
    console.log(' - Accept response status:', acceptRes.status, 'order status now:', acceptRes.data.order.status);

    console.log('7) Update status to PREPARING');
    await axios.post(`${API}/orders/${order._id}/update-status`, { status: 'PREPARING' }, { headers: { Authorization: `Bearer ${restToken}` } });
    console.log(' - Set to PREPARING');

    console.log('8) Update status to OUT_FOR_DELIVERY');
    await axios.post(`${API}/orders/${order._id}/update-status`, { status: 'OUT_FOR_DELIVERY' }, { headers: { Authorization: `Bearer ${restToken}` } });
    console.log(' - Set to OUT_FOR_DELIVERY');

    console.log('9) Update status to DELIVERED');
    await axios.post(`${API}/orders/${order._id}/update-status`, { status: 'DELIVERED' }, { headers: { Authorization: `Bearer ${restToken}` } });
    console.log(' - Set to DELIVERED');

    console.log('\nDemo complete. Check order:', order._id);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

run();
