import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const Watchlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get("/user/watchlist").then(({ data }) => {
      setWatchlist(data.data);
      setLoading(false);
    });
  }, [user, navigate]);

  const handleRemove = async (coinId) => {
    try {
      const { data } = await api.delete(`/user/watchlist/${coinId}`);
      setWatchlist(data.data);
      toast({ title: "Removed from watchlist", status: "info", duration: 2000 });
    } catch {
      toast({ title: "Failed to remove", status: "error", duration: 2000 });
    }
  };

  if (loading) return <Loader />;

  return (
    <Container maxW="container.xl" py="8">
      <Heading mb="6">My Watchlist</Heading>
      {watchlist.length === 0 ? (
        <Text opacity={0.6}>No coins in watchlist. Add from a coin's detail page.</Text>
      ) : (
        <HStack wrap="wrap" justifyContent="flex-start">
          {watchlist.map((w) => (
            <VStack
              key={w.coinId}
              w="52"
              shadow="lg"
              p="6"
              borderRadius="lg"
              m="3"
              borderWidth={1}
            >
              {w.image && <Image src={w.image} w="10" h="10" objectFit="contain" />}
              <Text fontWeight="bold">{w.symbol.toUpperCase()}</Text>
              <Text fontSize="sm" noOfLines={1}>{w.name}</Text>
              <Link to={`/coin/${w.coinId}`}>
                <Button size="xs" colorScheme="teal" variant="outline">View</Button>
              </Link>
              <Button size="xs" colorScheme="red" variant="ghost" onClick={() => handleRemove(w.coinId)}>
                Remove
              </Button>
            </VStack>
          ))}
        </HStack>
      )}
    </Container>
  );
};

export default Watchlist;
