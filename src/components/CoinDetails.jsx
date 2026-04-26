import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import Chart from "./Chart";
import ErrorComponent from "./ErrorComponent";
import Loader from "./Loader";

const CoinDetails = () => {
  const params = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"];

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const [{ data }, { data: chartData }] = await Promise.all([
          api.get(`/coins/${params.id}`),
          api.get(`/coins/${params.id}/chart`, {
            params: { currency, days },
          }),
        ]);
        setCoin(data.data);
        setChartArray(chartData.data.prices || []);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [params.id, currency, days]);

  const handleAddToWatchlist = async () => {
    if (!user) { toast({ title: "Please login first", status: "warning", duration: 2000 }); return; }
    try {
      await api.post("/user/watchlist", {
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image?.large,
      });
      toast({ title: "Added to watchlist", status: "success", duration: 2000 });
    } catch (err) {
      toast({ title: err?.response?.data?.error?.message || "Failed", status: "error", duration: 2000 });
    }
  };

  const handleAddToPortfolio = async () => {
    if (!qty || !buyPrice) { toast({ title: "Enter quantity and buy price", status: "warning", duration: 2000 }); return; }
    try {
      await api.post("/user/portfolio", {
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image?.large,
        quantity: Number(qty),
        buyPrice: Number(buyPrice),
      });
      toast({ title: "Added to portfolio", status: "success", duration: 2000 });
      onClose();
    } catch (err) {
      toast({ title: err?.response?.data?.error?.message || "Failed", status: "error", duration: 2000 });
    }
  };

  const high = coin.market_data?.high_24h?.[currency];
  const low = coin.market_data?.low_24h?.[currency];
  const current = coin.market_data?.current_price?.[currency];
  const rangeValue = high && low && high !== low ? ((current - low) / (high - low)) * 100 : 50;

  if (error) return <ErrorComponent message={"Error While Fetching Coin"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box width={"full"} borderWidth={1}>
            <Chart arr={chartArray} currency={currencySymbol} days={days} />
          </Box>

          <HStack p="4" overflowX={"auto"}>
            {btns.map((i) => (
              <Button
                disabled={days === i}
                key={i}
                onClick={() => setDays(i)}
              >
                {i}
              </Button>
            ))}
          </HStack>

          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          {user && (
            <HStack px="8" pb="4" spacing="4">
              <Button colorScheme="teal" size="sm" onClick={handleAddToWatchlist}>
                + Watchlist
              </Button>
              <Button colorScheme="purple" size="sm" onClick={onOpen}>
                + Portfolio
              </Button>
            </HStack>
          )}

          <VStack spacing={"4"} p="16" alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf="center" opacity={0.7}>
              Last Updated On{" "}
              {coin.market_data?.last_updated
                ? new Date(coin.market_data.last_updated).toLocaleString()
                : "Unavailable"}
            </Text>

            <Image
              src={coin.image?.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />

            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data?.current_price?.[currency] ?? "NA"}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    (coin.market_data?.price_change_percentage_24h || 0) > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data?.price_change_percentage_24h ?? "0"}%
              </StatHelpText>
            </Stat>

            <Badge
              fontSize={"2xl"}
              bgColor={"blackAlpha.800"}
              color={"white"}
            >{`#${coin.market_cap_rank}`}</Badge>

            <CustomBar
              high={`${currencySymbol}${high ?? "NA"}`}
              low={`${currencySymbol}${low ?? "NA"}`}
              value={rangeValue}
            />

            <Box w={"full"} p="4">
              <Item title={"Max Supply"} value={coin.market_data?.max_supply ?? "NA"} />
              <Item title={"Circulating Supply"} value={coin.market_data?.circulating_supply ?? "NA"} />
              <Item title={"Market Cap"} value={`${currencySymbol}${coin.market_data?.market_cap?.[currency] ?? "NA"}`} />
              <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data?.atl?.[currency] ?? "NA"}`} />
              <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data?.ath?.[currency] ?? "NA"}`} />
            </Box>
          </VStack>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add {coin.name} to Portfolio</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing="4">
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                  <Input
                    placeholder={`Buy Price (${currencySymbol})`}
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="purple" mr="3" onClick={handleAddToPortfolio}>
                  Add
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{title}</Text>
    <Text>{value}</Text>
  </HStack>
);

const CustomBar = ({ high, low, value }) => (
  <VStack w={"full"}>
    <Progress value={value} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge colorScheme={"red"}>{low}</Badge>
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge colorScheme={"green"}>{high}</Badge>
    </HStack>
  </VStack>
);

export default CoinDetails;
