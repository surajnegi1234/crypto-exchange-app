import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast({ title: "Logged in!", status: "success", duration: 2000 });
      navigate("/");
    } catch (err) {
      toast({
        title: err?.response?.data?.error?.message || "Login failed",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="sm" py="16">
      <Box p="8" borderWidth={1} borderRadius="lg" shadow="lg">
        <VStack spacing="6" as="form" onSubmit={handleSubmit}>
          <Heading size="lg">Login</Heading>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal" w="full" isLoading={loading}>
            Login
          </Button>
          <Text fontSize="sm">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "teal" }}>
              Register
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
