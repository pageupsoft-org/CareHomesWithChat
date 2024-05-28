export class RecoveryStar {
  id: number;
  patientId: number;

  managingMentalHealthScorePatient: number;
  managingMentalHealthScoreStaff: number;
  reasonsForChoosingScore1Client: string;
  reasonsForChoosingScore1Staff: string;
  reasonsForDisagreement1: string;

  selfCareScorePatient: number;
  selfCareScoreStaff: number;
  reasonsForChoosingScore2Client: string;
  reasonsForChoosingScore2Staff: string;
  reasonsForDisagreement2: string;

  livingSkillsScorePatient: number;
  livingSkillsScoreStaff: number;
  reasonsForChoosingScore3Client: string;
  reasonsForChoosingScore3Staff: string;
  reasonsForDisagreement3: string;

  socialNetworksScorePatient: number;
  socialNetworksScoreStaff: number;
  reasonsForChoosingScore4Client: string;
  reasonsForChoosingScore4Staff: string;
  reasonsForDisagreement4: string;

  workScorePatient: number;
  workScoreStaff: number;
  reasonsForChoosingScore5Client: string;
  reasonsForChoosingScore5Staff: string;
  reasonsForDisagreement5: string;

  relationshipsScorePatient: number;
  relationshipsScoreStaff: number;
  reasonsForChoosingScore6Client: string;
  reasonsForChoosingScore6Staff: string;
  reasonsForDisagreement6: string;

  addictiveBehaviourScorePatient: number;
  addictiveBehaviourScoreStaff: number;
  reasonsForChoosingScore7Client: string;
  reasonsForChoosingScore7Staff: string;
  reasonsForDisagreement7: string;

  responsibilitiesScorePatient: number;
  responsibilitiesScoreStaff: number;
  reasonsForChoosingScore8Client: string;
  reasonsForChoosingScore8Staff: string;
  reasonsForDisagreement8: string;

  identityAndSelfEsteemScorePatient: number;
  identityAndSelfEsteemScoreStaff: number;
  reasonsForChoosingScore9Client: string;
  reasonsForChoosingScore9Staff: string;
  reasonsForDisagreement9: string;

  trustAndHopeScorePatient: number;
  trustAndHopeScoreStaff: number;
  reasonsForChoosingScore10Client: string;
  reasonsForChoosingScore10Staff: string;
  reasonsForDisagreement10: string;

  areasToWorkOn: string;
  nextReviewMeetingTodo: string;
  totalScrorePatient: number;
  totalScroreStaff: number;
  completedDate: Date;
  nextReviewDate: Date;
  completedBy: number;
  clientSignature: string;
  circulatedTo: string;
  signOffBy: number;
  isSignOff: boolean;

  locationId: number;
  careHomeId: number;
  userName: string;

  constructor() {
    this.isSignOff = false
    this.completedDate = new Date();
    this.nextReviewDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
    this.totalScrorePatient = 0;
    this.totalScroreStaff = 0;

    this.managingMentalHealthScorePatient = 1;
    this.managingMentalHealthScoreStaff = 1;
    this.selfCareScorePatient = 1;
    this.selfCareScoreStaff = 1;
    this.livingSkillsScorePatient = 1;
    this.livingSkillsScoreStaff = 1;
    this.socialNetworksScorePatient = 1;
    this.socialNetworksScoreStaff = 1;
    this.workScorePatient = 1;
    this.workScoreStaff = 1;
    this.relationshipsScorePatient = 1;
    this.relationshipsScoreStaff = 1;
    this.addictiveBehaviourScorePatient = 1;
    this.addictiveBehaviourScoreStaff = 1;
    this.responsibilitiesScorePatient = 1;
    this.responsibilitiesScoreStaff = 1;
    this.identityAndSelfEsteemScorePatient = 1;
    this.identityAndSelfEsteemScoreStaff = 1;
    this.trustAndHopeScorePatient = 1;
    this.trustAndHopeScoreStaff = 1;
  }
}