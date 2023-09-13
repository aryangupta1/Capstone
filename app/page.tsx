"use client";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback } from "react";
import {
  ChakraProvider,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Box,
  Spacer,
  Spinner
} from "@chakra-ui/react";
import { load } from "../src/func";
import { DisplayAddress } from "./components/displayAddress";
import { FaEthereum } from "react-icons/fa";


const Home: NextPage = () => {
  const [input, setInput] = React.useState("");
  const [editInput, setEditInput] = React.useState("");
  const [refresh, setRefresh] = React.useState(true);
  const [addressAccount, setAddressAccount] = React.useState(null);
  const [contract, setContract] = React.useState(null);
  const [allData, setData] = React.useState([]);
  const [currentEditingIndex, setCurrentEditingIndex] = React.useState<number | null>(null);

  const handleInputChange = useCallback((e: any) => setInput(e.target.value), []);
  const handleEditInputChange = useCallback((e: any) => setEditInput(e.target.value), []);

  const handleAddData = async () => {
    if (contract && addressAccount) {
      await contract.createData(input, { from: addressAccount });
      setInput("");
      setRefresh(true);
    }
  };

  const handleEditData = async (idx: number) => {
    if (contract && addressAccount) {
      await contract.editData(idx, editInput, { from: addressAccount });
      setEditInput("");
      setCurrentEditingIndex(null);
      setRefresh(true);
    }
  };

  const handleDeleteData = async (idx: number) => {
    if (contract && addressAccount) {
      await contract.deleteData(idx, { from: addressAccount });
      setRefresh(true);
    }
  }

  React.useEffect(() => {
    if (!refresh) return;

    const fetchData = async () => {
      const result = await load();
      setAddressAccount(result.addressAccount);
      setContract(result.storageContract);
      setData(result.allData);
    };

    fetchData()
      .then(() => {
        setRefresh(false);
      })
      .catch((err) => {
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
        <HStack w="full">
          <Spacer />
          <VStack>
            <Heading>Decentralised Data Storage</Heading>
            <Box h="30px" />
            <Input
              type="text"
              size="md"
              placeholder="data"
              onChange={handleInputChange}
              value={input}
            />
            <Button onClick={handleAddData} bg="green.200">
              Add Data
            </Button>
          </VStack>
          <Spacer />
        </HStack>
        <Text>Your Data</Text>
        <DisplayAddress addressAccount={addressAccount} />

        {!allData ? (
          <Spinner />
        ) : (
          allData.map((data, idx) => (
            <HStack key={idx} w="md" bg="gray.100" borderRadius={7}>
              <Box w="5px" />
              {currentEditingIndex === idx ? (
                <>
                  <Input type="text" value={editInput} onChange={handleEditInputChange} />
                  <Button onClick={() => handleEditData(idx)} bg="blue.200">Save</Button>
                  <Button onClick={() => setCurrentEditingIndex(null)} bg="red.200">Cancel</Button>
                </>
              ) : (
                <>
                  <Text>{data.content}</Text>
                  <Spacer />
                  <Button onClick={() => {
                    setEditInput(data.content);
                    setCurrentEditingIndex(idx);
                  }} bg="yellow.200">Edit</Button>
                  <Button onClick={() => handleDeleteData(idx)} bg="red.300">Delete</Button>
                </>
              )}
            </HStack>
          ))
        )}
        <Box h="10px" />
      </VStack>
    </ChakraProvider>
  );
};

export default Home;
