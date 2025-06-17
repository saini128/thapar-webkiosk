// models.js
export class UserDetails {
  constructor(data) {
    this.name = data.name;
    this.course = data.course;
    this.semester = data.semester;
    this.studentMobile = data.contact?.student?.mobile ?? null;
    this.studentEmail = data.contact?.student?.email ?? [];
    this.parentMobile = data.contact?.parent?.mobile ?? null;
    this.correspondenceAddress = data.address?.correspondence?.address ?? {};
    this.permanentAddress = data.address?.permanent?.address ?? {};
  }
}

