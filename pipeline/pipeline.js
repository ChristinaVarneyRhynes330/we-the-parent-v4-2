const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');
const csv = require('csv-parser');

const baseUrl = 'https://catalog.data.gov';
const searchUrl = `${baseUrl}/dataset/?q=Juvenile+dependency+cases+CSV+&sort=score+desc%2C+name+asc&res_format=CSV`;

async function scrapeDatasetLinks() {
  const { data } = await axios.get(searchUrl);
  const $ = cheerio.load(data);

  const datasetLinks = [];

  $('h3.dataset-heading a').each((i, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr('href');
    if (href) {
      datasetLinks.push({ title, url: `${baseUrl}${href}` });
    }
  });

  return datasetLinks;
}

function convertCSVtoJSON(csvPath, jsonPath) {
  const results = [];
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
      console.log(`🟢 Converted to JSON: ${path.basename(jsonPath)}`);
    });
}

async function findAndDownloadCSVs(dataset) {
  try {
    const { data } = await axios.get(dataset.url);
    const $ = cheerio.load(data);

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.endsWith('.csv')) {
        const fileUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;
        const fileName = path.basename(fileUrl);
        const filePath = path.join(__dirname, 'downloads', fileName);
        const jsonPath = filePath.replace(/\.csv$/, '.json');

        if (!fs.existsSync('downloads')) {
          fs.mkdirSync('downloads');
        }

        const fileStream = fs.createWriteStream(filePath);
        https.get(fileUrl, (response) => {
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`✅ Downloaded: ${fileName}`);
            convertCSVtoJSON(filePath, jsonPath);
          });
        }).on('error', (err) => {
          console.error(`❌ Error downloading ${fileName}:`, err.message);
        });
      }
    });
  } catch (err) {
    console.error(`❌ Failed to process ${dataset.title}:`, err.message);
  }
}

(async () => {
  const datasets = await scrapeDatasetLinks();
  console.log(`🔍 Found ${datasets.length} datasets`);

  for (const dataset of datasets) {
    console.log(`📂 Processing: ${dataset.title}`);
    await findAndDownloadCSVs(dataset);
  }
})();
