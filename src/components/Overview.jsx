 export const  renderOverview = () => (
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
          value={data.cgpaReports.length}
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
                <InfoCard icon={FiUser} title="Name" value={data.studentProfile.name} />
                <InfoCard icon={FiAward} title="Enrollment No." value={data.studentProfile.enrollmentNo} />
                <InfoCard icon={FiBook} title="Course" value={data.studentProfile.course} />
                <InfoCard icon={FiCalendar} title="Current Semester" value={getCurrentSemester()} />
                <InfoCard icon={FiMail} title="Email" value={data.studentProfile.studentEmail[0]} />
                <InfoCard icon={FiPhone} title="Mobile" value={data.studentProfile.studentMobile} />
              </Grid>
              <InfoCard 
                icon={FiMapPin} 
                title="Address" 
                value={data.studentProfile.correspondenceAddress} 
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