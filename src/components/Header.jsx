import { Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <HStack
      px={"8"}
      py={"4"}
      shadow={"base"}
      bgColor={"blackAlpha.900"}
      justifyContent={"space-between"}
    >
      <Text color={"white"} fontWeight={"bold"} letterSpacing={"widest"} fontSize={"lg"}>
        Xcrypto Pro
      </Text>

      <HStack spacing={"6"}>
        <Link to="/"><Text color={"white"}>Home</Text></Link>
        <Link to="/exchanges"><Text color={"white"}>Exchanges</Text></Link>
        <Link to="/coins"><Text color={"white"}>Coins</Text></Link>
        <Link to="/news"><Text color={"white"}>News</Text></Link>

        {user ? (
          <Menu>
            <MenuButton as={Button} colorScheme="teal" size="sm">
              {user.name}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/portfolio")}>Portfolio</MenuItem>
              <MenuItem onClick={() => navigate("/watchlist")}>Watchlist</MenuItem>
              <MenuItem onClick={handleLogout} color="red.400">Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <HStack spacing={"3"}>
            <Button size="sm" variant="outline" colorScheme="teal" as={Link} to="/login">
              Login
            </Button>
            <Button size="sm" colorScheme="teal" as={Link} to="/register">
              Register
            </Button>
          </HStack>
        )}
      </HStack>
    </HStack>
  );
};

export default Header;
