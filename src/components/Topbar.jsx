'use client';

import { useDashboard } from "@/context/dashboardContext";
import { Box, Container, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const Topbar = () => {
  const { data } = useDashboard();
  const router = useRouter();

  if (!data) return null;

  const { studentProfile } = data;

  const handleSignOut = async () => {
    await fetch("/api/signout", { method: "GET" });
    router.push("/login");
  };

  return (
    <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" py={6}>
          <Box>
            <Heading size="xl" color="gray.900">
              Welcome back, <Text as="span" color="#640000">{studentProfile.name}</Text>
            </Heading>
            <Text color="gray.600" mt={1}>{studentProfile.course}</Text>
          </Box>

          <Button onClick={handleSignOut} bg="#640000" color="white" _hover={{ bg: "#500000" }}>
            Sign Out
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};
