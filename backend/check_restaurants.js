const axios = require('axios');

axios.get('http://localhost:5000/api/restaurants', { timeout: 5000 })
  .then(res => {
    console.log(JSON.stringify(res.data, null, 2));
    process.exit(0);
  })
  .catch(err => {
    if (err.response) {
      console.error('STATUS', err.response.status);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('ERR', err.message);
    }
    process.exit(1);
  });
