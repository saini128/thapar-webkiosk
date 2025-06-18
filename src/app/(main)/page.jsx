'use client';
import React from 'react';
import {
    Box,
    Flex,
    Grid,
    Heading,
    Text,
    Card,
    Stat,
    Badge,
    Icon,
    VStack,
    Spinner,
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
import { SEMORDER }  from '@/lib/webkiosk/constants';

// Loading Component
const LoadingSpinner = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    minH="100vh"
    w="100vw"
    maxW="100%"
    bg="gray.50"
    gap={6}
    overflowX="hidden"
  >
    <Box textAlign="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#640000"
        size="xl"
        mb={4}
      />
      <VStack spacing={2}>
        <Heading size="lg" color="gray.700" fontWeight="medium">
          Loading your dashboard...
        </Heading>
        <Text color="gray.600" fontSize="md">
          Your data is being loaded from OG Webkiosk
        </Text>
        <Text color="gray.500" fontSize="sm">
          Please wait a moment
        </Text>
      </VStack>
    </Box>

    {/* Aligned bubble animation */}
    <Box position="relative" w="60px" h="60px">
      <Box
        w="60px"
        h="60px"
        border="3px solid"
        borderColor="gray.200"
        borderRadius="full"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        m="auto"
        animation="ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
        opacity="0.75"
      />
      <Box
        w="40px"
        h="40px"
        bg="#640000"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Icon as={FiBook} color="white" w={5} h={5} />
      </Box>
    </Box>
  </Flex>
);

// Enhanced Grade Distribution Card Component
const EnhancedGradeDistribution = ({ subjectGrades }) => {
    // Calculate grade distribution with more details
    const gradeDistribution = subjectGrades.reduce((acc, grade) => {
        acc[grade.grade] = (acc[grade.grade] || 0) + 1;
        return acc;
    }, {});

    // Grade point mapping
    const gradePoints = {
        'A': 10,
        'A-': 9,
        'B': 8,
        'B-': 7,
        'C': 6,
        'C-': 5,
        'E': 0,
        'I': 0
    };

    // Enhanced grade data with additional information
    const gradeData = Object.entries(gradeDistribution)
        .map(([grade, count]) => ({
            grade,
            count,
            percentage: ((count / subjectGrades.length) * 100).toFixed(1),
            points: gradePoints[grade] || 0,
            color: {
                'A+': '#640000',
                'A': '#800000',
                'A-': '#A00000',
                'B+': '#C00000',
                'B': '#E00000',
                'B-': '#FF4444',
                'C+': '#FF6666',
                'C': '#FF8888',
                'C-': '#FFAAAA',
                'D': '#FFCCCC',
                'F': '#888888'
            }[grade] || '#888888'
        }))
        .sort((a, b) => b.points - a.points); // Sort by grade points descending

    // Calculate statistics
    const totalSubjects = subjectGrades.length;
    const averageGradePoint = subjectGrades.reduce((sum, grade) =>
        sum + (gradePoints[grade.grade] || 0), 0) / totalSubjects;
    const highestGrade = gradeData[0]?.grade || 'N/A';
    const mostFrequentGrade = gradeData.reduce((prev, current) =>
        prev.count > current.count ? prev : current, gradeData[0])?.grade || 'N/A';

    return (
        <Card.Root w="full">
            <Card.Header>
                <Flex justify="space-between" align="center" mb={2}>
                    <Heading size="md" color="gray.900">Grade Distribution</Heading>
                    <Badge colorScheme="red" variant="subtle">
                        {totalSubjects} Subjects
                    </Badge>
                </Flex>
            </Card.Header>
            <Card.Body>
                <VStack spacing={6} w="full">
                    {/* Key Statistics */}
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                        {/* <Box textAlign="center" p={3} bg="gray.50" borderRadius="md">
                            <Text fontSize="lg" fontWeight="bold" color="#640000">
                                {averageGradePoint.toFixed(2)}
                            </Text>
                            <Text fontSize="xs" color="gray.600">Avg Grade Point</Text>
                        </Box> */}
                        <Box textAlign="center" p={3} bg="gray.50" borderRadius="md">
                            <Text fontSize="lg" fontWeight="bold" color="#640000">
                                {highestGrade}
                            </Text>
                            <Text fontSize="xs" color="gray.600">Highest Grade</Text>
                        </Box>
                        <Box textAlign="center" p={3} bg="gray.50" borderRadius="md">
                            <Text fontSize="lg" fontWeight="bold" color="#640000">
                                {mostFrequentGrade}
                            </Text>
                            <Text fontSize="xs" color="gray.600">Most Frequent</Text>
                        </Box>
                    </Grid>

                    {/* Pie Chart */}
                    <Box h="200px" w="full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gradeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={75}
                                    dataKey="count"
                                    nameKey="grade"
                                >
                                    {gradeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} subjects (${gradeData.find(g => g.grade === name)?.percentage}%)`,
                                        'Count'
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>

                    {/* Detailed Grade Breakdown */}
                    <VStack spacing={2} w="full">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" alignSelf="start">
                            Grade Breakdown
                        </Text>
                        {gradeData.map((grade, index) => (
                            <Flex key={index} w="full" justify="space-between" align="center"
                                p={2} bg="gray.50" borderRadius="md">
                                <Flex align="center" gap={3}>
                                    <Box w={3} h={3} bg={grade.color} borderRadius="full" />
                                    <Text fontWeight="medium" fontSize="sm">
                                        Grade {grade.grade}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                        ({grade.points} pts)
                                    </Text>
                                </Flex>
                                <Flex align="center" gap={2}>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {grade.count}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                        ({grade.percentage}%)
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </VStack>

                    {/* Performance Indicator */}
                    <Box w="full" p={3} bg={averageGradePoint >= 8 ? "green.50" : averageGradePoint >= 6 ? "yellow.50" : "red.50"}
                        borderRadius="md" border="1px solid"
                        borderColor={averageGradePoint >= 8 ? "green.200" : averageGradePoint >= 6 ? "yellow.200" : "red.200"}>
                        <Flex align="center" justify="center" gap={2}>
                            <Icon as={FiTrendingUp}
                                color={averageGradePoint >= 8 ? "green.600" : averageGradePoint >= 6 ? "yellow.600" : "red.600"} />
                            <Text fontSize="sm" fontWeight="medium"
                                color={averageGradePoint >= 8 ? "green.700" : averageGradePoint >= 6 ? "yellow.700" : "red.700"}>
                                {averageGradePoint >= 8 ? "Excellent Performance" :
                                    averageGradePoint >= 6 ? "Good Performance" : "Needs Improvement"}
                            </Text>
                        </Flex>
                    </Box>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

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

const InfoCard = ({ icon, title, value }) => {
    return (
        <Card.Root shadow="sm" w="full">
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

    // Show loading spinner while data is being fetched
    if (!data) {
        return <LoadingSpinner />;
    }

    const {
        enrollmentNo,
        studentProfile,
        marks,
        subjectGrades,
        cgpaReports,
        timestamp,
    } = data;

    const getLatestExamCode = () => {
        if (!marks.length) return "N/A";
        console.log("Marks data:", marks[marks.length - 1].examCode); // Debugging line to check marks structure

        // Get unique exam codes from marks data
        const uniqueExamCodes = [...new Set(marks.map(m => m.examCode))];

        // Find the latest exam code based on SEMORDER
        let latestExamCode = "N/A";
        let latestIndex = -1;

        uniqueExamCodes.forEach(examCode => {
            const index = SEMORDER.indexOf(examCode);
            if (index > latestIndex) {
                latestIndex = index;
                latestExamCode = examCode;
            }
        });

        return latestExamCode;
    };

    // Get current semester marks for bar chart
    const getCurrentSemesterMarks = () => {
        const currentSemCode = getLatestExamCode();
        if (currentSemCode === "N/A") return [];

        const semesterMarks = marks.filter(mark => mark.examCode === currentSemCode);
        const subjectTotals = {};
        semesterMarks.forEach(mark => {
            if (!subjectTotals[mark.subject]) {
                subjectTotals[mark.subject] = { total: 0, maxTotal: 0 };
            }
            subjectTotals[mark.subject].total += mark.effectiveMarks;
            subjectTotals[mark.subject].maxTotal += mark.weightage;
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
        semester: report.examCode,
        cgpa: report.cgpa,
        sgpa: report.sgpa
    }));

    // Before your JSX
    const minCGPA = Math.min(...cgpaTrend.map(d => Math.min(d.cgpa, d.sgpa)));
    const lowerBound = Math.ceil(Math.max(0, minCGPA - 1)); // Ensure it's not negative

    const currentSemesterMarks = getCurrentSemesterMarks();
    const currentCGPA = cgpaReports.length > 0 ? cgpaReports[cgpaReports.length - 1].cgpa : 0;
    const currentSGPA = cgpaReports.length > 0 ? cgpaReports[cgpaReports.length - 1].sgpa : 0;
    const totalSubjects = new Set(subjectGrades.map(grade => grade.subject)).size;

    const renderOverview = () => (
        <Box w="full" px={{ base: 4, md: 6, lg: 8 }} py={6}>
            <VStack spacing={6} align="stretch" w="full">
                {/* Stats Grid */}
                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                    gap={6}
                    w="full"
                >
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
                        title="Last Available Marks"
                        value={getLatestExamCode()}
                        subtitle="Semester Wise"
                    />
                </Grid>

                {/* Charts Row */}
                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6} w="full">
                    {/* Current Semester Marks */}
                    <Card.Root w="full">
                        <Card.Header>
                            <Heading size="md" color="gray.900">Current Semester Performance</Heading>
                        </Card.Header>
                        <Card.Body>
                            <Box h="300px" w="full">
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
                    <Card.Root w="full">
                        <Card.Header>
                            <Heading size="md" color="gray.900">CGPA Trend</Heading>
                        </Card.Header>
                        <Card.Body>
                            <Box h="300px" w="full">
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
                                        <YAxis domain={[lowerBound, 10]} />
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
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} w="full">
                    {/* Personal Information */}
                    <Card.Root w="full">
                        <Card.Header>
                            <Heading size="md" color="gray.900">Personal Information</Heading>
                        </Card.Header>
                        <Card.Body>
                            <VStack spacing={4} align="stretch" w="full">
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} w="full">
                                    <InfoCard icon={FiUser} title="Name" value={studentProfile.name} />
                                    <InfoCard icon={FiAward} title="Enrollment No." value={enrollmentNo} />
                                    <InfoCard icon={FiBook} title="Course" value={studentProfile.course} />
                                    <InfoCard icon={FiCalendar} title="Current Semester" value={getLatestExamCode()} />
                                    <InfoCard icon={FiCalendar} title="DOB" value={studentProfile.dob} />
                                    <InfoCard icon={FiCalendar} title="Father's Name" value={studentProfile.fatherName} />
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

                    {/* Enhanced Grade Distribution */}
                    <EnhancedGradeDistribution subjectGrades={subjectGrades} />
                </Grid>
            </VStack>
        </Box>
    );

    return (
        <Box minH="100vh" bg="gray.50" w="100vw" maxW="100%" overflowX="hidden">
            {/* Header */}
            <Topbar />
            {renderOverview()}
        </Box>
    );
};

export default Dashboard;