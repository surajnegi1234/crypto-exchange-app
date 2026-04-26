import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const Portfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get("/user/portfolio").then(({ data }) => {
      setPortfolio(data.data);
      setLoading(false);
    });
  }, [user, navigate]);

  useEffect(() => {
    if (!portfolio.length) return;
    const ids = portfolio.map((p) => p.coinId).join(",");
    api.get("/coins", { params: { currency: "inr", perPage: 250 } }).then(({ data }) => {
      const map = {};
      data.data.forEach((c) => { map[c.id] = c.current_price; });
      setPrices(map);
    });
  }, [portfolio]);

  const handleRemove = async (coinId) => {
    try {
      const { data } = await api.delete(`/user/portfolio/${coinId}`);
      setPortfolio(data.data);
      toast({ title: "Removed from portfolio", status: "info", duration: 2000 });
    } catch {
      toast({ title: "Failed to remove", status: "error", duration: 2000 });
    }
  };

  const totalInvested = portfolio.reduce((s, p) => s + p.buyPrice * p.quantity, 0);
  const totalCurrent = portfolio.reduce((s, p) => s + (prices[p.coinId] || p.buyPrice) * p.quantity, 0);
  const pnl = totalCurrent - totalInvested;

  if (loading) return <Loader />;

  return (
    <Container maxW="container.xl" py="8">
      <Heading mb="6">My Portfolio</Heading>
      {portfolio.length === 0 ? (
        <Text opacity={0.6}>No coins in portfolio. Add from a coin's detail page.</Text>
      ) : (
        <>
          <HStack mb="6" spacing="8">
            <Box p="4" borderWidth={1} borderRadius="lg">
              <Text fontSize="sm" opacity={0.6}>Invested</Text>
              <Text fontWeight="bold">₹{totalInvested.toLocaleString()}</Text>
            </Box>
            <Box p="4" borderWidth={1} borderRadius="lg">
              <Text fontSize="sm" opacity={0.6}>Current Value</Text>
              <Text fontWeight="bold">₹{totalCurrent.toLocaleString()}</Text>
            </Box>
            <Box p="4" borderWidth={1} borderRadius="lg">
              <Text fontSize="sm" opacity={0.6}>P&L</Text>
              <Text fontWeight="bold" color={pnl >= 0 ? "green.400" : "red.400"}>
                {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString()}
              </Text>
            </Box>
          </HStack>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Coin</Th>
                  <Th isNumeric>Qty</Th>
                  <Th isNumeric>Buy Price</Th>
                  <Th isNumeric>Current</Th>
                  <Th isNumeric>P&L</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {portfolio.map((p) => {
                  const cur = prices[p.coinId] || p.buyPrice;
                  const itemPnl = (cur - p.buyPrice) * p.quantity;
                  return (
                    <Tr key={p.coinId}>
                      <Td>
                        <HStack>
                          {p.image && <Image src={p.image} w="6" h="6" objectFit="contain" />}
                          <Text>{p.name}</Text>
                          <Text opacity={0.5} fontSize="sm">{p.symbol.toUpperCase()}</Text>
                        </HStack>
                      </Td>
                      <Td isNumeric>{p.quantity}</Td>
                      <Td isNumeric>₹{p.buyPrice.toLocaleString()}</Td>
                      <Td isNumeric>₹{cur.toLocaleString()}</Td>
                      <Td isNumeric color={itemPnl >= 0 ? "green.400" : "red.400"}>
                        {itemPnl >= 0 ? "+" : ""}₹{itemPnl.toFixed(2)}
                      </Td>
                      <Td>
                        <Button size="xs" colorScheme="red" onClick={() => handleRemove(p.coinId)}>
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Portfolio;
