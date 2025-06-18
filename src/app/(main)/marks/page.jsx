'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Flex,
    Grid,
    Heading,
    Spinner,
    Text,
    Card,
    Stat,
    Table,
    Badge,
    Icon,
    VStack,
    Button,
} from '@chakra-ui/react';

import {
    FiBook,
    FiTrendingUp,
    FiFilter,
    FiXCircle,
    FiPercent,
} from 'react-icons/fi';

import { useDashboard } from '@/context/dashboardContext';
import { Topbar } from '@/components/Topbar';
import { SEMORDER } from '@/lib/webkiosk/constants';
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
                    Loading your Subject Marks...
                </Heading>
                <Text color="gray.600" fontSize="md">
                    Your data is being loaded from Cache
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

    // Parse exam code to get year and type for sorting (keeping original function for display formatting)
    const parseExamCode = (examCode) => {
        // Handle AUX exams (AUXFEB24, AUXAUG24, AUXAUX25)
        if (examCode.startsWith('AUX')) {
            const year = parseInt(examCode.slice(-2)) + 2000; // Convert 24 to 2024
            const type = examCode.slice(3, -2); // FEB, AUG, or AUX
            return {
                year,
                type: 'AUX',
                subType: type,
                originalCode: examCode
            };
        }

        // Handle regular semester codes (2324ODDSEM, 2324EVESEM)
        if (examCode.includes('SEM')) {
            const year = parseInt(examCode.substring(0, 4));
            const academicYear = Math.floor(year / 100) * 100 + Math.floor((year % 100) / 10) * 10 + Math.floor((year % 10));
            const semType = examCode.includes('ODD') ? 'ODD' : 'EVE';
            return {
                year: academicYear,
                type: 'SEM',
                subType: semType,
                originalCode: examCode
            };
        }

        // Handle SUMMER exams (2324SUMMER)
        if (examCode.includes('SUMMER')) {
            const year = parseInt(examCode.substring(0, 4));
            const academicYear = Math.floor(year / 100) * 100 + Math.floor((year % 100) / 10) * 10 + Math.floor((year % 10));
            return {
                year: academicYear,
                type: 'SUMMER',
                subType: 'SUMMER',
                originalCode: examCode
            };
        }

        // Fallback for unknown format
        return {
            year: 0,
            type: 'UNKNOWN',
            subType: 'UNKNOWN',
            originalCode: examCode
        };
    };

    // Calculate available exam codes using SEMORDER for proper sorting
    const availableExamCodes = useMemo(() => {
        const examCodes = [...new Set(marks.map(mark => mark.examCode))];

        // Sort exam codes according to SEMORDER (latest first)
        return examCodes.sort((a, b) => {
            const indexA = SEMORDER.indexOf(a);
            const indexB = SEMORDER.indexOf(b);

            // If both codes are in SEMORDER, sort by their position (reverse order for latest first)
            if (indexA !== -1 && indexB !== -1) {
                return indexB - indexA;
            }

            // If only one is in SEMORDER, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // If neither is in SEMORDER, fall back to alphabetical sorting
            return a.localeCompare(b);
        });
    }, [marks]);

    // Only set default filters once when component first loads
    useEffect(() => {
        if (availableExamCodes.length > 0 && !isInitialized) {
            setSelectedExamCode(availableExamCodes[0]); // default to latest
            setIsInitialized(true);
        }
    }, [availableExamCodes, isInitialized]);

    if (!data) {
        return <LoadingSpinner />;
    }
    const {
        marks: allMarks,
    } = data;

    // Filter marks based on selected exam code and sort alphabetically by subject
    const filteredMarks = (selectedExamCode === 'all'
        ? allMarks
        : allMarks.filter(mark => mark.examCode === selectedExamCode))
        .sort((a, b) => a.subject.localeCompare(b.subject));

    // Convert exam codes to readable format
    const formatExamCode = (examCode) => {
        const parsed = parseExamCode(examCode);

        if (parsed.type === 'AUX') {
            const yearStr = parsed.year.toString().slice(-2);
            const typeMap = {
                'FEB': 'Feb Auxiliary',
                'AUG': 'Aug Auxiliary',
                'AUX': 'Aug Auxiliary'
            };
            return `${typeMap[parsed.subType] || parsed.subType} '${yearStr}`;
        }

        if (parsed.type === 'SEM') {
            const yearStr = parsed.year.toString();
            const startYear = yearStr.substring(0, 2);
            const endYear = yearStr.substring(2, 4);
            return `20${startYear}-20${endYear} ${parsed.subType === 'ODD' ? 'Odd' : 'Even'} Sem`;
        }

        if (parsed.type === 'SUMMER') {
            const yearStr = parsed.year.toString();
            const startYear = yearStr.substring(0, 2);
            const endYear = yearStr.substring(2, 4);
            return `20${startYear}-20${endYear} Summer`;
        }

        return examCode; // fallback
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

                {/* Subject-wise Total Marks Table */}
                <Card.Root w="full">
                    <Card.Header>
                        <Heading size="lg" color="gray.900">Subject-wise Total Marks</Heading>
                        <Text color="gray.600" mt={1}>
                            Cumulative marks for each subject across all exams (Passing marks: 35)
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        <Box overflowX="auto">
                            <Table.Root variant="simple">
                                <Table.Header bg="blue.50">
                                    <Table.Row>
                                        <Table.ColumnHeader color="#640000">Subject</Table.ColumnHeader>
                                        <Table.ColumnHeader color="#640000" isNumeric>Total Marks</Table.ColumnHeader>
                                        <Table.ColumnHeader color="#640000" isNumeric>Exams Count</Table.ColumnHeader>
                                        <Table.ColumnHeader color="#640000">Status</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {(() => {
                                        // Calculate subject-wise totals
                                        const subjectTotals = filteredMarks.reduce((acc, mark) => {
                                            if (!acc[mark.subject]) {
                                                acc[mark.subject] = {
                                                    totalEffectiveMarks: 0,
                                                    examCount: 0
                                                };
                                            }
                                            acc[mark.subject].totalEffectiveMarks += mark.effectiveMarks;
                                            acc[mark.subject].examCount += 1;
                                            return acc;
                                        }, {});

                                        // Sort subjects alphabetically
                                        const sortedSubjects = Object.keys(subjectTotals).sort();

                                        return sortedSubjects.map((subject) => {
                                            const data = subjectTotals[subject];
                                            const totalMarks = data.totalEffectiveMarks;
                                            const isPassed = totalMarks >= 35;
                                            const marksNeeded = isPassed ? 0 : Math.ceil(35 - totalMarks);

                                            return (
                                                <Table.Row key={subject} _hover={{ bg: "gray.50" }}>
                                                    <Table.Cell fontWeight="medium">{subject}</Table.Cell>
                                                    <Table.Cell isNumeric fontWeight="medium">{totalMarks.toFixed(2)}</Table.Cell>
                                                    <Table.Cell isNumeric>{data.examCount}</Table.Cell>
                                                    <Table.Cell>
                                                        {isPassed ? (
                                                            <Badge colorScheme="green" variant="subtle">
                                                                Passed
                                                            </Badge>
                                                        ) : (
                                                            <Badge colorScheme="red" variant="subtle">
                                                                Need {marksNeeded} more
                                                            </Badge>
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        });
                                    })()}
                                </Table.Body>
                            </Table.Root>
                        </Box>
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
                                                <Table.Cell isNumeric fontWeight="medium">{mark.obtainedMarks}/{mark.fullMarks}</Table.Cell>
                                                <Table.Cell isNumeric fontWeight="medium">{mark.effectiveMarks}/{mark.weightage}</Table.Cell>
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