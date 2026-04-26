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

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast({ title: "Account created!", status: "success", duration: 2000 });
      navigate("/");
    } catch (err) {
      toast({
        title: err?.response?.data?.error?.message || "Registration failed",
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
          <Heading size="lg">Register</Heading>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal" w="full" isLoading={loading}>
            Register
          </Button>
          <Text fontSize="sm">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "teal" }}>
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
