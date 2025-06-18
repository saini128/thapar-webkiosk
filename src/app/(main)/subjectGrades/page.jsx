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
  const [activeTab, setActiveTab] = useState('overview');
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
  console.log(data);
  // Calculate current semester from latest examCode
  const getCurrentSemester = () => {
    if (!cgpaReports.length) return "N/A";
    const latest = cgpaReports[cgpaReports.length - 1];
    const year = latest.examCode.substring(0, 4);
    const sem = latest.examCode.includes('ODD') ? 'Odd' : 'Even';
    return `${year} ${sem} Semester`;
  };

  // Get current semester marks for bar chart
  const getCurrentSemesterMarks = () => {
    const currentSemCode = cgpaReports.length > 0 ? 
      cgpaReports[cgpaReports.length - 1].examCode : "2324ODDSEM";
    
    const semesterMarks = marks.filter(mark => mark.examCode === currentSemCode);
    
    const subjectTotals = {};
    semesterMarks.forEach(mark => {
      if (!subjectTotals[mark.subject]) {
        subjectTotals[mark.subject] = { total: 0, maxTotal: 0 };
      }
      subjectTotals[mark.subject].total += mark.obtainedMarks;
      subjectTotals[mark.subject].maxTotal += mark.fullMarks;
    });

    return Object.entries(subjectTotals).map(([subject, marks]) => ({
      subject: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
      marks: marks.total,
      maxMarks: marks.maxTotal,
      percentage: Math.round((marks.total / marks.maxTotal) * 100)
    }));
  };

  // CGPA trend data
  const cgpaTrend = cgpaReports.map(report => ({
    semester: report.examCode.substring(0, 4) + (report.examCode.includes('ODD') ? ' Odd' : ' Even'),
    cgpa: report.cgpa,
    sgpa: report.sgpa
  }));

  // Grade distribution
  const gradeDistribution = subjectGrades.reduce((acc, grade) => {
    acc[grade.grade] = (acc[grade.grade] || 0) + 1;
    return acc;
  }, {});

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    color: {
      'A+': '#640000',
      'A': '#800000',
      'A-': '#A00000',
      'B+': '#C00000',
      'B': '#E00000',
      'B-': '#FF4444'
    }[grade] || '#888888'
  }));

  const currentSemesterMarks = getCurrentSemesterMarks();
  const currentCGPA = cgpaReports.length > 0 ? cgpaReports[cgpaReports.length - 1].cgpa : 0;
  const currentSGPA = cgpaReports.length > 0 ? cgpaReports[cgpaReports.length - 1].sgpa : 0;
  const totalSubjects = new Set(subjectGrades.map(grade => grade.subject)).size;

  const renderOverview = () => (
    
    <VStack spacing={6} align="stretch">
      {/* Stats Grid */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
        <StatCard
          icon={FiBook}
          title="Total Subjects"
          value={totalSubjects}
          subtitle="Subjects Completed"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Current CGPA"
          value={currentCGPA.toFixed(2)}
          subtitle="Overall Performance"
        />
        <StatCard
          icon={FiAward}
          title="Current SGPA"
          value={currentSGPA.toFixed(2)}
          subtitle="Semester Performance"
        />
        <StatCard
          icon={FiAward}
          title="Total Semesters"
          value={cgpaReports.length}
          subtitle="Completed"
        />
      </Grid>

      {/* Charts Row */}
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
        {/* Current Semester Marks */}
        <Card.Root>
          <Card.Header>
            <Heading size="md" color="gray.900">Current Semester Performance</Heading>
          </Card.Header>
          <Card.Body>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentSemesterMarks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'marks' ? `${value} marks` : `${value}%`,
                      name === 'marks' ? 'Obtained' : 'Percentage'
                    ]}
                  />
                  <Bar dataKey="marks" fill="#640000" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card.Body>
        </Card.Root>

        {/* CGPA Trend */}
        <Card.Root>
          <Card.Header>
            <Heading size="md" color="gray.900">CGPA Trend</Heading>
          </Card.Header>
          <Card.Body>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cgpaTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="semester" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cgpa" stroke="#640000" strokeWidth={3} name="CGPA" />
                  <Line type="monotone" dataKey="sgpa" stroke="#A00000" strokeWidth={2} name="SGPA" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Personal Info & Grade Distribution */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Personal Information */}
        <Card.Root>
          <Card.Header>
            <Heading size="md" color="gray.900">Personal Information</Heading>
          </Card.Header>
          <Card.Body>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                <InfoCard icon={FiUser} title="Name" value={studentProfile.name} />
                <InfoCard icon={FiAward} title="Enrollment No." value={studentProfile.enrollmentNo} />
                <InfoCard icon={FiBook} title="Course" value={studentProfile.course} />
                <InfoCard icon={FiCalendar} title="Current Semester" value={getCurrentSemester()} />
                <InfoCard icon={FiMail} title="Email" value={studentProfile.studentEmail[0]} />
                <InfoCard icon={FiPhone} title="Mobile" value={studentProfile.studentMobile} />
              </Grid>
              <InfoCard 
                icon={FiMapPin} 
                title="Address" 
                value={studentProfile.correspondenceAddress} 
              />
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Grade Distribution */}
        <Card.Root>
          <Card.Header>
            <Heading size="md" color="gray.900">Grade Distribution</Heading>
          </Card.Header>
          <Card.Body>
            <Box h="250px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="grade"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card.Body>
        </Card.Root>
      </Grid>
    </VStack>
  );

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

  const renderGrades = () => (
    <Card.Root>
      <Card.Header>
        <Heading size="lg" color="gray.900">Subject Grades</Heading>
      </Card.Header>
      <Card.Body>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {subjectGrades.map((grade, index) => (
            <Card.Root key={index} variant="outline" _hover={{ shadow: "md" }}>
              <Card.Body>
                <VStack align="stretch" spacing={3}>
                  <Heading size="sm" color="gray.900">{grade.subject}</Heading>
                  <VStack align="stretch" spacing={2} fontSize="sm" color="gray.600">
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Exam Code:</Text>
                      <Text>{grade.examCode}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Marks:</Text>
                      <Text>{grade.marksObtained}/{grade.maxMarks}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">Percentage:</Text>
                      <Text>{Math.round((grade.marksObtained/grade.maxMarks)*100)}%</Text>
                    </HStack>
                  </VStack>
                  <Box>
                    <Badge 
                      size="lg" 
                      fontWeight="bold"
                      colorScheme={
                        grade.grade.startsWith('A') ? 'green' :
                        grade.grade.startsWith('B') ? 'blue' : 'yellow'
                      }
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {grade.grade}
                    </Badge>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      </Card.Body>
    </Card.Root>
  );

  const renderCGPAReports = () => (
    <VStack spacing={6} align="stretch">
      <Card.Root>
        <Card.Header>
          <Heading size="lg" color="gray.900">CGPA Reports</Heading>
        </Card.Header>
        <Card.Body>
          <Box overflowX="auto">
            <Table.Root variant="simple">
              <Table.Header bg="red.50">
                <Table.Row>
                  <Table.ColumnHeader color="#640000">Semester</Table.ColumnHeader>
                  <Table.ColumnHeader color="#640000" isNumeric>Course Credit</Table.ColumnHeader>
                  <Table.ColumnHeader color="#640000" isNumeric>Earned Credit</Table.ColumnHeader>
                  <Table.ColumnHeader color="#640000" isNumeric>Points Secured</Table.ColumnHeader>
                  <Table.ColumnHeader color="#640000" isNumeric>SGPA</Table.ColumnHeader>
                  <Table.ColumnHeader color="#640000" isNumeric>CGPA</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cgpaReports.map((report, index) => (
                  <Table.Row key={index} _hover={{ bg: "gray.50" }}>
                    <Table.Cell fontWeight="medium">
                      {report.examCode.substring(0, 4)} {report.examCode.includes('ODD') ? 'Odd' : 'Even'}
                    </Table.Cell>
                    <Table.Cell isNumeric color="gray.500">{report.courseCredit}</Table.Cell>
                    <Table.Cell isNumeric color="gray.500">{report.earnedCredit}</Table.Cell>
                    <Table.Cell isNumeric color="gray.500">{report.pointsSecured}</Table.Cell>
                    <Table.Cell isNumeric fontWeight="medium">{report.sgpa.toFixed(2)}</Table.Cell>
                    <Table.Cell isNumeric fontWeight="bold" color="#640000">{report.cgpa.toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Card.Body>
      </Card.Root>

      {/* CGPA Detailed Trend */}
      <Card.Root>
        <Card.Header>
          <Heading size="md" color="gray.900">CGPA & SGPA Trend Analysis</Heading>
        </Card.Header>
        <Card.Body>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cgpaTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="semester" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cgpa" stroke="#640000" strokeWidth={3} name="CGPA" dot={{ r: 6 }} />
                <Line type="monotone" dataKey="sgpa" stroke="#A00000" strokeWidth={2} name="SGPA" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card.Body>
      </Card.Root>
    </VStack>
  );

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Topbar />

      {/* Main Content */}
      {renderGrades()}
    </Box>
  );
};

export default Dashboard;