# Quotes Scraper

## About

There is a faster way to scrape the [quotes](https://quotes.toscrape.com/) site, for example simply using *.querySelectorAll()*. However, the goal of the project is to familiarize myself with puppeteer and cheerio api. 

### Libraries used

- [Puppeteer](https://pptr.dev/)
- [Cheerio](https://cheerio.js.org/)

## Getting Started

### Prerequisites

- pnpm is installed on your system
```
npm install -g pnpm
```

### Installation

Install all the needed libraries with the following command
```
pnpm install
```

## Usage

Run the script to scrap [quotes](https://quotes.toscrape.com/)
```
pnpm run start
```
The script is taking about 6 seconds to execute, wait for it to show "saved" message.

The result of the script execution will be *quotes.json* file.