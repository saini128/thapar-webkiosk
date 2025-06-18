'use client';

import React, { useState, useMemo } from 'react';
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
  Tabs,
  Icon,
  Container,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  FiBook, FiAward, FiTrendingUp, FiUser, 
  FiMail, FiPhone, FiMapPin, FiCalendar, FiHome
} from 'react-icons/fi';
import { useDashboard } from '@/context/dashboardContext';
import { Topbar } from '@/components/Topbar';

// Mock data matching your models structure
const mockData = {
  studentProfile: {
    name: "John Doe",
    enrollmentNo: "101004001",
    fatherName: "Robert Doe",
    motherName: "Jane Doe",
    dob: "2000-05-15",
    course: "B.Tech Computer Science",
    semester: "6th Semester",
    studentMobile: "+91 9876543210",
    studentEmail: ["john.doe@student.thapar.edu"],
    correspondenceAddress: "123 Main St, New Delhi, 110001, Delhi"
  },
  marks: [
    { examCode: "2324ODDSEM", subject: "Data Structures", event: "MST1", fullMarks: 30, obtainedMarks: 25, weightage: 15, effectiveMarks: 12.5, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Data Structures", event: "MST2", fullMarks: 30, obtainedMarks: 28, weightage: 15, effectiveMarks: 14, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Data Structures", event: "ESE", fullMarks: 70, obtainedMarks: 58, weightage: 70, effectiveMarks: 58, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Computer Networks", event: "MST1", fullMarks: 30, obtainedMarks: 22, weightage: 15, effectiveMarks: 11, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Computer Networks", event: "MST2", fullMarks: 30, obtainedMarks: 26, weightage: 15, effectiveMarks: 13, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Computer Networks", event: "ESE", fullMarks: 70, obtainedMarks: 55, weightage: 70, effectiveMarks: 55, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Database Systems", event: "MST1", fullMarks: 30, obtainedMarks: 27, weightage: 15, effectiveMarks: 13.5, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Database Systems", event: "MST2", fullMarks: 30, obtainedMarks: 29, weightage: 15, effectiveMarks: 14.5, status: "Pass" },
    { examCode: "2324ODDSEM", subject: "Database Systems", event: "ESE", fullMarks: 70, obtainedMarks: 62, weightage: 70, effectiveMarks: 62, status: "Pass" },
    { examCode: "2324EVENSEM", subject: "Software Engineering", event: "MST1", fullMarks: 30, obtainedMarks: 24, weightage: 15, effectiveMarks: 12, status: "Pass" },
    { examCode: "2324EVENSEM", subject: "Software Engineering", event: "ESE", fullMarks: 70, obtainedMarks: 60, weightage: 70, effectiveMarks: 60, status: "Pass" }
  ],
  subjectGrades: [
    { subject: "Data Structures", examCode: "2324ODDSEM", marksObtained: 84.5, maxMarks: 100, grade: "A" },
    { subject: "Computer Networks", examCode: "2324ODDSEM", marksObtained: 79, maxMarks: 100, grade: "A-" },
    { subject: "Database Systems", examCode: "2324ODDSEM", marksObtained: 90, maxMarks: 100, grade: "A+" },
    { subject: "Software Engineering", examCode: "2324EVENSEM", marksObtained: 72, maxMarks: 100, grade: "B+" }
  ],
  cgpaReports: [
    { examCode: "2122ODDSEM", courseCredit: 20, earnedCredit: 20, pointsSecured: 160, sgpa: 8.0, cgpa: 8.0 },
    { examCode: "2122EVENSEM", courseCredit: 22, earnedCredit: 22, pointsSecured: 176, sgpa: 8.0, cgpa: 8.0 },
    { examCode: "2223ODDSEM", courseCredit: 21, earnedCredit: 21, pointsSecured: 168, sgpa: 8.0, cgpa: 8.0 },
    { examCode: "2223EVENSEM", courseCredit: 20, earnedCredit: 20, pointsSecured: 170, sgpa: 8.5, cgpa: 8.13 },
    { examCode: "2324ODDSEM", courseCredit: 19, earnedCredit: 19, pointsSecured: 161.5, sgpa: 8.5, cgpa: 8.2 },
    { examCode: "2324EVENSEM", courseCredit: 18, earnedCredit: 18, pointsSecured: 144, sgpa: 8.0, cgpa: 8.17 }
  ]
};

const StatCard = ({ icon, title, value, subtitle, ...props }) => {
  return (
    <Card.Root borderLeft="4px" borderLeftColor="#640000" {...props}>
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

const InfoCard = ({ icon, title, value }) => {
  return (
    <Card.Root shadow="sm">
      <Card.Body>
        <Flex align="center" gap={3}>
          <Box p={2} bg="red.100" borderRadius="lg">
            <Icon as={icon} w={5} h={5} color="#640000" />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">{title}</Text>
            <Text fontWeight="medium" color="gray.900">{value}</Text>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

const Dashboard = () => {
const { data } = useDashboard();

  if (!data) return null;
  const {
    enrollmentNo,
    studentProfile,
    marks,
    subjectGrades,
    cgpaReports,
    timestamp,
  } = data;




  const renderMarks = () => (
    <Card.Root>
      <Card.Header>
        <Heading size="lg" color="gray.900">Detailed Marks</Heading>
      </Card.Header>
      <Card.Body>
        <Box overflowX="auto">
          <Table.Root variant="simple">
            <Table.Header bg="red.50">
              <Table.Row>
                <Table.ColumnHeader color="#640000">Subject</Table.ColumnHeader>
                <Table.ColumnHeader color="#640000">Exam Code</Table.ColumnHeader>
                <Table.ColumnHeader color="#640000">Event</Table.ColumnHeader>
                <Table.ColumnHeader color="#640000" isNumeric>Obtained</Table.ColumnHeader>
                <Table.ColumnHeader color="#640000" isNumeric>Full Marks</Table.ColumnHeader>
                <Table.ColumnHeader color="#640000" isNumeric>Effective</Table.ColumnHeader>
                <Table.ColumnHeader color="#640000">Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {marks.map((mark, index) => (
                <Table.Row key={index} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight="medium">{mark.subject}</Table.Cell>
                  <Table.Cell color="gray.500">{mark.examCode}</Table.Cell>
                  <Table.Cell color="gray.500">{mark.event}</Table.Cell>
                  <Table.Cell isNumeric fontWeight="medium">{mark.obtainedMarks}</Table.Cell>
                  <Table.Cell isNumeric color="gray.500">{mark.fullMarks}</Table.Cell>
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
      </Card.Body>
    </Card.Root>
  );


  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Topbar />

      {/* Main Content */}
                   {renderMarks()}

    </Box>
  );
};

export default Dashboard;