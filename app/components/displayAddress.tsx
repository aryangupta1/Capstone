import { Box, Text, Tooltip, Icon } from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import React from "react";

interface DisplayAddressProps {
  addressAccount: string | null;
}

export const DisplayAddress: React.FC<DisplayAddressProps> = ({ addressAccount }) => {
  const truncateAddress = (address: string | null): string => {
    return address
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : '';
  };

  return (
    <Box display="flex" alignItems="center" mb="2">
      <Icon as={FaEthereum} mr="2" />
      <Text mr="1">Data for account:</Text>
      <Tooltip label={addressAccount || ''} aria-label="Full Ethereum Address">
        <Text color="blue.500" cursor="pointer">
          {truncateAddress(addressAccount)}
        </Text>
      </Tooltip>
    </Box>
  );
}
