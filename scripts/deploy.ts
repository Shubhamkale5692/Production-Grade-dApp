import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// @ts-ignore
import * as counter from '../contracts/contract/index.js';

async function deploy() {
  console.log("Setting up providers for Preprod...");
  setNetworkId('preprod');

  // These are example URLs for Midnight Preprod
  const zkConfigProvider = new FetchZkConfigProvider('https://preprod.midnight.network/zk-config');
  const indexerUrl = 'https://indexer.preprod.midnight.network/graphql';
  const proofServerUrl = 'https://proof.preprod.midnight.network';

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStoragePasswordProvider: async () => 'my-password',
      accountId: 'user-deployer'
    }),
    publicDataProvider: indexerPublicDataProvider(indexerUrl, indexerUrl.replace('http', 'ws')),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(proofServerUrl, zkConfigProvider),
    // For Node.js deployment, you typically provide a node wallet provider.
    // However, if deploying from browser, this would use window.midnight
  };

  console.log("Deploying contract...");
  try {
    const deployed = await deployContract(providers as any, {
      compiledContract: counter,
      privateStateId: 'counter-state',
      initialPrivateState: {}
    });

    console.log('✅ Contract successfully deployed!');
    console.log('✅ Contract Address:', deployed.deployTxData.public.contractAddress);
    console.log('Please copy this address and paste it into your README.md!');
  } catch (err) {
    console.error("Deployment failed:", err);
  }
}

deploy();
