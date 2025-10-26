import puppeteer from 'puppeteer';
import { vacancyModel } from './models/vacancyModel.js';
async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let pageNum = 1;
  let temMais = true;

  vacancyModel.createTable();

  console.log(await page.$('.css-v05qs0'));

  while (temMais) {
    console.log(`Página ${pageNum}`)
    await page.goto(`https://remotar.com.br/search/jobs?q=backend&p=${pageNum}`);

    await page.waitForSelector('.css-v05qs0', { timeout: 10000 }).catch(() => {
      temMais = false;
    });


    
 const vagasRemotar = await page.$$eval('.css-v05qs0', cards =>
      cards.map(card => {
        // Pega todas as tags (links internos dentro da vaga)
        const tags = Array.from(card.querySelectorAll('.css-z1wlc8'))
          .map(a => a.innerText.trim())
          .filter(t => t.length > 0 && !t.includes('remotar.com.br'));

        return {
          name: card.querySelector('.h1')?.innerText,
          link: card.querySelector('a')?.href,
          tags: tags,
          enterprise: 'remotar'
        };
      })
    );

    await page.waitForSelector('.css-v05qs0', { timeout: 30000 });

    if (vagasRemotar.length === 0) {
      temMais = false;
      break;
    }

    vagasRemotar.forEach(vaga => {
      vacancyModel.addVacancy(vaga);
      
    })

    pageNum++
  }
  await browser.close();

}

scrape();