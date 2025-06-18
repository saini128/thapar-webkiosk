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
import { SEMORDER} from '@/lib/webkiosk/constants';

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
        studentProfile,
        marks,
        subjectGrades,
        cgpaReports,
        timestamp,
    } = data;
    // Calculate current semester from latest examCode

    // CGPA trend data
    const cgpaTrend = cgpaReports.map(report => ({
        semester: report.examCode,
        cgpa: report.cgpa,
        sgpa: report.sgpa
    }));
    const minCGPA = Math.min(...cgpaTrend.map(d => Math.min(d.cgpa, d.sgpa)));
    const lowerBound = Math.ceil(Math.max(0, minCGPA - 1)); // Ensure it's not negative

    // Grade distribution
    let gradeDistribution = subjectGrades.reduce((acc, grade) => {
        acc[grade.grade] = (acc[grade.grade] || 0) + 1;
        return acc;
    }, {});

    // Calculate additional stats
    const totalCredits = cgpaReports.reduce((sum, report) => sum + report.earnedCredit, 0);
    const totalPoints = cgpaReports.reduce((sum, report) => sum + report.pointsSecured, 0);
    const currentCGPA = cgpaReports.length > 0 ? cgpaReports[cgpaReports.length - 1].cgpa : 0;
    const currentSGPA = cgpaReports.length > 0 ? cgpaReports[cgpaReports.length - 1].sgpa : 0;
    const averageSGPA = cgpaReports.length > 0 ? cgpaReports.reduce((sum, report) => sum + report.sgpa, 0) / cgpaReports.length : 0;
    
    // SGPA comparison data
    const sgpaComparison = cgpaReports.map(report => ({
        semester: report.examCode.substring(0, 4) + (report.examCode.includes('ODD') ? ' Odd' : ' Even'),
        sgpa: report.sgpa,
        credits: report.earnedCredit
    }));

    // Grade distribution data
    gradeDistribution = subjectGrades.reduce((acc, grade) => {
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

    const renderCGPAReports = () => (
        <Box w="full" px={{ base: 4, md: 6, lg: 8 }} py={6}>
            <VStack spacing={6} align="stretch" w="full">
                {/* Stats Grid */}
                <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }} 
                    gap={6} 
                    w="full"
                >
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
                        subtitle="Latest Semester"
                    />
                    <StatCard
                        icon={FiBook}
                        title="Average SGPA"
                        value={averageSGPA.toFixed(2)}
                        subtitle="All Semesters"
                    />
                    <StatCard
                        icon={FiAward}
                        title="Total Credits"
                        value={totalCredits}
                        subtitle="Credits Earned"
                    />
                    <StatCard
                        icon={FiTrendingUp}
                        title="Total Points"
                        value={totalPoints}
                        subtitle="Points Secured"
                    />
                </Grid>

                <Card.Root w="full">
                    <Card.Header>
                        <Heading size="lg" color="gray.900">CGPA Reports</Heading>
                    </Card.Header>
                    <Card.Body>
                        <Box overflowX="auto" w="full">
                            <Table.Root variant="simple" w="full">
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
                                                {report.examCode}
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

                {/* Charts Row */}
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} w="full">
                    {/* CGPA & SGPA Trend */}
                    <Card.Root w="full">
                        <Card.Header>
                            <Heading size="md" color="gray.900">CGPA & SGPA Trend Analysis</Heading>
                        </Card.Header>
                        <Card.Body>
                            <Box h="400px" w="full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={cgpaTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="semester"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis domain={[lowerBound, 10]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="cgpa" stroke="#640000" strokeWidth={3} name="CGPA" dot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="sgpa" stroke="#A00000" strokeWidth={2} name="SGPA" dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Card.Body>
                    </Card.Root>

                    {/* Grade Distribution */}
                    <Card.Root w="full">
                        <Card.Header>
                            <Heading size="md" color="gray.900">Grade Distribution</Heading>
                        </Card.Header>
                        <Card.Body>
                            <Box h="400px" w="full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={gradeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={120}
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

            {/* Main Content */}
            {renderCGPAReports()}

        </Box>
    );
};

export default Dashboard;