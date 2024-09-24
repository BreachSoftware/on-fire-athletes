"use client";

import { useEffect, useState, createContext, useContext, ReactNode, FC } from "react";
import Gamecoin from "../ABI/Gamecoin.json";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useToast } from "@chakra-ui/react";
import { parseUnits } from "viem";
import { useCurrentCheckout } from "./useCheckout";

// The properties of the useTransfer hook
export interface UseTransferProperties {
  onTransfer: () => void;
  address: `0x${string}` | undefined;
  isFetching: boolean;
  isPending: boolean;
  GMEXPrice: number;
  isComplete: boolean;
  hash: `0x${string}` | undefined;
}

const TransferContext = createContext({} as UseTransferProperties);

/**
 * The useTransfer hook is used to transfer GMEX tokens
 * @returns The data to be used by the useTransfer hook
 */
export function useTransferContext() {
	return useContext(TransferContext);
}

/**
 *  The useTransfer hook is used to transfer GMEX tokens
 * @returns The data to be used by the useTransfer hook
 */
function useTransfer(): UseTransferProperties {
	const CoinAddress = "0xE9d78BF51ae04c7E1263A76ED89a65537B9cA903";
	const { address, } = useAccount();
	const adminAddress = "0x415e077398610Dcd307bE77924856547321A8BE9";
	const [ GMEXPrice, setGMEXPrice ] = useState(0);
	const toast = useToast();
	const [ isComplete, setIsComplete ] = useState(false);

	// Getting the current checkout
	const curCheckout = useCurrentCheckout();
	// Getting the total of the current checkout in USD
	const cartTotal = curCheckout?.checkout.total / 100;

	/**
	 * Fetches the price of GMEX tokens
	 */
	async function fetch_price() {
		const url = `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${CoinAddress}&vs_currencies=usd`;
		const options = {
			method: "GET",
			headers: { "accept": "application/json", "x-cg-demo-api-key": "CG-sA8RXnobr4Vd94RF1ohr8bF9" }
		};
		fetch(url, options)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				const result = Object.keys(data).map((key) => {
					return {
						address: key,
						usd: data[key].usd
					};
				});
				const price = result?.length > 0 ? result[0]?.usd : 0;
				setGMEXPrice(1 / Number(price) * cartTotal * 0.8);
			})
			.catch((err) => {
				console.error(`error:${err}`);
			});
	};

	const { writeContract, isPending, data, error } = useWriteContract();
	const { data: confirm, isError, isFetching } = useWaitForTransactionReceipt({
		hash: data,
	});

	/**
	 * Transfers GMEX tokens
	 */
	async function onTransfer() {
		if (address) {
			writeContract({
				abi: Gamecoin,
				address: CoinAddress,
				functionName: "transfer",
				args: [ adminAddress, parseUnits(GMEXPrice?.toString(), 9) ],
			});

			if (error) {
				console.error("Error: ", error);
				toast({
					title: "Transaction Failed!",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		} else {
			toast({
				title: "Please connect wallet to transfer GMEX tokens!",
				status: "info",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	useEffect(() => {
		if (cartTotal > 0) {
			fetch_price();
		}
	},
	// We only want to run this effect when the cartTotal variable changes
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[ cartTotal ]);

	useEffect(() => {
		if (confirm) {
			setIsComplete(true);
			toast({
				title: "Transaction Successfull!",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		}
		if (isError) {
			toast({
				title: "Transaction Failed!",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	// We only want to run this effect when the confirm or isError variable changes
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ confirm, isError ]);


	return {
		onTransfer: onTransfer,
		address: address,
		isFetching: isFetching,
		isPending: isPending,
		GMEXPrice: GMEXPrice,
		isComplete: isComplete,
		hash: data
	};
}

interface ProvideTransferProps {
	children: ReactNode;
  }

/**
 * The ProvideTransfer component is used to provide the data to the useTransfer hook
 * @param param0 The children of the component
 * @returns The data to be used by the useTransfer hook
 */
// eslint-disable-next-line func-style
export const ProvideTransfer: FC<ProvideTransferProps> = ({ children }) => {
	const transfer = useTransfer();

	return (
		<TransferContext.Provider value={transfer}>
			{children}
		</TransferContext.Provider>
	);
};
