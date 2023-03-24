import { useEffect, useState } from "react";
import { State, RadixDappToolkit } from "@radixdlt/radix-dapp-toolkit";
// import { useContext } from "react";
// import { RdtContext } from "../rdt-context";

export const useRdt = () => {
  const rdt = RadixDappToolkit(
    {
      dAppDefinitionAddress:
        'account_tdx_22_1pz7vywgwz4fq6e4v3aeeu8huamq0ctmsmzltay07vzpqm82mp5',
      dAppName: 'Name of your dApp',
    },
    (requestData) => {
      requestData({
        accounts: { quantifier: 'atLeast', quantity: 1 },
      }).map(({ data: { accounts } }) => {
        // set your application state
      })
    },
    {
      networkId: 11,
      onDisconnect: () => {
        // clear your application state
      },
      onInit: ({ accounts }) => {
        // set your initial application state
      },
    }
  )

  return rdt;
};

const useRdtState = () => {
  const rdt = useRdt();
  const [state, setState] = useState();

  useEffect(() => {
    const subscription = rdt?.state$.subscribe((state) => {
      setState(state);
    });

    return () => {
      subscription?.unsubscribe();
    };
  });

  return state;
};

export const useConnected = () => {
  const state = useRdtState();

  return state?.connected ?? false;
};
