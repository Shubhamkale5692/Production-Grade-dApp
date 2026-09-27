import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';

export const indexerUrl = 'https://indexer.preprod.midnight.network/graphql';
export const proofServerUrl = 'https://proof.preprod.midnight.network';
export const zkConfigUrl = 'https://preprod.midnight.network/zk-config';

export async function initializeProviders(walletApi: any): Promise<any> {
    const fetchFn = globalThis.fetch.bind(globalThis) as any;
    const zkConfigProvider = new FetchZkConfigProvider(zkConfigUrl, fetchFn);
    
    const privateStateProvider = levelPrivateStateProvider({
        privateStoragePasswordProvider: async () => 'midnight-browser-db-password',
        accountId: 'browser-user-1'
    });

    const publicDataProvider = indexerPublicDataProvider(
        indexerUrl, 
        indexerUrl.replace('http', 'ws')
    );

    const proofProvider = httpClientProofProvider(proofServerUrl, zkConfigProvider);

    return {
        privateStateProvider,
        publicDataProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider: walletApi
    };
}
