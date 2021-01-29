const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var campaignNumber;
app.use(express.static("./"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log("responding from root");
});

app.post("/run_puppet", (req, res) => {
  try {
    campaignNumber = req.body.create_number;
    console.log(campaignNumber);
    runPuppet();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

async function runPuppet() {
  console.log("inside run puppet");
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://app.leadsherpa.com/login");
  console.log("loaded login");

  //  const result = await page.evaluate(()=>{
  //    let inputFields = document.querySelectorAll(".large-input");
  //    const headingList = [...inputFields];
  //    return headingList.map(h => h.name);
  //  })

  //  console.log(result);

  await page.focus('input[name="username"]');
  await page.keyboard.type("mghlzbr@gmail.com");
  await page.focus('input[name="password"]');
  await page.keyboard.type("Worthit123!");


  // await page.click('button[type="submit"]');
  // await page.waitForNavigation();

  console.log("entered credentials and clicked login");


  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation(),
  ]);

  // await page.reload({ waitUntil: "networkidle2" });
  await page.waitForTimeout(5000);

  await page.goto(
    "https://app.leadsherpa.com/campaign/" + `${campaignNumber}` + "/details"
  );

  console.log("going to campaign: " + campaignNumber);
  // await page.reload({ waitUntil: "networkidle2" });

  await page.waitForTimeout(10000);
  console.log("before try");

  try {
    console.log("inside try");

    await page.waitForTimeout(5000);

    for (
      let changeTemplateCount = 2;
      changeTemplateCount <= 11;
      changeTemplateCount++
    ) {
      await page.click(
        "div.undefined.displayedData > ul > li:nth-child(" +
          `${changeTemplateCount}` +
          ")"
      );
      console.log("changeTemplateCount: " + changeTemplateCount);

      await page.waitForTimeout(5000);
      for (let maxClick = 0; maxClick <= 99; maxClick++) {
        await page.click(".send-button");
        await page.waitForTimeout(7000);
      }
      console.log("Waiting...");
      await page.waitForTimeout(300000);
    }
    await browser.close();
  } catch (error) {
    console.log(error);
    await browser.close();
    console.log("closed sherpa session");
  }
}

app.listen(3000, () => {
  console.log("server is up");
});
