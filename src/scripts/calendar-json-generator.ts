import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = () => {
    const filePath = join(__dirname, "calendar.html");
    const calendarHtml = readFileSync(filePath, "utf-8");

    const $ = cheerio.load(calendarHtml);

    const mainDiv = $("div");

    const calendarData = mainDiv.map((_, el) => {    
        const months = $(el).find("p > strong:not(table strong)");
        
        const monthData = months.map((_, strongEl) => {
            const currentMonth = normalizeMonth($(strongEl).text().trim());
            if (!currentMonth) 
                return;
            
            const events = $(strongEl).parent().next().find('tr').map((_, trEl) => {
                const tds = $(trEl).find("td");

                const date = $(tds[0]).text().trim();
                const desc = $(tds[1]).text().trim();
                const time = $(tds[2]).text().trim();

                if (date === 'Kuupäev') 
                    return null;

                return { date: normalizeDate(date, currentMonth), time, desc };
            }).get().filter(Boolean);

            return { month: currentMonth, events };
        }).get().filter(Boolean);

        return monthData;
    }).get().flat();

    const outputPath = join(__dirname, "../assets/calendar.json");
    const jsonContent = JSON.stringify(calendarData, null, 2);
    
    writeFileSync(outputPath, jsonContent, "utf-8");
};

const normalizeMonth = (month: string) => {
    const monthCapitalized = month.replace(' 2026', '').toLowerCase();
    const monthEt = monthCapitalized.charAt(0).toUpperCase() + monthCapitalized.slice(1);

    return monthTranslator(monthEt);
};

const normalizeDate = (dateStr: string, monthStr: string) => {
    const init = dateStr.replace('-', '').split('.').map(s => s.trim());
    
    if (init.length > 3) {
        return `${init[0]}-${init[1]} ${monthStr.slice(0,3)}`;
    }

    return `${init[0]} ${monthStr.slice(0,3)}`;
}

const monthTranslator = (monthEt: string) => {
   const monthMap: { [key: string]: string } = {
       "Jaanuar": "January",
       "Veebruar": "February",
       "Märts": "March",
       "Aprill": "April",
       "Mai": "May",
       "Juuni": "June",
       "Juuli": "July",
       "August": "August",
       "September": "September",
       "Oktoober": "October",
       "November": "November",
       "Detsember": "December"
   };

   return monthMap[monthEt] || monthEt;
}

main();