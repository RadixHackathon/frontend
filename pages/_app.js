import '@/styles/globals.css';
import { RdtProvider } from '@/components/RdtProvider';
import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit';

export default function App({ Component, pageProps }) {
  return (
    <>
      <RdtProvider
        value={RadixDappToolkit(
          {
            dAppName: 'AlkyneFi',
            dAppDefinitionAddress: 'account_tdx_b_1ppglnkmukh36l2dfw3uygvgjf2jsfypl885u9840md7swrvpmj',
          },
          (requestData) => {
            requestData({
              accounts: { quantifier: 'atLeast', quantity: 1 },
            });
          },
          {
            networkId: 11,
          }
        )}
      >
        <Component {...pageProps} />
      </RdtProvider>
    </>
  );
}
