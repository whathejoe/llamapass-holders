import fs from "fs";

const GOLD_TOKEN_ID = "1";
const SILVER_TOKEN_ID = "2";

const logTokenStats = (owners) => {
  let stats = {};

  owners.forEach(({ token_id, amount }) => {
    if (![GOLD_TOKEN_ID, SILVER_TOKEN_ID].includes(token_id)) return;

    if (stats[token_id]) {
      stats[token_id].count += parseInt(amount, 10);
      stats[token_id].owners++;
    } else {
      stats[token_id] = {
        count: parseInt(amount, 10),
        owners: 1,
      };
    }
  });

  console.log(
    "All holders:",
    Object.values(stats).reduce((prev, { owners }) => prev + owners, 0)
  );
  console.log("Distribution:", stats);
};

const logOwnerCount = (owners) => {
  let count = {};
  owners.map(({ owner_of, token_id }) => {
    if (count[token_id]) {
      count[token_id]++;
    } else {
      count[token_id] = parseInt(amount, 10);
    }
  });

  console.log("Owner count:", count);
};

const saveHoldersToFiles = async (owners) => {
  let goldHolders = "";
  let silverHolders = "";

  owners.forEach(({ owner_of, token_id, amount }) => {
    if (token_id === GOLD_TOKEN_ID) {
      goldHolders += `${owner_of},${amount}\n`;
    } else if (token_id === SILVER_TOKEN_ID) {
      silverHolders += `${owner_of},${amount}\n`;
    }
  });

  const path = "output";

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  fs.writeFileSync(`${path}/gold-holders.csv`, goldHolders);
  fs.writeFileSync(`${path}/silver-holders.csv`, silverHolders);
  console.log(`Holder lists can be found in /${path}.`);
};

const logAddressHoldings = (address, owners) => {
  console.log(
    owners
      .filter((o) => o.owner_of === address)
      .map(({ owner_of, token_id, amount }) => ({ owner_of, token_id, amount }))
  );
};

const processResults = (owners) => {
  console.log("------- RESULTS --------");
  logTokenStats(owners);
  console.log("------- OUTPUT ---------");
  saveHoldersToFiles(owners);
  // logAddressHoldings("0x62eae7f7c3e3d1943307086fdea7141889647ff3", owners);
};

export default processResults;
