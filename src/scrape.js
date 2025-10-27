import puppeteer from "puppeteer";
import { vacancyModel } from "./models/vacancyModel.js";

export async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await vacancyModel.createTable();

  let pageNum = 1;
  let total = 0;

  while (true) {
    console.log(`🔎 Página ${pageNum}`);
    await page.goto(
      `https://remotar.com.br/search/jobs?q=backend&p=${pageNum}`,
      { waitUntil: "domcontentloaded" }
    );

    // aguarda a área principal da página carregar
    try {
      await page.waitForSelector(".timeline-container", { timeout: 10000 });
    } catch {
      console.log("⚠️ Página não carregou completamente, encerrando.");
      break;
    }

    // substituto do waitForTimeout (usando JS puro)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // pega apenas as vagas dentro do container principal
    const vagasRemotar = await page.$$eval(
      ".timeline-container .main .css-v05qs0",
      (cards) =>
        cards
          .map((card) => {
            const name = card.querySelector(".h1")?.innerText?.trim();
            const link = card.querySelector("a")?.href;
            const enterprise = card.querySelector(".company")?.innerText?.trim();
            const createdAt = card.querySelector(".created-at")?.innerText?.trim();
            const tags = Array.from(card.querySelectorAll(".css-z1wlc8")).map((a) =>
              a.innerText.trim()
            );
            if (!name || !link || !enterprise) return null;
            return { name, link, tags, enterprise: enterprise, createdAt: createdAt || "Desconhecida" };
          })
          .filter(Boolean)
    );

    if (!vagasRemotar.length) {
      console.log("❌ Nenhuma vaga encontrada. Encerrando scraping.");
      break;
    }

    for (const vaga of vagasRemotar) {
      await vacancyModel.addVacancy(vaga);
      console.log(vaga);
      total++;
    }

    console.log(`✅ ${vagasRemotar.length} vagas salvas na página ${pageNum}`);
    pageNum++;
  }

  await browser.close();
  console.log(`🎯 Scraping finalizado! Total de vagas salvas: ${total}`);
}

scrape();