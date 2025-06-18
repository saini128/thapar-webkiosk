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
    Tabs,
    Icon,
    Container,
    VStack,
    HStack,
    Button,
    ButtonGroup,
} from '@chakra-ui/react';

import {
    FiBook, FiAward, FiTrendingUp,
    FiFilter
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
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [isInitialized, setIsInitialized] = useState(false);

    // Safe fallback if data is null
    const subjectGrades = data?.subjectGrades || [];

    // Calculate available semesters using useMemo to prevent unnecessary recalculations
    const availableSemesters = useMemo(() => {
        const semesters = [...new Set(subjectGrades.map(grade => grade.examCode))];
        return semesters.sort((a, b) => {
            const getYear = (code) => parseInt(code.substring(0, 4));
            const getSemType = (code) => code.includes('ODD') ? 0 : 1;

            const yearA = getYear(a);
            const yearB = getYear(b);

            if (yearA !== yearB) return yearB - yearA;
            return getSemType(b) - getSemType(a);
        });
    }, [subjectGrades]);

    // Only set default semester once when component first loads
    useEffect(() => {
        if (availableSemesters.length > 0 && !isInitialized) {
            setSelectedSemester(availableSemesters[0]); // default to latest
            setIsInitialized(true);
        }
    }, [availableSemesters, isInitialized]);

    // Optional render null if no usable data yet
    if (!data) return null;

    // Convert exam codes to readable format
    const formatSemester = (examCode) => {
        const year = examCode.substring(0, 4);
        const semType = examCode.includes('ODD') ? 'Odd' : 'Even';
        return `${year} ${semType}`;
    };

    // Filter grades based on selected semester
    const filteredGrades = selectedSemester === 'all'
        ? subjectGrades
        : subjectGrades.filter(grade => grade.examCode === selectedSemester);

    const grades = filteredGrades;
    const totalSubjects = grades.length;
    const averageMarks = grades.length > 0
        ? Math.round(grades.reduce((sum, grade) => sum + grade.marksObtained, 0) / grades.length)
        : 0;

    const gradeDistribution = grades.reduce((acc, grade) => {
        acc[grade.grade] = (acc[grade.grade] || 0) + 1;
        return acc;
    }, {});

    const highestGrade = Object.keys(gradeDistribution).sort((a, b) => {
        const gradeOrder = { 'A+': 10, 'A': 9, 'A-': 8, 'B+': 7, 'B': 6, 'B-': 5, 'C+': 4, 'C': 3, 'C-': 2, 'D': 1, 'F': 0 };
        return (gradeOrder[b] || 0) - (gradeOrder[a] || 0);
    })[0] || 'N/A';

    const statistics = { totalSubjects, averageMarks, highestGrade };

    const renderGrades = () => (
        <Box w="full" px={{ base: 4, md: 6, lg: 8 }} py={6}>
            <VStack spacing={6} align="stretch" w="full">
                {/* Page Header */}
                <Box>
                    <Heading size="2xl" color="gray.900" mb={2}>Subject Grades</Heading>
                    <Text color="gray.600" fontSize="lg">
                        View and filter your academic performance by semester
                    </Text>
                </Box>

                {/* Statistics Cards */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} w="full">
                    <StatCard
                        icon={FiBook}
                        title="Total Subjects"
                        value={statistics.totalSubjects}
                        subtitle={selectedSemester === 'all' ? 'All Semesters' : formatSemester(selectedSemester)}
                    />
                    <StatCard
                        icon={FiTrendingUp}
                        title="Average Marks"
                        value={`${statistics.averageMarks}%`}
                        subtitle="Overall Performance"
                    />
                    <StatCard
                        icon={FiAward}
                        title="Highest Grade"
                        value={statistics.highestGrade}
                        subtitle="Best Achievement"
                    />
                </Grid>

                {/* Filter Section */}
                <Card.Root w="full">
                    <Card.Header>
                        <Flex align="center" gap={3} wrap="wrap">
                            <Icon as={FiFilter} color="#640000" />
                            <Heading size="md" color="gray.900">Filter by Semester</Heading>
                        </Flex>
                    </Card.Header>
                    <Card.Body>
                        <Flex wrap="wrap" gap={3}>
                            <Button
                                size="sm"
                                variant={selectedSemester === 'all' ? 'solid' : 'outline'}
                                bg={selectedSemester === 'all' ? '#640000' : 'transparent'}
                                color={selectedSemester === 'all' ? 'white' : '#640000'}
                                borderColor="#640000"
                                _hover={{
                                    bg: selectedSemester === 'all' ? '#500000' : '#640000',
                                    color: 'white'
                                }}
                                onClick={() => setSelectedSemester('all')}
                            >
                                All Semesters ({subjectGrades.length})
                            </Button>
                            {availableSemesters.map((semester) => (
                                <Button
                                    key={semester}
                                    size="sm"
                                    variant={selectedSemester === semester ? 'solid' : 'outline'}
                                    bg={selectedSemester === semester ? '#640000' : 'transparent'}
                                    color={selectedSemester === semester ? 'white' : '#640000'}
                                    borderColor="#640000"
                                    _hover={{
                                        bg: selectedSemester === semester ? '#500000' : '#640000',
                                        color: 'white'
                                    }}
                                    onClick={() => setSelectedSemester(semester)}
                                >
                                    {formatSemester(semester)} ({subjectGrades.filter(g => g.examCode === semester).length})
                                </Button>
                            ))}
                        </Flex>
                    </Card.Body>
                </Card.Root>

                {/* Grades Grid */}
                <Card.Root w="full">
                    <Card.Header>
                        <Heading size="lg" color="gray.900">
                            {selectedSemester === 'all'
                                ? 'All Subject Grades'
                                : `${formatSemester(selectedSemester)} Grades`}
                        </Heading>
                        <Text color="gray.600" mt={1}>
                            Showing {filteredGrades.length} subject{filteredGrades.length !== 1 ? 's' : ''}
                        </Text>
                    </Card.Header>
                    <Card.Body>
                        {filteredGrades.length > 0 ? (
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                                gap={6}
                                w="full"
                            >
                                {filteredGrades.map((grade, index) => (
                                    <Card.Root
                                        key={index}
                                        variant="outline"
                                        _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                                        transition="all 0.2s"
                                        w="full"
                                    >
                                        <Card.Body>
                                            <VStack align="stretch" spacing={3}>
                                                <Heading size="sm" color="gray.900" noOfLines={2}>
                                                    {grade.subject}
                                                </Heading>
                                                <VStack align="stretch" spacing={2} fontSize="sm" color="gray.600">
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="medium">Semester:</Text>
                                                        <Text>{formatSemester(grade.examCode)}</Text>
                                                    </HStack>
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="medium">Marks:</Text>
                                                        <Text fontWeight="semibold">{grade.marksObtained}/{grade.maxMarks}</Text>
                                                    </HStack>
                                                    <HStack justify="space-between">
                                                        <Text fontWeight="medium">Percentage:</Text>
                                                        <Text fontWeight="semibold" color="gray.900">
                                                            {Math.round((grade.marksObtained / grade.maxMarks) * 100)}%
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                                <Flex justify="center">
                                                    <Badge
                                                        size="lg"
                                                        fontWeight="bold"
                                                        colorScheme={
                                                            grade.grade.startsWith('A') ? 'green' :
                                                                grade.grade.startsWith('B') ? 'blue' :
                                                                    grade.grade.startsWith('C') ? 'yellow' : 'red'
                                                        }
                                                        variant="subtle"
                                                        px={4}
                                                        py={2}
                                                        borderRadius="full"
                                                        fontSize="md"
                                                    >
                                                        {grade.grade}
                                                    </Badge>
                                                </Flex>
                                            </VStack>
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                            </Grid>
                        ) : (
                            <Box textAlign="center" py={12}>
                                <Icon as={FiBook} w={12} h={12} color="gray.400" mb={4} />
                                <Heading size="md" color="gray.500" mb={2}>No grades found</Heading>
                                <Text color="gray.400">
                                    No subject grades available for the selected semester.
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
            {renderGrades()}
        </Box>
    );
};

export default Dashboard;