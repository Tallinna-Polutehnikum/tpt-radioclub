import * as cheerio from "npm:cheerio@1.1.2";
import { corsHeaders } from "../_shared/cors.ts";

const CALENDAR_URL = "https://erau.ee/et/kalender";
const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type Event = {
    date: string;
    desc: string;
    time: string;
};

type MonthData = {
    month: string;
    events: Event[];
};

const normalizeMonth = (month: string): string => {
    const monthCapitalized = month.replace(/\s*\d{4}\s*$/, "").toLowerCase();
    const monthEt =
        monthCapitalized.charAt(0).toUpperCase() + monthCapitalized.slice(1);

    return monthTranslator(monthEt);
};

const normalizeDate = (dateStr: string, monthStr: string): string => {
    const init = dateStr
        .replace("-", "")
        .split(".")
        .map((s) => s.trim());

    if (init.length > 3) {
        return `${init[0]}-${init[1]} ${monthStr.slice(0, 3)}`;
    }

    return `${init[0]} ${monthStr.slice(0, 3)}`;
};

const monthTranslator = (monthEt: string): string => {
    const monthMap: { [key: string]: string } = {
        Jaanuar: "January",
        Veebruar: "February",
        Märts: "March",
        Aprill: "April",
        Mai: "May",
        Juuni: "June",
        Juuli: "July",
        August: "August",
        September: "September",
        Oktoober: "October",
        November: "November",
        Detsember: "December",
    };

    return monthMap[monthEt] || monthEt;
};

const parseCalendar = (html: string): MonthData[] => {
    const $ = cheerio.load(html);
    const root = $(".article-intro-text").first();

    const months: MonthData[] = [];

    root.find("p > strong:not(table strong)").each((_, strongEl) => {
        const month = normalizeMonth($(strongEl).text().trim());
        if (!month) return;

        const events: Event[] = [];

        $(strongEl)
            .parent()
            .next()
            .find("tr")
            .each((_, trEl) => {
                const tds = $(trEl).find("td");

                const date = $(tds[0]).text().trim();
                const desc = $(tds[1]).text().trim();
                const time = $(tds[2]).text().trim();

                if (date === "Kuupäev" || date === "") return;

                events.push({
                    date: normalizeDate(date, month),
                    time,
                    desc,
                });
            });

        if (events.length > 0) {
            months.push({ month, events });
        }
    });

    return months;
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const res = await fetch(CALENDAR_URL, {
            headers: { "User-Agent": USER_AGENT },
        });

        if (!res.ok) {
            throw new Error(`erau.ee responded with status ${res.status}`);
        }

        const html = await res.text();
        const calendar = parseCalendar(html);

        return new Response(JSON.stringify(calendar), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: (err as Error).message }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});
