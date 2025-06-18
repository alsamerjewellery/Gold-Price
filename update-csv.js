const fs = require('fs');
const axios = require('axios');

const API_KEY = process.env.API_KEY;
const API_URL = `https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`;

async function updateCSV() {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const xau = data.rates.XAU;
    const xag = data.rates.XAG;

    // الأسعار بالدرهم: تحويل أونصة الذهب إلى غرام ثم ضرب في العيار
    const goldGramPrice = (xau + 21) / 31.1; // بعد إضافة المصنعية
    const price18 = goldGramPrice * 0.75;
    const price21 = goldGramPrice * 0.875;
    const price22 = goldGramPrice * 0.916;
    const price24 = goldGramPrice;

    // نص ملف CSV
    const csv = `السعر\n${xau}\n${xag}\n\n${price18.toFixed(2)}\n${price21.toFixed(2)}\n${price22.toFixed(2)}\n${price24.toFixed(2)}\n`;

    fs.writeFileSync('data.csv', csv, 'utf8');
    console.log('تم تحديث الملف بنجاح!');
  } catch (err) {
    console.error('خطأ أثناء جلب الأسعار:', err.message);
  }
}

updateCSV();
