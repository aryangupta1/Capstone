"use client"
import type { NextPage } from 'next'
import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'

import { VStack, HStack, Heading, Text, Button, Input, Box, Spacer, Spinner } from '@chakra-ui/react'
import React from 'react'
import { load } from '../src/func'

const Home: NextPage = () => {
  const [input, setInput] = React.useState<string>('')
  const [refresh, setRefresh] = React.useState<boolean>(true)
  const [addressAccount, setAddressAccount] = React.useState<any>(null)
  const [contract, setContract] = React.useState<any>(null)
  const [allData, setData] = React.useState<any[]>(null)
  // Handlers
  const handleInputChange = (e: any) => setInput(e.currentTarget.value)

  const handleAddData = async () => {
    await contract.createData(input, {from: addressAccount})
    setInput('')
    setRefresh(true)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if(!refresh) return;

    const fetchData = async () => {
        const result = await load();
        setAddressAccount(result.addressAccount)
        setContract(result.storageContract)
        setData(result.allData)
        console.log('Account: ', result.addressAccount);
        console.log('Contract: ', result.storageContract);
        console.log('Data Count: ', result.allData.content);
    };

    fetchData().then(() => {
      setRefresh(false);
    }).catch((err) => {
      console.error("Error loading data:", err);
      setRefresh(false);
    });

}, [refresh]);

  return (
  <ChakraProvider>
    <VStack>
    <Head>
      <title>Decentralised Data Storage</title>
    </Head>
    <HStack w='full'>
      <Spacer />
      <VStack>
        <Heading>Decentralised Data Storage</Heading>
        <Box h='30px' />
        <Input
        type='text'
        size='md'
        placeholder='data'
        onChange={handleInputChange}
        value={input}
        />
        <Button onClick={handleAddData} bg='green.200'>Add Data</Button>
      </VStack>
      <Spacer />
    </HStack>
    <Text>Your Data</Text>
    {
      !allData ? 
      <Spinner /> : 
      allData.map((data, idx) => data.content ?
        <HStack key={idx} w='md' bg='gray.100' borderRadius={7}>
            <Box w='5px' />
            <Text>{data.content}</Text>
            <Spacer />
        </HStack> : null
      )
    }
    <Box h='10px' />
  </VStack>
  </ChakraProvider>
  
  )
}

export default Home