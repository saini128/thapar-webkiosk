export class StudentProfile {
    constructor(data) {
        this.name = data.name;
        this.enrollmentNo = data.enrollmentNo;
        this.fatherName = data.fatherName;
        this.motherName = data.motherName;
        this.dob = data.dob;
        this.course = data.course;
        this.semester = data.semester;

        // Contact fields
        this.studentMobile = data.contact?.student?.mobile || null;
        this.studentTelephone = data.contact?.student?.telephone || null;
        this.studentEmail = Array.isArray(data.contact?.student?.email)
            ? data.contact.student.email
            : (data.contact?.student?.email ? [data.contact.student.email] : []);
        this.parentMobile = data.contact?.parent?.mobile || null;
        this.parentTelephone = data.contact?.parent?.telephone || null;
        this.parentEmail = data.contact?.parent?.email || null;

        // Address fields
        const corrAddr = data.address?.correspondence?.address;
        this.correspondenceAddress = corrAddr
            ? [
                    corrAddr.address,
                    corrAddr.district,
                    corrAddr.cityPin,
                    corrAddr.state
                ].filter(Boolean).join(', ')
            : null;

        const permAddr = data.address?.permanent?.address;
        this.permanentAddress = permAddr
            ? [
                    permAddr.address,
                    permAddr.district,
                    permAddr.cityPin,
                    permAddr.state
                ].filter(Boolean).join(', ')
            : null;
    }
}