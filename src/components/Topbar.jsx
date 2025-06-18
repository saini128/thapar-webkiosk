'use client';

import { useDashboard } from "@/context/dashboardContext";
import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const Topbar = () => {
  const { data } = useDashboard();
  const router = useRouter();

  if (!data) return null;

  const { studentProfile } = data;

  const handleSignOut = async () => {
    localStorage.removeItem("dashboardData");
    await fetch("/api/signout", { method: "GET" });
    router.push("/login");
  };

  return (
    <Box 
      bg="white" 
      shadow="sm" 
      borderBottom="1px" 
      borderColor="gray.200"
      w="100%"
      maxW="100%"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        py={6}
        px={{ base: 4, md: 6, lg: 8 }}
        w="100%"
        maxW="100%"
      >
        <Box flex="1">
          <Heading 
            size={{ base: "lg", md: "xl" }} 
            color="gray.900"
            lineHeight="1.2"
          >
            Welcome back, <Text as="span" color="#640000">{studentProfile.name}</Text>
          </Heading>
          <Text 
            color="gray.600" 
            mt={1}
            fontSize={{ base: "sm", md: "md" }}
          >
            {studentProfile.course}
          </Text>
        </Box>

        <Button 
          onClick={handleSignOut} 
          bg="#640000" 
          color="white" 
          _hover={{ bg: "#500000" }}
          _active={{ bg: "#400000" }}
          size={{ base: "sm", md: "md" }}
          px={{ base: 4, md: 6 }}
          flexShrink={0}
          ml={4}
        >
          Sign Out
        </Button>
      </Flex>
    </Box>
  );
};