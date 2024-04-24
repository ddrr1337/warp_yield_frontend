//use client

const addTokenToMM = async (ethereum, name, address, decimals) => {
  try {
    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: address, // ERC20 token address
          symbol: name,
          decimals: decimals,
          //image: image,
        },
      },
    });
  } catch (ex) {
    // We don't handle that error for now
    // Might be a different wallet than Metmask
    // or user declined
    console.error(ex);
  }
};

export default addTokenToMM;
