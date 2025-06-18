'use client';

import {
  Flex,
  Heading,
  Icon,
  Link,
  Text,
  Avatar
} from '@chakra-ui/react';
import {
  FiHome,
  FiBook,
  FiAward,
  FiHeart
} from 'react-icons/fi';

export const Sidebar = () => {
  return (
    <Flex
      w={["100%", "100%", "10%", "15%", "15%"]}
      flexDir="column"
      alignItems="center"
      backgroundColor="#020202"
      color="#fff"
    >
      <Flex
        flexDir="column"
        h={["auto", "auto", "100vh"]}
        justifyContent="space-between"
      >
        {/* Navigation Section */}
        <Flex flexDir="column" as="nav">
          <Heading
            mt={10}
            mb={[6, 12, 16]}
            fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
            alignSelf="center"
            letterSpacing="tight"
          >
            Webkiosk
          </Heading>

          <Flex
            flexDir={["row", "row", "column", "column", "column"]}
            align={["center", "center", "center", "flex-start", "flex-start"]}
            wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
            justifyContent="center"
            px={2}
            gap={4}
          >
            {/* Home */}
            <Flex className="sidebar-items" align="center" gap={2}>
              <Link href="/" display={["none", "none", "flex"]}>
                <Icon as={FiHome} fontSize="2xl" className="active-icon" />
              </Link>
              <Link href="/" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                <Text className="active">Home</Text>
              </Link>
            </Flex>

            {/* Credit */}
            <Flex className="sidebar-items" align="center" gap={2}>
              <Link href="/marks" display={["none", "none", "flex"]}>
                <Icon as={FiBook} fontSize="2xl" />
              </Link>
              <Link href="/marks" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                <Text>Subject Wise Marks</Text>
              </Link>
            </Flex>

            {/* Wallet */}
            <Flex className="sidebar-items" align="center" gap={2}>
              <Link href="/subjectGrades" display={["none", "none", "flex"]}>
                <Icon as={FiAward} fontSize="2xl" />
              </Link>
              <Link href="/subjectGrades" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                <Text>Subject Grades</Text>
              </Link>
            </Flex>

            {/* Services */}
            <Flex className="sidebar-items" align="center" gap={2}>
              <Link href="/CGPAreport" display={["none", "none", "flex"]}>
                <Icon as={FiHeart} fontSize="2xl" />
              </Link>
              <Link href="/CGPAreport" _hover={{ textDecor: 'none' }} display={["flex", "flex", "none", "flex", "flex"]}>
                <Text>CGPA Report</Text>
              </Link>
            </Flex>
          </Flex>
        </Flex>

        
      </Flex>
    </Flex>
  );
};
