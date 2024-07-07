import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import * as fs from 'node:fs';

const siteURL = 'https://quotes.toscrape.com/'
const nextBtnSelector = '.next a'

/**
 * @typedef Quote
 * @type {object}
 * @property {string} quote - text of the quote.
 * @property {string} author - author of the quote.
 * @property {string[]} tags - tags of the quote.
 */

/**
 * 
 * @param {Page} page - Current page object
 * @param {string} quoteSelector - Css selector for quote objects
 * @returns {Quote[]}
 */
async function getQuotes(page, quoteSelector){
    const elements = await page.$$(quoteSelector);
    const htmlQuotes = await Promise.all(elements.map(async (element) => {
        const htmlContent = await page.evaluate(el => el.innerHTML, element);
        const $ = cheerio.load(htmlContent);
        const quoteText     = $('span.text').text();
        const quoteAuthor   = $('.author').text();
        const quoteTags     = [];

        $('.tag').each(function (i, elem) {
            quoteTags[i] = $(this).text();
        });

        return {
            quote: quoteText,
            tags: quoteTags,
            author: quoteAuthor
        }
    }));
    return htmlQuotes
}

(async()=>{
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    const quotes = []

    await page.goto(siteURL, {waitUntil: 'networkidle2'});

    quotes.push( ... await getQuotes(page, '.quote'))
    while (await page.$(nextBtnSelector)) {
        const nextBtn = await page.$(nextBtnSelector)
        await nextBtn.click()
        await page.waitForNavigation({
            waitUntil: 'networkidle2'
        })
        quotes.push( ... await getQuotes(page, '.quote'))
    }

    await browser.close();

    await fs.writeFile('quotes.json', JSON.stringify(quotes, null, 2), err=>{
        if (err) throw err;
        console.log(`${quotes.length} quotes saved`);
    });
})()

