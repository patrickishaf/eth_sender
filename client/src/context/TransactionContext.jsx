import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    console.log('INSIDE THE GET ETHEREUM CONTRACT METHOD');
    const provider = new ethers.providers.Web3Provider(ethereum);
    console.log('THE PROVIDER IS', provider);
    const signer = provider.getSigner();
    console.log('THE SIGNER IS', signer);
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log('THE CONTRACT IS', transactionContract);

    console.log({
        provider,
        signer,
        transactionContract,
    })
}

export const TransactionProvider = ({ children }) => {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value})); 
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                return alert("Please install Metamask");
            }
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log('THE ETHEREUM ACCOUNTS IN THIS BITCH ARE', accounts);
    
            if (accounts.length) {
                setConnectedAccount(accounts[0]);
            } else {
                console.log('No accounts found');
            }
        } catch (error) {
            console.log(error);

            throw new Error('No ethereum object');
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setConnectedAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error('No ethereum object');
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert('Please install Metamask');

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: connectedAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
            });
            
            setIsLoading(true);

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            console.log('Loading -', transactionHash.hash);

            await transactionHash.wait();

            setIsLoading(false);
            console.log('Success -', transactionHash.hash);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            
            throw new Error('No ethereum object')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}