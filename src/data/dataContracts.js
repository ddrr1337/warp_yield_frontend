export const dataContracts = {
  11155111: {
    chainName: "sepolia",
    formatedName: "Sepolia",
    chainIdCCIP: "16015286601757825753",
    chainCircleId: 0,
    master: "0x3288610439e971200A19F43f6c3FE0ca48717639",
    explorer: "https://sepolia.etherscan.io/",
    icon: "/images/ethereum1.svg",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    myBridge: "0x29219E4a029c8865aDb48115736f451A5A696C91",
    destinationCCTP: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    bridgeConfirmations: 5,
    provider: {
      alchemy:
        "wss://eth-sepolia.g.alchemy.com/v2/aQbA2ZhNVWoRwwM1Rmr29xOOuh6btgqs",
    },
  },
  421614: {
    chainName: "arbitrum_sepolia",
    formatedName: "Arbitrum",
    chainIdCCIP: "3478487238524512106",
    chainCircleId: 3,
    slave: "0xC0c05E0e4e89AC3c60b44Cd5db0d5BAe68A3b090",
    aave_data_provider: "0x12373B5085e3b42D42C1D4ABF3B3Cf4Df0E0Fa01",
    usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    ausdc: "0x460b97BD498E1157530AEb3086301d5225b91216",
    link: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    myBridge: "0xa4b52ae81430549C83d7E9E89Da4Fb2c4Af7a817",
    destinationCCTP: "0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872",
    bridgeConfirmations: 5,
    explorer: "https://sepolia.arbiscan.io/",
    icon: "/images/arbitrum.svg",
    provider: {
      alchemy:
        "wss://arb-sepolia.g.alchemy.com/v2/rf4pcF1cGQ1GT3ZxXlT7ot-ZpxJqn37Q",
    },
  },
  11155420: {
    chainName: "optimistic_sepolia",
    formatedName: "Optimistic",
    slave: "0x6DfaDc22e43CC05f17D469514fA33CEacBdcbB6A",
    usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    chainCircleId: 2,
    myBridge: "0x4daa717239c7B3f208E7c4b6B4A0A3dd3e79A612",
    destinationCCTP: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    bridgeConfirmations: 5,
    icon: "/images/optimistic.svg",
    explorer: "https://sepolia-optimism.etherscan.io/",
    provider: {
      alchemy:
        "wss://opt-sepolia.g.alchemy.com/v2/dzA2e971vCGN7ZPUjy8vw8an7If9tyvc",
    },
  },
  84532: {
    chainName: "base_sepolia",
    formatedName: "Base",
    slave: "",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    chainCircleId: 6,
    myBridge: "",
    destinationCCTP: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    bridgeConfirmations: 5,
    icon: "/images/base.svg",
    explorer: "https://base-sepolia.blockscout.com",
    provider: {
      alchemy: "",
    },
  },
  43113: {
    chainName: "avax_fuji",
    formatedName: "Avalanche",
    slave: "",
    usdc: "0x5425890298aed601595a70ab815c96711a31bc65",
    chainCircleId: 1,
    myBridge: "",
    destinationCCTP: "0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79",
    bridgeConfirmations: 1,
    icon: "/images/avax.svg",
    explorer: "https://testnet.snowtrace.io",
    provider: {
      alchemy: "",
    },
  },
  80002: {
    chainName: "polygon_amoy",
    formatedName: "Polygon",
    slave: "",
    usdc: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
    chainCircleId: 7,
    myBridge: "",
    destinationCCTP: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
    bridgeConfirmations: 1,
    icon: "/images/polygon.svg",
    explorer: "https://www.oklink.com/amoy",
    provider: {
      alchemy: "",
    },
  },
};

export const cahinLinkCCIPExplorer = "https://ccip.chain.link/tx/";
