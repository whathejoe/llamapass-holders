import dotenv from "dotenv";
import fetch from "node-fetch";
import processResults from "./process.mjs";
dotenv.config();

const LLAMAPASS_ADDRESS = "0x0bd4d37e0907c9f564aaa0a7528837b81b25c605";

let totalOwners;
const owners = [];

const MAX_PAGE_SIZE = 500;
const ORDER_BY = "owner_of.ASC";

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "X-API-Key": process.env.MORALIS_API_KEY,
  },
};

const getOwners = async (offset = 0) => {
  const url = `https://deep-index.moralis.io/api/v2/nft/${LLAMAPASS_ADDRESS}/owners?chain=eth&offset=${offset}&limit=${MAX_PAGE_SIZE}&order=${ORDER_BY}`;
  const response = await fetch(url, options).then((res) => res.json());

  const { total: nftCount, result } = response;
  if (!totalOwners) totalOwners = nftCount;
  owners.push(...result);

  console.log("Fetched", owners.length, "of", totalOwners, "entries");
  if (owners.length < totalOwners) {
    getOwners(owners.length);
  } else {
    processResults(owners);
  }
};

console.log("------- FETCHING -------");
getOwners().catch(console.log);
