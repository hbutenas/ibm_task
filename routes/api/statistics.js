const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
/**
 * @Route /api
 * @Desc Get all countries
 * @Access Public
 */

router.get("/", async (req, res) => {
  try {
    const response = await fetch(
      "https://opendata.ecdc.europa.eu/covid19/nationalcasedeath/json/"
    );
    const data = await response.json();
    return res.send(data);
  } catch (error) {
    console.error(`Received an error: ${error}`);
  }
});

/**
 * @Route /api/:country
 * @Desc Get one countries
 * @Access Public
 */

router.get("/:country", async (req, res) => {
  try {
    const response = await fetch(
      "https://opendata.ecdc.europa.eu/covid19/nationalcasedeath/json/"
    );
    const data = await response.json();
    const resp = data.filter((item) => {
      return item.country === req.params.country;
    });
    return res.send(resp);
  } catch (error) {
    console.error(`Received an error: ${error}`);
  }
});

module.exports = router;
