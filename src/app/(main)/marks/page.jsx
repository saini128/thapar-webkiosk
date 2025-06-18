'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Card,
  Stat,
  Table,
  Badge,
  Icon,
  Container,
  VStack,
  HStack,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';

import {
  FiBook,
  FiAward,
  FiTrendingUp,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiPercent,
} from 'react-icons/fi';

import { useDashboard } from '@/context/dashboardContext';
import { Topbar } from '@/components/Topbar';

const StatCard = ({ icon, title, value, subtitle, ...props }) => {
  return (
    <Card.Root borderLeft="4px" borderLeftColor="#640000" w="full" {...props}>
      <Card.Body>
        <Flex justify="space-between" align="center">
          <Box>
            <Stat.Root>
              <Stat.Label color="gray.600" fontSize="sm" fontWeight="medium">
                {title}
              </Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold" color="gray.900">
                {value}
              </Stat.ValueText>
              {subtitle && (
                <Stat.HelpText color="gray.500" fontSize="sm" mt={1}>
                  {subtitle}
                </Stat.HelpText>
              )}
            </Stat.Root>
          </Box>
          <Box p={3} bg="#640000" borderRadius="full">
            <Icon as={icon} w={6} h={6} color="white" />
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

const Dashboard = () => {
  const { data } = useDashboard();

  // Always call hooks unconditionally
  const [selectedExamCode, setSelectedExamCode] = useState('all');
  const [isInitialized, setIsInitialized] = useState(false);

  // Safe fallback if data is null
  const marks = data?.marks || [];

  // Calculate available exam codes using useMemo
  const availableExamCodes = useMemo(() => {
    const examCodes = [...new Set(marks.map(mark => mark.examCode))];
    return examCodes.sort((a, b) => {
      const getYear = (code) => parseInt(code.substring(0, 4));
      const getSemType = (code) => code.includes('ODD') ? 0 : 1;

      const yearA = getYear(a);
      const yearB = getYear(b);

      if (yearA !== yearB) return yearB - yearA;
      return getSemType(b) - getSemType(a);
    });
  }, [marks]);

  // Only set default filters once when component first loads
  useEffect(() => {
    if (availableExamCodes.length > 0 && !isInitialized) {
      setSelectedExamCode(availableExamCodes[0]); // default to latest
      setIsInitialized(true);
    }
  }, [availableExamCodes, isInitialized]);

  if (!data) return null;

  const {
    enrollmentNo,
    studentProfile,
    marks: allMarks,
    subjectGrades,
    cgpaReports,
    timestamp,
  } = data;

  // Filter marks based on selected exam code and sort alphabetically by subject
  const filteredMarks = (selectedExamCode === 'all' 
    ? allMarks 
    : allMarks.filter(mark => mark.examCode === selectedExamCode))
    .sort((a, b) => a.subject.localeCompare(b.subject));

  // Convert exam codes to readable format
  const formatExamCode = (examCode) => {
    const year = examCode.substring(0, 4);
    const semType = examCode.includes('ODD') ? 'Odd' : 'Even';
    return `${year} ${semType}`;
  };

  // Calculate statistics
  const totalMarks = filteredMarks.length;
  const totalEffectiveMarks = filteredMarks.reduce((sum, mark) => sum + mark.effectiveMarks, 0);
  const totalWeightage = filteredMarks.reduce((sum, mark) => sum + (mark.weightage || mark.fullMarks), 0);
  
  // Calculate performance percentages
  const performancePercentages = filteredMarks.map(mark => {
    const weightage = mark.weightage || mark.fullMarks;
    return (mark.effectiveMarks / weightage) * 100;
  });
  
  const goodPerformance = performancePercentages.filter(perc => perc >= 60).length;
  const poorPerformance = performancePercentages.filter(perc => perc <= 25).length;
  
  const averagePercentage = filteredMarks.length > 0
    ? Math.round(filteredMarks.reduce((sum, mark) => sum + ((mark.obtainedMarks / mark.fullMarks) * 100), 0) / filteredMarks.length)
    : 0;

  const statistics = {
    totalMarks,
    totalEffectiveMarks: totalEffectiveMarks.toFixed(2),
    totalWeightage: totalWeightage.toFixed(2),
    goodPerformance,
    poorPerformance,
    averagePercentage
  };

  const renderMarks = () => (
    <Box w="full" px={{ base: 4, md: 6, lg: 8 }} py={6}>
      <VStack spacing={6} align="stretch" w="full">
        {/* Page Header */}
        <Box>
          <Heading size="2xl" color="gray.900" mb={2}>Detailed Marks</Heading>
          <Text color="gray.600" fontSize="lg">
            View and analyze your exam results with detailed statistics
          </Text>
        </Box>

        {/* Statistics Cards */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} w="full">
          <StatCard
            icon={FiBook}
            title="Total Exams"
            value={statistics.totalMarks}
            subtitle={`${statistics.totalEffectiveMarks}/${statistics.totalWeightage} marks`}
          />
          <StatCard
            icon={FiTrendingUp}
            title="Good Performance"
            value={statistics.goodPerformance}
            subtitle="≥60% (Effective/Weightage)"
          />
          <StatCard
            icon={FiXCircle}
            title="Poor Performance"
            value={statistics.poorPerformance}
            subtitle="≤25% (Effective/Weightage)"
          />
          <StatCard
            icon={FiPercent}
            title="Average Marks"
            value={`${statistics.averagePercentage}%`}
            subtitle="Overall Performance"
          />
        </Grid>

        {/* Filter Section */}
        <Card.Root w="full">
          <Card.Header>
            <Flex align="center" gap={3} wrap="wrap">
              <Icon as={FiFilter} color="#640000" />
              <Heading size="md" color="gray.900">Filter by Exam Code</Heading>
            </Flex>
          </Card.Header>
          <Card.Body>
            <Flex wrap="wrap" gap={3}>
              <Button
                size="sm"
                variant={selectedExamCode === 'all' ? 'solid' : 'outline'}
                bg={selectedExamCode === 'all' ? '#640000' : 'transparent'}
                color={selectedExamCode === 'all' ? 'white' : '#640000'}
                borderColor="#640000"
                _hover={{
                  bg: selectedExamCode === 'all' ? '#500000' : '#640000',
                  color: 'white'
                }}
                onClick={() => setSelectedExamCode('all')}
              >
                All Exams ({allMarks.length})
              </Button>
              {availableExamCodes.map((examCode) => (
                <Button
                  key={examCode}
                  size="sm"
                  variant={selectedExamCode === examCode ? 'solid' : 'outline'}
                  bg={selectedExamCode === examCode ? '#640000' : 'transparent'}
                  color={selectedExamCode === examCode ? 'white' : '#640000'}
                  borderColor="#640000"
                  _hover={{
                    bg: selectedExamCode === examCode ? '#500000' : '#640000',
                    color: 'white'
                  }}
                  onClick={() => setSelectedExamCode(examCode)}
                >
                  {formatExamCode(examCode)} ({allMarks.filter(m => m.examCode === examCode).length})
                </Button>
              ))}
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Marks Table */}
        <Card.Root w="full">
          <Card.Header>
            <Heading size="lg" color="gray.900">
              {selectedExamCode === 'all'
                ? 'All Exam Results'
                : `${formatExamCode(selectedExamCode)} Results`}
            </Heading>
            <Text color="gray.600" mt={1}>
              Showing {filteredMarks.length} result{filteredMarks.length !== 1 ? 's' : ''}
              {selectedExamCode !== 'all' && ` for ${formatExamCode(selectedExamCode)}`}
            </Text>
          </Card.Header>
          <Card.Body>
            {filteredMarks.length > 0 ? (
              <Box overflowX="auto">
                <Table.Root variant="simple">
                  <Table.Header bg="red.50">
                    <Table.Row>
                      <Table.ColumnHeader color="#640000">Subject</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000">Exam Code</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000">Event</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000" isNumeric>Obtained</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000" isNumeric>Full Marks</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000" isNumeric>Percentage</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000" isNumeric>Effective</Table.ColumnHeader>
                      <Table.ColumnHeader color="#640000">Status</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredMarks.map((mark, index) => (
                      <Table.Row key={index} _hover={{ bg: "gray.50" }}>
                        <Table.Cell fontWeight="medium">{mark.subject}</Table.Cell>
                        <Table.Cell color="gray.500">{mark.examCode}</Table.Cell>
                        <Table.Cell color="gray.500">{mark.event}</Table.Cell>
                        <Table.Cell isNumeric fontWeight="medium">{mark.obtainedMarks}</Table.Cell>
                        <Table.Cell isNumeric color="gray.500">{mark.fullMarks}</Table.Cell>
                        <Table.Cell isNumeric fontWeight="medium" color="gray.900">
                          {Math.round((mark.obtainedMarks / mark.fullMarks) * 100)}%
                        </Table.Cell>
                        <Table.Cell isNumeric fontWeight="medium">{mark.effectiveMarks}</Table.Cell>
                        <Table.Cell>
                          <Badge 
                            colorScheme={mark.status === 'Pass' ? 'green' : 'red'}
                            variant="subtle"
                          >
                            {mark.status}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            ) : (
              <Box textAlign="center" py={12}>
                <Icon as={FiBook} w={12} h={12} color="gray.400" mb={4} />
                <Heading size="md" color="gray.500" mb={2}>No results found</Heading>
                <Text color="gray.400">
                  No exam results match the selected exam code. Try selecting a different exam code.
                </Text>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );

  return (
    <Box minH="100vh" bg="gray.50" w="100vw" maxW="100%" overflowX="hidden">
      {/* Header */}
      <Topbar />

      {/* Main Content */}
      {renderMarks()}
    </Box>
  );
};

export default Dashboard;