export class Mark {
  constructor(item) {
    this.examCode = item.examCode;
    this.subject = item.subject;
    this.event = item.event;
    this.fullMarks = item.fullMarks;
    this.obtainedMarks = item.obtainedMarks;
    this.weightage = item.weightage;
    this.effectiveMarks = item.effectiveMarks;
    this.status = item.status;
  }
}

export class SubjectGrade {
  constructor(data) {
    this.subject = data.subject;
    this.examCode = data.examCode;
    this.marksObtained = data.marksObtained;
    this.maxMarks = data.maxMarks;
    this.grade = data.grade;
  }
}

export class CGPAReport {
    constructor(data) {
        this.examCode = data.examCode;
        this.courseCredit = data.courseCredit;
        this.earnedCredit = data.earnedCredit;
        this.pointsSecured = data.pointsSecured;
        this.sgpa = data.sgpa;
        this.cgpa = data.cgpa;
    }
}