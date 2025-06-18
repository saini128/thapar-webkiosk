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

    if (!data) return null;
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

        // Sort by examCode in descending order
        const sorted = [...new Set(marks.map(m => m.examCode))].sort((a, b) => {
            // Sort by year part first, then EVEN > ODD
            const getSortKey = (code) => {
                const year = code.substring(0, 4);
                const semType = code.includes("EVEN") ? 2 : 1;
                return parseInt(year + semType); // 23242 > 23241
            };

            return getSortKey(b) - getSortKey(a);
        });

        return sorted[0];
    };

    // Calculate current semester from latest examCode
    const getCurrentSemester = () => {
        const latestExamCode = getLatestExamCode();
        if (latestExamCode === "N/A") return "N/A";

        const year = latestExamCode.substring(0, 4);
        const sem = latestExamCode.includes("ODD") ? "Odd" : "Even";

        return `${year} ${sem} Semester`;
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
        semester: report.examCode.substring(0, 4) + (report.examCode.includes('ODD') ? ' Odd' : ' Even'),
        cgpa: report.cgpa,
        sgpa: report.sgpa
    }));
    // Before your JSX
    const minCGPA = Math.min(...cgpaTrend.map(d => Math.min(d.cgpa, d.sgpa)));
    const lowerBound = Math.ceil(Math.max(0, minCGPA-1)) ; // Ensure it's not negative
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
                    <Card.Root w="full">
                        <Card.Header>
                            <Heading size="md" color="gray.900">Grade Distribution</Heading>
                        </Card.Header>
                        <Card.Body>
                            <Box h="250px" w="full">
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