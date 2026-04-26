import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import btcSrc from "../assets/btc.png";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <Box
      bgGradient={"linear(to-br, blackAlpha.900, gray.900, black)"}
      w={"full"}
      h={"85vh"}
      overflow={"hidden"}
      position={"relative"}
    >
      <Box
        position={"absolute"}
        inset={0}
        bgGradient={"radial(circle at top, whiteAlpha.200, transparent 45%)"}
      />
      <motion.div
        style={{
          height: "80vh",
          position: "relative",
        }}
        animate={{
          translateY: "20px",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          w={"full"}
          h={"full"}
          objectFit={"contain"}
          src={btcSrc}
          filter={"grayscale(1)"}
        />
      </motion.div>

      <Text
        position={"relative"}
        fontSize={"6xl"}
        textAlign={"center"}
        fontWeight={"thin"}
        color={"whiteAlpha.700"}
        mt={"-20"}
      >
        Xcrypto
      </Text>
    </Box>
  );
};

export default Home;
