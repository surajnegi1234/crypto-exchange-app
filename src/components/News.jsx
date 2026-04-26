import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Image,
  Link,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import api from "../config/api";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/news")
      .then(({ data }) => {
        setNews(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (error) return <ErrorComponent message="Error fetching news. Please try again later." />;

  return (
    <Container maxW="container.lg" py="8">
      <Heading mb="6">Crypto News</Heading>
      {loading ? (
        <Loader />
      ) : (
        <VStack spacing="4" align="stretch">
          {news.length === 0 ? (
            <Text opacity={0.6}>No news available right now.</Text>
          ) : (
            news.map((item) => (
              <Link key={item.id} href={item.url} isExternal _hover={{ textDecoration: "none" }}>
                <Box p="4" borderWidth={1} borderRadius="lg" shadow="sm" _hover={{ shadow: "md", borderColor: "teal.400" }} transition="all 0.2s">
                  <HStack spacing="4" alignItems="flex-start">
                    {item.image && (
                      <Image src={item.image} w="24" h="16" objectFit="cover" borderRadius="md" flexShrink={0} />
                    )}
                    <VStack align="start" spacing="1" flex={1}>
                      <Text fontWeight="semibold">{item.title}</Text>
                      {item.description && (
                        <Text fontSize="sm" opacity={0.7} noOfLines={2}>{item.description}</Text>
                      )}
                      <Text fontSize="xs" opacity={0.5}>
                        {item.source} · {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ""}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Link>
            ))
          )}
        </VStack>
      )}
    </Container>
  );
};

export default News;
