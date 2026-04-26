import React, { useEffect, useState } from "react";
import api from "../config/api";
import {
  Button,
  Container,
  HStack,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import CoinCard from "./CoinCard";

const TOTAL_PAGES = 10;

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");
  const [search, setSearch] = useState("");

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  useEffect(() => {
    setLoading(true);
    api
      .get("/coins", { params: { currency, page } })
      .then(({ data }) => {
        setCoins(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [currency, page]);

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <ErrorComponent message={"Error While Fetching Coins"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <HStack p={"8"} justifyContent="space-between" wrap="wrap">
            <RadioGroup value={currency} onChange={(v) => { setCurrency(v); setPage(1); }}>
              <HStack spacing={"4"}>
                <Radio value={"inr"}>INR</Radio>
                <Radio value={"usd"}>USD</Radio>
                <Radio value={"eur"}>EUR</Radio>
              </HStack>
            </RadioGroup>
            <Input
              placeholder="Search coins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxW="250px"
            />
          </HStack>

          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {filtered.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                name={i.name}
                price={i.current_price}
                img={i.image}
                symbol={i.symbol}
                currencySymbol={currencySymbol}
              />
            ))}
          </HStack>

          <HStack w={"full"} overflowX={"auto"} p={"8"} justifyContent="center">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => (
              <Button
                key={i + 1}
                bgColor={page === i + 1 ? "teal.500" : "blackAlpha.900"}
                color={"white"}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;
