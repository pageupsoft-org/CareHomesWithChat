export class FormThree {
    id: number;
    auditedBy: number;
    locationId: number;
    patientId: number;

    dateOfAdmission: Boolean;
    reasonForAdmission: Boolean;
    sourceOfReferral: Boolean;
    serviceUserNo: Boolean;
    serviceUserAddress: Boolean;
    dateOfBirth: Boolean;
    telephoneNumber: Boolean;
    gender: Boolean;
    ethnicOrigin: Boolean;
    nearestRelative: Boolean;
    emergencyContactNearestRelative: Boolean;
    nextOfKinDetails: Boolean;
    gpSurgeryName: Boolean;
    gpAddress: Boolean;
    gpContactNo: Boolean;
    mhaStatus: Boolean;
    weightAndHeight: Boolean;
    allergies: Boolean;
    cpaStatus: Boolean;
    observationLevel: Boolean;
    responsibleClinician: Boolean;
    authority: Boolean;
    admissionAgreementSigned: Boolean;
    consentForAuditOfNotesPresentAndSigned: Boolean;
    copiesOfMHADocumentInNotes: Boolean;
    consentToTreatmentCompletedAndPresent: Boolean;
    nextReviewDate: Date;
    checkedBy: number;
    isCompleted: Boolean;
    constructor() {

    }
}