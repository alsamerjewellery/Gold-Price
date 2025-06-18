const fs = require('fs');
const https = require('https');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

const API_KEY = '0i7s8w4kac1n8f53j762j57pa152oqu0r0n37aoi668933zkc5n0woip9t88';
const API_URL = https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG,AED;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', (err) => reject(err));
  });
}

function calculateGramPrice(ounceUsd, aedRate, extraUsd, karatFactor) {
  const adjustedUsd = ounceUsd + extraUsd;
  const pricePerOunceAed = adjustedUsd * aedRate;
  return +(pricePerOunceAed / 31.1035 * karatFactor).toFixed(2);
}

(async () => {
  const response = await fetchJson(API_URL);
  const { XAU, XAG, AED } = response.rates;

  const content = fs.readFileSync('data.csv', 'utf8');
  const records = parse(content, { skip_empty_lines: false });

  // تعديل الخلايا المطلوبة
  records[0][1] = XAU.toFixed(2); // B1
  records[1][1] = XAG.toFixed(2); // B2
  records[4][1] = calculateGramPrice(XAU, AED, 21, 0.75); // B5 - عيار 18
  records[5][1] = calculateGramPrice(XAU, AED, 21, 0.875); // B6 - عيار 21
  records[6][1] = calculateGramPrice(XAU, AED, 21, 0.9167); // B7 - عيار 22
  records[7][1] = calculateGramPrice(XAU, AED, 21, 1); // B8 - عيار 24

  const updated = stringify(records);
  fs.writeFileSync('data.csv', updated);
})();
