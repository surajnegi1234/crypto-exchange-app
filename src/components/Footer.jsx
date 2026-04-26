import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Box
      bgColor={"blackAlpha.900"}
      color={"whiteAlpha.700"}
      minH={"24"}
      px={"16"}
      py={"8"}
    >
      <Stack direction={["column", "row"]} h={"full"} alignItems={"center"}>
        <VStack w={"full"} alignItems={["center", "flex-start"]}>
          <Text fontWeight={"bold"}>Xcrypto Pro</Text>
          <Text fontSize={"sm"} letterSpacing={"widest"} textAlign={["center", "left"]}>
            Your trusted crypto tracking platform. Live prices, portfolio management and market news.
          </Text>
        </VStack>
        <VStack alignItems={["center", "flex-end"]} w={"full"}>
          <Text fontSize={"sm"}>© {new Date().getFullYear()} Xcrypto Pro. All rights reserved.</Text>
        </VStack>
      </Stack>
    </Box>
  );
};

export default Footer;
