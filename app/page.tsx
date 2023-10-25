"use client";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  ChakraProvider,
  HStack,
  Heading,
  Input,
  Spacer,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { load } from "../src/func";
import { DisplayAddress } from "./components/displayAddress";
import { SHA256 } from "crypto-js"

const Home: NextPage = () => {
  const [input, setInput] = React.useState("");
  const [editInput, setEditInput] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [addressAccount, setAddressAccount] = React.useState(null);
  const [contract, setContract] = React.useState(null);
  const [allData, setData] = React.useState([]);
  const [toBeDeletedIdx, setToBeDeletedIdx] = React.useState<number | null>(null);
  const [toBeEditedIdx, setToBeEditedIdx] = React.useState<number | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [isEditAlertOpen, setIsEditAlertOpen] = React.useState(false);

  const [decryptedContent, setDecryptedContent] = React.useState<Record<number, string>>({});

  const [isBlockMined, setIsBlockMined] = React.useState(false);


  const cancelRef = useRef();

  const handleInputChange = useCallback((e: any) => setInput(e.target.value), []);
  const handleEditInputChange = useCallback((e: any) => setEditInput(e.target.value), []);

  const onCloseDeleteAlert = () => setIsDeleteAlertOpen(false);
  const onCloseEditAlert = () => setIsEditAlertOpen(false);

  const toast = useToast();

  const handleAddData = async () => {
    if (input) {
      try {
        const res = await fetch('http://localhost:3001/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plaintext: input })
        });
        const { dhtKey } = await res.json();
        if (contract && addressAccount) {
          await contract.createData(dhtKey, { from: addressAccount });
          setInput("");
          setRefresh(true);
          setIsBlockMined(false)
        }
      } catch (error) {
        console.error('Error during encryption:', error);
      }
    }
  }

  const handleEditData = async (idx: number) => {
    if (editInput) {
      try {
        const res = await fetch('http://localhost:3001/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plaintext: editInput })
        });
        const { dhtKey } = await res.json();
        if (contract && addressAccount) {
          await contract.editData(idx, dhtKey, { from: addressAccount });
          setEditInput("");
          setToBeEditedIdx(null);
          setRefresh(true);
          setIsBlockMined(false)
        }
      } catch (error) {
        console.error('Error during encryption:', error);
      }
    }
  };

  const handleStartEditing = (idx: number, content: string) => {
    setToBeEditedIdx(idx);
    setEditInput(content);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setToBeEditedIdx(null);
  };

  const handleTriggerEdit = () => {
    setIsEditAlertOpen(true);
    setIsEditing(false);
  };

  const handleDeleteData = async (idx: number) => {
    if (contract && addressAccount) {
      await contract.deleteData(idx, { from: addressAccount });
      setRefresh(true);
      setIsBlockMined(false)
    }
  };

  const handleDeleteDataConfirmed = async () => {
    if (toBeDeletedIdx !== null) await handleDeleteData(toBeDeletedIdx);
    onCloseDeleteAlert();
  };

  const handleEditDataConfirmed = async () => {
    if (toBeEditedIdx !== null) await handleEditData(toBeEditedIdx);
    onCloseEditAlert();
  };

  const handleDecrypt = async (idx: number, dhtKey: string) => {
    try {
      const res = await fetch('http://localhost:3001/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dhtKey })
      });
    
      if (!res.ok) {
        // This will log the error message from the server if there's one, or a generic message
        console.error('Error during decryption:', await res.json().then(obj => obj.message || res.statusText).catch(() => res.statusText));
        return;
      }
      
      const { decryptedData } = await res.json();
        
      // Set the decrypted content in the state
      setDecryptedContent(prev => ({ ...prev, [idx]: decryptedData }));
      setIsBlockMined(false)
    } catch (error) {
      console.error('Error during decryption:', error);
    }

  };
  
  async function mineBlock() {
    try {
      const response = await fetch('http://localhost:3001/mine');
      const { previousHash, difficulty } = await response.json();
    
      let nonce = 0;
      let hash;
      do {
        const data = previousHash + nonce;
        hash = SHA256(data).toString(); // Use SHA256 hashing function
        nonce++;
      } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
      const result = await fetch('http://localhost:3001/submitSolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nonce })
      });
    
      if (result.status === 200) {
        const { message } = await result.json();
        setIsBlockMined(true)
        toast({
          title: "Block successfully mined.",
          description: message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else if (result.status === 400) {
        const { message } = await result.json();
        toast({
          title: "Invalid solution.",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Something went wrong.",
          description: "Please try again later.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
      
    } catch (error) {
      setIsBlockMined(false)
      console.error('Failed to mine block:', error);
      toast({
        title: "Network error.",
        description: "Failed to connect. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
            <Button onClick={mineBlock} bg="blue.200">
              Mine Block
            </Button>
            <Button onClick={handleAddData} bg="green.200" isDisabled={!isBlockMined}>
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
            {isEditing && toBeEditedIdx === idx ? (
              <>
                <Input type="text" value={editInput} onChange={handleEditInputChange} />
                <Button onClick={handleTriggerEdit} bg="blue.200">Edit</Button>
                <Button onClick={handleCancelEditing} bg="red.200">Cancel</Button>
              </>
            ) : (
              <>
                <Text>{decryptedContent[idx] ? decryptedContent[idx] : data.content}</Text>
                <Spacer />
                <Button onClick={() => handleDecrypt(idx, data.content)} bg="blue.300" isDisabled={!isBlockMined}>Decrypt</Button>
                <Button onClick={() => handleStartEditing(idx, data.content)} bg="yellow.200" isDisabled={!isBlockMined}>Edit</Button>
                <Button onClick={() => {
                  setToBeDeletedIdx(idx);
                  setIsDeleteAlertOpen(true);
                }} bg="red.300" isDisabled={!isBlockMined}>Delete</Button>
              </>
            )}
          </HStack>
        ))
      )}
      </VStack>

      {/* Delete AlertDialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDeleteAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Data
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this data? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteDataConfirmed} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Edit AlertDialog */}
      <AlertDialog
        isOpen={isEditAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseEditAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Edit Data
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to edit this data? This action will overwrite the existing data.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseEditAlert}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleEditDataConfirmed} ml={3}>
                Edit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
};

export default Home;
