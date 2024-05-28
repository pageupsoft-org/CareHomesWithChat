export const RouteDefinitions = {
    loginPath: "login",
    login() {
        return this.loginPath;
    },

    dashboardPath: "dashboard",
    dashboard() {
        return this.dashboardPath;
    },

    // careHomeManagementPath: "care-home",
    // careHomeManagement() {
    //     return this.careHomeManagementPath;
    // },

    userMasterPath: "userMaster",
    userMaster() {
        return this.userMasterPath;
    },

    locationEditPath: "location/edit/:id",
    locationEdit() {
        return this.locationEditPath;
    },
    locationCreatePath: "location/create",
    locationCreate() {
        return this.locationCreatePath;
    },

    courseEditPath: "course/edit/:id",
    courseEdit() {
        return this.courseEditPath;
    },
    courseCreatePath: "course/create",
    courseCreate() {
        return this.courseCreatePath;
    },

    changePasswordPath: "change-password",
    changePassword() {
        return this.changePasswordPath;
    },

    userProfilePath: "edi-profile",
    userProfile() {
        return this.userProfilePath;
    },

    serviceUserPath: "service-user",
    serviceUser() {
        return this.serviceUserPath;
    },

    patientRegistrationEditPath: "patient-registration-edit/",
    patientRegistrationEdit(id: number) {
        return this.patientRegistrationEditPath + id;
    },

    patientRegistrationShowPath: "patient-registration-show/",
    patientRegistrationShow(id: number) {
        return this.patientRegistrationShowPath + id;
    },

    serviceUserOverviewPath: "service-overview",
    serviceUserOverview() {
        return this.serviceUserOverviewPath;
    },

    riskAssessmentPath: "risk-assessment/",
    riskAssessment(id) {
        return this.riskAssessmentPath + id;
    },

    showRiskAssessmentPath: "risk-assessment/",
    showRiskAssessment(id) {
        return this.riskAssessmentPath + id;
    },

    signOffListPath: "sign-Off-list/",
    signOffList(id) {
        return this.signOffListPath + id;
    },

    auditFormsListPath: "forms-to-audit/",
    auditFormsList(id) {
        return this.auditFormsListPath + id;
    },

    // Zone
    zoneMasterPath: "zone-master",
    zoneMaster() {
        return this.zoneMasterPath;
    },

    // location Audits
    locationAudits: {

        auditMasterPath: "location-audit",
        auditMaster() {
            return this.auditMasterPath;
        },

        /// form two routes
        formTwoOverviewPath: "form-two-overview",
        formTwoOverview() {
            return "location-audit/" + this.formTwoOverviewPath;
        },

        formTwoPath: "form-two",
        formTwo() {
            return "location-audit/" + this.formTwoPath;
        },

        formTwoEditPath: "form-two/",
        formTwoEdit(id) {
            return "location-audit/" + this.formTwoEditPath + id;
        },

        formTwoShowPath: "form-two-show/",
        formTwoShow(id: number) {
            return "location-audit/" + this.formTwoShowPath + id;
        },

        /// form seven routes
        formSevenOverviewPath: "form-seven-overview",
        formSevenOverview() {
            return "location-audit/" + this.formSevenOverviewPath;
        },

        formSevenPath: "form-seven",
        formSeven() {
            return "location-audit/" + this.formSevenPath;
        },

        formSevenEditPath: "form-seven/",
        formSevenEdit(id) {
            return "location-audit/" + this.formSevenEditPath + id;
        },

        formSevenShowPath: "form-seven-show/",
        formSevenShow(id) {
            return "location-audit/" + this.formSevenShowPath + id;
        },

        /// form eight routes

        formEightOverviewPath: "form-eight-overview",
        formEightOverview() {
            return "location-audit/" + this.formEightOverviewPath;
        },

        formEightPath: "form-eight",
        formEight() {
            return "location-audit/" + this.formEightPath;
        },

        formEightEditPath: "form-eight/",
        formEightEdit(id) {
            return "location-audit/" + this.formEightEditPath + id;
        },

        formEightShowPath: "form-eight-show/",
        formEightShow(id) {
            return "location-audit/" + this.formEightShowPath + id;
        },

        // form Nine routes

        formNineOverviewPath: "form-nine-overview",
        formNineOverview() {
            return "location-audit/" + this.formNineOverviewPath;
        },

        formNinePath: "form-nine",
        formNine() {
            return "location-audit/" + this.formNinePath;
        },

        formNineEditPath: "form-nine/",
        formNineEdit(id) {
            return "location-audit/" + this.formNineEditPath + id;
        },

        formNineShowPath: "form-nine-show/",
        formNineShow(id) {
            return "location-audit/" + this.formNineShowPath + id;
        },

        // form Ten routes

        formTenOverviewPath: "form-ten-overview",
        formTenOverview() {
            return "location-audit/" + this.formTenOverviewPath;
        },

        formTenPath: "form-ten",
        formTen() {
            return "location-audit/" + this.formTenPath;
        },

        formTenEditPath: "form-ten/",
        formTenEdit(id) {
            return "location-audit/" + this.formTenEditPath + id;
        },

        formTenShowPath: "form-ten-show/",
        formTenShow(id) {
            return "location-audit/" + this.formTenShowPath + id;
        },

        // form twelve routes

        formTwelveOverviewPath: "form-twelve-overview",
        formTwelveOverview() {
            return "location-audit/" + this.formTwelveOverviewPath;
        },

        formTwelvePath: "form-twelve",
        formTwelve() {
            return "location-audit/" + this.formTwelvePath;
        },

        formTwelveEditPath: "form-twelve/",
        formTwelveEdit(id) {
            return "location-audit/" + this.formTwelveEditPath + id;
        },

        formTwelveShowPath: "form-twelve-show/",
        formTwelveShow(id) {
            return "location-audit/" + this.formTwelveShowPath + id;
        },


        // form fourteen routes

        formFourteenOverviewPath: "form-fourteen-overview",
        formFourteenOverview() {
            return "location-audit/" + this.formFourteenOverviewPath;
        },

        formFourteenPath: "form-fourteen",
        formFourteen() {
            return "location-audit/" + this.formFourteenPath;
        },

        formFourteenEditPath: "form-fourteen/",
        formFourteenEdit(id) {
            return "location-audit/" + this.formFourteenEditPath + id;
        },

        formFourteenShowPath: "form-fourteen-show/",
        formFourteenShow(id) {
            return "location-audit/" + this.formFourteenShowPath + id;
        },

        // form sixteen routes

        formSixteenOverviewPath: "form-sixteen-overview",
        formSixteenOverview() {
            return "location-audit/" + this.formSixteenOverviewPath;
        },

        formSixteenPath: "form-sixteen",
        formSixteen() {
            return "location-audit/" + this.formSixteenPath;
        },

        formSixteenEditPath: "form-sixteen/",
        formSixteenEdit(id) {
            return "location-audit/" + this.formSixteenEditPath + id;
        },

        formSixteenShowPath: "form-sixteen-show/",
        formSixteenShow(id) {
            return "location-audit/" + this.formSixteenShowPath + id;
        },

        // form twenty routes

        formTwentyOverviewPath: "form-twenty-overview",
        formTwentyOverview() {
            return "location-audit/" + this.formTwentyOverviewPath;
        },

        formTwentyPath: "form-twenty",
        formTwenty() {
            return "location-audit/" + this.formTwentyPath;
        },

        formTwentyEditPath: "form-twenty/",
        formTwentyEdit(id) {
            return "location-audit/" + this.formTwentyEditPath + id;
        },

        formTwentyShowPath: "form-twenty-show/",
        formTwentyShow(id) {
            return "location-audit/" + this.formTwentyShowPath + id;
        },


        // form Eleven routes

        formElevenOverviewPath: "form-eleven-overview",
        formElevenOverview() {
            return "location-audit/" + this.formElevenOverviewPath;
        },

        formElevenPath: "form-eleven",
        formEleven() {
            return "location-audit/" + this.formElevenPath;
        },

        formElevenEditPath: "form-eleven/",
        formElevenEdit(id) {
            return "location-audit/" + this.formElevenEditPath + id;
        },

        formElevenShowPath: "form-eleven-show/",
        formElevenShow(id) {
            return "location-audit/" + this.formElevenShowPath + id;
        },


        // form Nineteen routes

        formNineteenOverviewPath: "form-nineteen-overview",
        formNineteenOverview() {
            return "location-audit/" + this.formNineteenOverviewPath;
        },

        formNineteenPath: "form-nineteen",
        formNineteen() {
            return "location-audit/" + this.formNineteenPath;
        },

        formNineteenEditPath: "form-nineteen/",
        formNineteenEdit(id) {
            return "location-audit/" + this.formNineteenEditPath + id;
        },

        formNineteenShowPath: "form-nineteen-show/",
        formNineteenShow(id) {
            return "location-audit/" + this.formNineteenShowPath + id;
        },

        // form TwentyOne routes

        formTwentyOneOverviewPath: "form-twenty-one-overview",
        formTwentyOneOverview() {
            return "location-audit/" + this.formTwentyOneOverviewPath;
        },

        formTwentyOnePath: "form-twenty-one",
        formTwentyOne() {
            return "location-audit/" + this.formTwentyOnePath;
        },

        formTwentyOneEditPath: "form-twenty-one/",
        formTwentyOneEdit(id) {
            return "location-audit/" + this.formTwentyOneEditPath + id;
        },

        formTwentyOneShowPath: "form-twenty-one-show/",
        formTwentyOneShow(id) {
            return "location-audit/" + this.formTwentyOneShowPath + id;
        },

    },

    // Roster-management
    rosterManagement: {
    
     
        leaveManagementPath: "leave-management",
        leaveManagement() {
            return  `roster-management/${this.leaveManagementPath}`;
        },

        rotaManagementPath: "rota-management",
        rotaManagement() {
            return `roster-management/${this.rotaManagementPath}`;
        },
        addShiftPath: "add-shift",
        addShift() {
            return  `roster-management/${this.addShiftPath}`;
        },
        usersWorkingHourReportPath: "users-working-hours",
        usersWorkingHourReport() {
            return  `roster-management/${this.usersWorkingHourReportPath}`;
        },
    },

};

export const Constants = {
    routes: RouteDefinitions
};