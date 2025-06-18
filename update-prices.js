// fetch أسعار الذهب من metals-api وتحديث prices.json
const fs = require('fs');
const fetch = require('node-fetch');

const API_KEY = '0i7s8w4kac1n8f53j762j57pa152oqu0r0n37aoi668933zkc5n0woip9t88';
const URL = `https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAU,AED`;

async function run() {
  const res = await fetch(URL);
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.info || 'API Error');

  const usdToAed = data.rates.AED;
  const ounceUsd = data.rates.XAU;
  const aedPerOunce = usdToAed * ounceUsd;
  const gram21k = (aedPerOunce / 31.1035) * 0.875;

  const obj = {
    date: new Date().toISOString(),
    gold_ounce_usd: +ounceUsd.toFixed(2),
    aed_per_gram_21k: +gram21k.toFixed(2)
  };

  fs.writeFileSync('prices.json', JSON.stringify(obj, null, 2));
  console.log('✅ Updated:', obj);
}

run().catch(err => { console.error(err); process.exit(1); });
