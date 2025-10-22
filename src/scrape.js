import puppeteer from 'puppeteer';
import { vacancyModel } from './models/vacancyModel.js';
async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let pageNum = 1;
  let temMais = true;

  vacancyModel.createTable();

  while (temMais) {
    console.log(`Página ${pageNum}`)
    await page.goto(`https://remotar.com.br/search/jobs?q=backend&p=${pageNum}`);

    await page.waitForSelector('.css-v05qs0', { timeout: 10000 }).catch(() => {
      temMais = false;
    });
    
    const vagasRemotar = await page.$$eval('.css-v05qs0', cards => {
        return cards.map(card => ({
          name: card.querySelector('.h1')?.innerText,
          link: card.querySelector('a')?.href,
          enterprise: "remotar"
        }));
    
    });

    if (vagasRemotar.length === 0) {
      temMais = false;
      break;
    }

    vagasRemotar.forEach(vaga => {
      vacancyModel.addVacancy(vaga);
      
    })

    pageNum++
  }

}

scrape();