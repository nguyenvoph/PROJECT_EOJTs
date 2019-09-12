import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Table, Input, Pagination, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import PaginationComponent from '../Paginations/pagination';
import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from '@progress/kendo-react-excel-export';

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            reportColor: ['success', 'primary', 'warning', 'danger', 'dark'],
            finalReportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu'],
            role: '',
            students: [],
            overviewReports: null,
            overviewReportsRate: null,
            onScreenStatus: null,
            finalOnScreenStatus: null,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,

            numOfStudent: 0,
            dropdownSpecializedOpen: false,
            dropdownSpecialized: [],
            isSearching: false,
            searchingEvaluationList: null,
            searchOverviewReports: null,
            searchOverviewReportsRate: null,
            searchOnScreenStatus: null,
            searchFinalOnScreenStatus: null,
            selectedSpecialized: -1,
            currentEmail: '',
            // MSSV: student.code,
            // name: student.name,
            // companyName: businessName,
            // projectName: report.project_name,
            // startDate: report.timeStart,
            // endDate: report.timeEnd,
            // discipline: report.score_discipline,
            // workEffect: report.score_work,
            // activity: report.score_activity,
            // averageScore: averageScore,
            // rating: rating,
            // daysWork: report.workDays,
            // remark: report.remark,
            reportDownload: {
                MSSV: "",
                name: "",
                companyName: "",
                projectName: "",
                startDate: "",
                endDate: "",
                discipline: "",
                workEffect: "",
                activity: "",
                averageScore: "",
                rating: "",
                daysWork: "",
                remark: "",
            },
            listReportDownload: [],
            reportFileName: '',
        };
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const token = localStorage.getItem('id_token');
        let overviewReportsRate = [];
        let onScreenStatus = [];
        let role = '';
        let email = '';
        let students = [];
        let overviewReports = [];
        let finalOnScreenStatus = [];
        let listStudentAndReport = null;
        let numOfStudent = 0;
        let dropdownSpecialized = [];
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
            email = decoded.email;
        }
        if (role === 'ROLE_SUPERVISOR') {
            listStudentAndReport = await ApiServices.Get(`/supervisor/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            numOfStudent = await ApiServices.Get("/supervisor/getNumStudent");
            for (let index = 0; index < listStudentAndReport.listData.length; index++) {
                students.push(listStudentAndReport.listData[index].student);
                for (let index1 = 0; index1 < listStudentAndReport.listData[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport.listData[index].evaluationList[index1]);
                }
            }
        } else if (role === 'ROLE_HR') {
            listStudentAndReport = await ApiServices.Get(`/business/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            // console.log(listStudentAndReport);
            numOfStudent = await ApiServices.Get("/business/getNumStudent");
            // console.log(numOfStudent);
            dropdownSpecialized = await ApiServices.Get("/business/getSpecializedsOfStudentsInBusiness");
            // console.log(dropdownSpecialized);
            for (let index = 0; index < listStudentAndReport.listData.length; index++) {
                students.push(listStudentAndReport.listData[index].student);
                for (let index1 = 0; index1 < listStudentAndReport.listData[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport.listData[index].evaluationList[index1]);
                }
            }
        } else if (role === 'ROLE_ADMIN') {
            listStudentAndReport = await ApiServices.Get(`/admin/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            // console.log(listStudentAndReport);
            numOfStudent = await ApiServices.Get("/admin/getNumStudent");
            dropdownSpecialized = await ApiServices.Get("/admin/getSpecializedsActive");
            for (let index = 0; index < listStudentAndReport.listData.length; index++) {
                students.push(listStudentAndReport.listData[index].student);
                for (let index1 = 0; index1 < listStudentAndReport.listData[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport.listData[index].evaluationList[index1]);
                }
            }
        }
        // console.log(students);
        // console.log(overviewReports);
        if (overviewReports !== null) {
            for (let index = 0; index < overviewReports.length; index++) {
                if (overviewReports[index] !== null) {
                    overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                    if (overviewReportsRate[index] > 9) {
                        onScreenStatus.push(0);
                    } else if (overviewReportsRate[index] > 8) {
                        onScreenStatus.push(1);
                    } else if (overviewReportsRate[index] > 7) {
                        onScreenStatus.push(2);
                    } else if (overviewReportsRate[index] >= 5) {
                        onScreenStatus.push(3);
                    } else {
                        onScreenStatus.push(4);
                    }
                } else {
                    overviewReportsRate.push(null);
                    onScreenStatus.push(null);
                }
            }
        }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }
        console.log(listStudentAndReport);
        this.setState({
            loading: false,
            role: role,
            currentEmail: email,
            students: students,
            overviewReports: overviewReports,
            overviewReportsRate: overviewReportsRate,
            onScreenStatus: onScreenStatus,
            finalOnScreenStatus: finalOnScreenStatus,
            pageNumber: listStudentAndReport.pageNumber,
            numOfStudent: numOfStudent,
            dropdownSpecialized: dropdownSpecialized,
        });
        // console.log(this.state.onScreenStatus);
        // console.log(this.state.overviewReports);
        // console.log(this.state.students);
        // console.log(this.state.finalOnScreenStatus);
    }

    toggleDropdownSpecialized = () => {
        this.setState({
            dropdownSpecializedOpen: !this.state.dropdownSpecializedOpen,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            if (this.state.role === "ROLE_SUPERVISOR") {
                var searchList = [];
                var overviewReports = [];
                var overviewReportsRate = [];
                var onScreenStatus = [];
                var finalOnScreenStatus = [];
                const searchingEvaluationList = await ApiServices.Get(`/supervisor/searchingEvaluationAllField?valueSearch=${value.substr(0, 20)}`);
                // console.log(searchingEvaluationList);
                // console.log(searchingEvaluationList.evaluationList);
                for (let index = 0; index < searchingEvaluationList.length; index++) {
                    searchList.push(searchingEvaluationList[index].student);
                    for (let index1 = 0; index1 < searchingEvaluationList[index].evaluationList.length; index1++) {
                        overviewReports.push(searchingEvaluationList[index].evaluationList[index1]);
                    }
                }
                if (overviewReports !== null) {
                    for (let index = 0; index < overviewReports.length; index++) {
                        if (overviewReports[index] !== null) {
                            overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                            if (overviewReportsRate[index] > 9) {
                                onScreenStatus.push(0);
                            } else if (overviewReportsRate[index] > 8) {
                                onScreenStatus.push(1);
                            } else if (overviewReportsRate[index] > 7) {
                                onScreenStatus.push(2);
                            } else if (overviewReportsRate[index] >= 5) {
                                onScreenStatus.push(3);
                            } else {
                                onScreenStatus.push(4);
                            }
                        } else {
                            overviewReportsRate.push(null);
                            onScreenStatus.push(null);
                        }
                    }
                }
                // console.log(overviewReportsRate);
                // console.log(searchList);
                let tmpFinalRate = [];
                for (let index = 0; index < searchList.length; index++) {
                    if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                        tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
                    } else {
                        tmpFinalRate.push(null);
                    }
                }
                // console.log(tmpFinalRate);
                for (let index = 0; index < tmpFinalRate.length; index++) {
                    // console.log(tmpFinalRate[index]);
                    if (tmpFinalRate[index] === null) {
                        finalOnScreenStatus.push(null);
                    } else {
                        if (parseFloat(tmpFinalRate[index]) > 9) {
                            finalOnScreenStatus.push(0);
                        } else if (parseFloat(tmpFinalRate[index]) > 8) {
                            finalOnScreenStatus.push(1);
                        } else if (parseFloat(tmpFinalRate[index]) > 7) {
                            finalOnScreenStatus.push(2);
                        } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                            finalOnScreenStatus.push(3);
                        } else if (parseFloat(tmpFinalRate[index]) < 5) {
                            finalOnScreenStatus.push(4);
                        }
                    }
                }
                console.log(searchList);
                await this.setState({
                    [name]: value.substr(0, 20),
                    isSearching: true,
                    searchingEvaluationList: searchList,
                    searchOverviewReports: overviewReports,
                    searchOverviewReportsRate: overviewReportsRate,
                    searchOnScreenStatus: onScreenStatus,
                    searchFinalOnScreenStatus: finalOnScreenStatus,
                })

            }
            if (this.state.role === "ROLE_HR") {
                var searchList = [];
                var overviewReports = [];
                var overviewReportsRate = [];
                var onScreenStatus = [];
                var finalOnScreenStatus = [];
                const searchingEvaluationList = await ApiServices.Get(`/business/searchingEvaluationAllField?valueSearch=${value.substr(0, 20)}`);
                // console.log(searchingEvaluationList);
                // console.log(searchingEvaluationList.evaluationList);
                for (let index = 0; index < searchingEvaluationList.length; index++) {
                    searchList.push(searchingEvaluationList[index].student);
                    for (let index1 = 0; index1 < searchingEvaluationList[index].evaluationList.length; index1++) {
                        overviewReports.push(searchingEvaluationList[index].evaluationList[index1]);
                    }
                }
                if (overviewReports !== null) {
                    for (let index = 0; index < overviewReports.length; index++) {
                        if (overviewReports[index] !== null) {
                            overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                            if (overviewReportsRate[index] > 9) {
                                onScreenStatus.push(0);
                            } else if (overviewReportsRate[index] > 8) {
                                onScreenStatus.push(1);
                            } else if (overviewReportsRate[index] > 7) {
                                onScreenStatus.push(2);
                            } else if (overviewReportsRate[index] >= 5) {
                                onScreenStatus.push(3);
                            } else {
                                onScreenStatus.push(4);
                            }
                        } else {
                            overviewReportsRate.push(null);
                            onScreenStatus.push(null);
                        }
                    }
                }
                // console.log(overviewReportsRate);
                // console.log(searchList);
                let tmpFinalRate = [];
                for (let index = 0; index < searchList.length; index++) {
                    if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                        tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
                    } else {
                        tmpFinalRate.push(null);
                    }
                }
                // console.log(tmpFinalRate);
                for (let index = 0; index < tmpFinalRate.length; index++) {
                    // console.log(tmpFinalRate[index]);
                    if (tmpFinalRate[index] === null) {
                        finalOnScreenStatus.push(null);
                    } else {
                        if (parseFloat(tmpFinalRate[index]) > 9) {
                            finalOnScreenStatus.push(0);
                        } else if (parseFloat(tmpFinalRate[index]) > 8) {
                            finalOnScreenStatus.push(1);
                        } else if (parseFloat(tmpFinalRate[index]) > 7) {
                            finalOnScreenStatus.push(2);
                        } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                            finalOnScreenStatus.push(3);
                        } else if (parseFloat(tmpFinalRate[index]) < 5) {
                            finalOnScreenStatus.push(4);
                        }
                    }
                }
                console.log(searchList);
                await this.setState({
                    [name]: value.substr(0, 20),
                    isSearching: true,
                    searchingEvaluationList: searchList,
                    searchOverviewReports: overviewReports,
                    searchOverviewReportsRate: overviewReportsRate,
                    searchOnScreenStatus: onScreenStatus,
                    searchFinalOnScreenStatus: finalOnScreenStatus,
                })

            }
            if (this.state.role === "ROLE_ADMIN") {
                var searchList = [];
                var overviewReports = [];
                var overviewReportsRate = [];
                var onScreenStatus = [];
                var finalOnScreenStatus = [];
                const searchingEvaluationList = await ApiServices.Get(`/admin/searchingEvaluationAllField?valueSearch=${value.substr(0, 20)}`);
                // console.log(searchingEvaluationList);
                // console.log(searchingEvaluationList.evaluationList);
                for (let index = 0; index < searchingEvaluationList.length; index++) {
                    searchList.push(searchingEvaluationList[index].student);
                    for (let index1 = 0; index1 < searchingEvaluationList[index].evaluationList.length; index1++) {
                        overviewReports.push(searchingEvaluationList[index].evaluationList[index1]);
                    }
                }
                if (overviewReports !== null) {
                    for (let index = 0; index < overviewReports.length; index++) {
                        if (overviewReports[index] !== null) {
                            overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                            if (overviewReportsRate[index] > 9) {
                                onScreenStatus.push(0);
                            } else if (overviewReportsRate[index] > 8) {
                                onScreenStatus.push(1);
                            } else if (overviewReportsRate[index] > 7) {
                                onScreenStatus.push(2);
                            } else if (overviewReportsRate[index] >= 5) {
                                onScreenStatus.push(3);
                            } else {
                                onScreenStatus.push(4);
                            }
                        } else {
                            overviewReportsRate.push(null);
                            onScreenStatus.push(null);
                        }
                    }
                }
                // console.log(overviewReportsRate);
                // console.log(searchList);
                let tmpFinalRate = [];
                for (let index = 0; index < searchList.length; index++) {
                    if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                        tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
                    } else {
                        tmpFinalRate.push(null);
                    }
                }
                // console.log(tmpFinalRate);
                for (let index = 0; index < tmpFinalRate.length; index++) {
                    // console.log(tmpFinalRate[index]);
                    if (tmpFinalRate[index] === null) {
                        finalOnScreenStatus.push(null);
                    } else {
                        if (parseFloat(tmpFinalRate[index]) > 9) {
                            finalOnScreenStatus.push(0);
                        } else if (parseFloat(tmpFinalRate[index]) > 8) {
                            finalOnScreenStatus.push(1);
                        } else if (parseFloat(tmpFinalRate[index]) > 7) {
                            finalOnScreenStatus.push(2);
                        } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                            finalOnScreenStatus.push(3);
                        } else if (parseFloat(tmpFinalRate[index]) < 5) {
                            finalOnScreenStatus.push(4);
                        }
                    }
                }
                console.log(searchList);
                await this.setState({
                    [name]: value.substr(0, 20),
                    isSearching: true,
                    searchingEvaluationList: searchList,
                    searchOverviewReports: overviewReports,
                    searchOverviewReportsRate: overviewReportsRate,
                    searchOnScreenStatus: onScreenStatus,
                    searchFinalOnScreenStatus: finalOnScreenStatus,
                })

            }
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handlePageNumber = async (currentPage) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];
        let studentsPaging = [];

        const { rowsPerPage } = this.state;
        console.log(currentPage);
        console.log(rowsPerPage);

        if (this.state.role === "ROLE_ADMIN") {
            studentsPaging = await ApiServices.Get(`/admin/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_HR") {
            studentsPaging = await ApiServices.Get(`/business/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_SUPERVISOR") {
            studentsPaging = await ApiServices.Get(`/supervisor/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
            for (let index = 0; index < overviewReports.length; index++) {
                if (overviewReports[index] !== null) {
                    overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                    if (overviewReportsRate[index] > 9) {
                        onScreenStatus.push(0);
                    } else if (overviewReportsRate[index] > 8) {
                        onScreenStatus.push(1);
                    } else if (overviewReportsRate[index] > 7) {
                        onScreenStatus.push(2);
                    } else if (overviewReportsRate[index] >= 5) {
                        onScreenStatus.push(3);
                    } else {
                        onScreenStatus.push(4);
                    }
                } else {
                    overviewReportsRate.push(null);
                    onScreenStatus.push(null);
                }
            }
        }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: currentPage,
                pageNumber: studentsPaging.pageNumber,
                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];
        let studentsPaging = [];
        const { rowsPerPage } = this.state;

        if (this.state.role === "ROLE_ADMIN") {
            studentsPaging = await ApiServices.Get(`/admin/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_HR") {
            studentsPaging = await ApiServices.Get(`/business/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_SUPERVISOR") {
            studentsPaging = await ApiServices.Get(`/supervisor/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
            for (let index = 0; index < overviewReports.length; index++) {
                if (overviewReports[index] !== null) {
                    overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                    if (overviewReportsRate[index] > 9) {
                        onScreenStatus.push(0);
                    } else if (overviewReportsRate[index] > 8) {
                        onScreenStatus.push(1);
                    } else if (overviewReportsRate[index] > 7) {
                        onScreenStatus.push(2);
                    } else if (overviewReportsRate[index] >= 5) {
                        onScreenStatus.push(3);
                    } else {
                        onScreenStatus.push(4);
                    }
                } else {
                    overviewReportsRate.push(null);
                    onScreenStatus.push(null);
                }
            }
        }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: currentPage,
                pageNumber: studentsPaging.pageNumber,
                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    handlePageNext = async (currentPage) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];

        let studentsPaging = [];
        const { rowsPerPage } = this.state;

        if (this.state.role === "ROLE_ADMIN") {
            studentsPaging = await ApiServices.Get(`/admin/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_HR") {
            studentsPaging = await ApiServices.Get(`/business/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_SUPERVISOR") {
            studentsPaging = await ApiServices.Get(`/supervisor/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        }
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
            for (let index = 0; index < overviewReports.length; index++) {
                if (overviewReports[index] !== null) {
                    overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                    if (overviewReportsRate[index] > 9) {
                        onScreenStatus.push(0);
                    } else if (overviewReportsRate[index] > 8) {
                        onScreenStatus.push(1);
                    } else if (overviewReportsRate[index] > 7) {
                        onScreenStatus.push(2);
                    } else if (overviewReportsRate[index] >= 5) {
                        onScreenStatus.push(3);
                    } else {
                        onScreenStatus.push(4);
                    }
                } else {
                    overviewReportsRate.push(null);
                    onScreenStatus.push(null);
                }
            }
        }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: currentPage,
                pageNumber: studentsPaging.pageNumber,
                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    handleInputPaging = async (event) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
            // students: null,
        })

        const { rowsPerPage } = this.state;

        let studentsPaging = [];
        if (this.state.role === "ROLE_ADMIN") {
            studentsPaging = await ApiServices.Get(`/admin/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_HR") {
            studentsPaging = await ApiServices.Get(`/business/studentsEvaluations?specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role === "ROLE_SUPERVISOR") {
            studentsPaging = await ApiServices.Get(`/supervisor/studentsEvaluations?currentPage=0&rowsPerPage=${rowsPerPage}`);
        }
        // console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
            for (let index = 0; index < overviewReports.length; index++) {
                if (overviewReports[index] !== null) {
                    overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                    if (overviewReportsRate[index] > 9) {
                        onScreenStatus.push(0);
                    } else if (overviewReportsRate[index] > 8) {
                        onScreenStatus.push(1);
                    } else if (overviewReportsRate[index] > 7) {
                        onScreenStatus.push(2);
                    } else if (overviewReportsRate[index] >= 5) {
                        onScreenStatus.push(3);
                    } else {
                        onScreenStatus.push(4);
                    }
                } else {
                    overviewReportsRate.push(null);
                    onScreenStatus.push(null);
                }
            }
        }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: 0,
                pageNumber: studentsPaging.pageNumber,

                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
        // console.log(this.state.students);
    }

    handleSelectSpecialized = async (specializedId) => {
        console.log(specializedId);
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];

        const { rowsPerPage } = this.state;

        let studentsPaging = [];
        if (this.state.role == "ROLE_ADMIN") {
            studentsPaging = await ApiServices.Get(`/admin/studentsEvaluations?specializedID=${specializedId}&currentPage=0&rowsPerPage=${rowsPerPage}`);
        }
        if (this.state.role == "ROLE_HR") {
            studentsPaging = await ApiServices.Get(`/business/studentsEvaluations?specializedID=${specializedId}&currentPage=0&rowsPerPage=${rowsPerPage}`);
        }
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
            for (let index = 0; index < overviewReports.length; index++) {
                if (overviewReports[index] !== null) {
                    overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
                    if (overviewReportsRate[index] > 9) {
                        onScreenStatus.push(0);
                    } else if (overviewReportsRate[index] > 8) {
                        onScreenStatus.push(1);
                    } else if (overviewReportsRate[index] > 7) {
                        onScreenStatus.push(2);
                    } else if (overviewReportsRate[index] >= 5) {
                        onScreenStatus.push(3);
                    } else {
                        onScreenStatus.push(4);
                    }
                } else {
                    overviewReportsRate.push(null);
                    onScreenStatus.push(null);
                }
            }
        }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: 0,
                pageNumber: studentsPaging.pageNumber,

                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
                selectedSpecialized: specializedId,
            })
        }
    }

    _exporter;
    export = async (studentName, studentCode, studentEmail) => {
        // console.log(studentName);
        // console.log(studentCode);
        // console.log(studentEmail);
        //name
        let reportFileName = "";
        let formatStudentName = studentName.split(" ");
        reportFileName = "Đánh giá hàng tháng_" + formatStudentName[formatStudentName.length - 1];
        for (let index = 0; index < formatStudentName.length - 1; index++) {
            reportFileName += formatStudentName[index].substring(0, 1);
        }
        reportFileName += studentCode;
        const reports = await ApiServices.Get(`/student/evaluationsOfStudent?email=${studentEmail}`);
        console.log(reports);
        const businessesOfReport = await ApiServices.Get(`/student/businessesOfEvaluations?email=${studentEmail}`);
        //report
        // MSSV: student.code,
        // name: student.name,
        // companyName: businessName,
        // projectName: report.project_name,
        // startDate: report.timeStart,
        // endDate: report.timeEnd,
        // discipline: report.score_discipline,
        // workEffect: report.score_work,
        // activity: report.score_activity,
        // averageScore: averageScore,
        // rating: rating,
        // daysWork: report.workDays,
        // remark: report.remark,
        let listReportDownload = [];
        if (reports !== null) {
            for (let index = 0; index < reports.length; index++) {
                let reportDownload = this.state.reportDownload;
                reportDownload.MSSV = studentCode;
                reportDownload.name = studentName;
                reportDownload.companyName = businessesOfReport[index];
                reportDownload.projectName = reports[index].project_name;
                reportDownload.startDate = reports[index].timeStart;
                reportDownload.endDate = reports[index].timeEnd;
                reportDownload.discipline = reports[index].score_discipline.toFixed(1);
                reportDownload.workEffect = reports[index].score_work.toFixed(1);
                reportDownload.activity = reports[index].score_activity.toFixed(1);
                reportDownload.averageScore = (parseFloat(reports[index].score_discipline) * 0.4 + parseFloat(reports[index].score_work) * 0.5 + parseFloat(reports[index].score_activity) * 0.1).toFixed(1);
                if (reportDownload.averageScore > 9) {
                    reportDownload.rating = "Xuất sắc";
                } else if (reportDownload.averageScore > 8) {
                    reportDownload.rating = "Tốt";
                } else if (reportDownload.averageScore > 7) {
                    reportDownload.rating = "Khá";
                } else if (reportDownload.averageScore >= 5) {
                    reportDownload.rating = "Trung bình";
                } else {
                    reportDownload.rating = "Yếu";
                }
                reportDownload.daysWork = reports[index].workDays;
                reportDownload.remark = reports[index].remark;
                listReportDownload.push(reportDownload);
                await this.setState({
                    reportDownload: {
                        MSSV: "",
                        name: "",
                        companyName: "",
                        projectName: "",
                        startDate: "",
                        endDate: "",
                        discipline: "",
                        workEffect: "",
                        activity: "",
                        averageScore: "",
                        rating: "",
                        daysWork: "",
                        remark: "",
                    },
                })
            }
        }

        await this.setState({
            reportFileName: reportFileName,
            listReportDownload: listReportDownload,
        })
        console.log(listReportDownload);
        this._exporter.save();
    }

    render() {
        const { loading, reportColor, rate, role, students, overviewReports, onScreenStatus, finalOnScreenStatus, finalReportColor } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfStudent, dropdownSpecialized, searchingEvaluationList, isSearching, searchFinalOnScreenStatus, searchOnScreenStatus, searchOverviewReports, reportFileName, listReportDownload, currentEmail } = this.state;

        // if (students != null) {
        //     console.log(students);
        // }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <ExcelExport
                            data={listReportDownload}
                            fileName={reportFileName}
                            ref={(exporter) => { this._exporter = exporter; }}
                        >
                            <ExcelExportColumnGroup title="Đánh giá tháng 1, 2, 3, 4 & Đánh giá tổng"
                                headerCellOptions={{ textAlign: 'center', background: '#ffffff', bold: true, color: '#000000', fontSize: 18 }}
                            >
                                <ExcelExportColumn field="MSSV" title="MSSV"
                                    headerCellOptions={{ textAlign: 'center', bold: true, background: '#ffffff', color: '#000000', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                <ExcelExportColumn field="name" title="Họ Tên"
                                    headerCellOptions={{ textAlign: 'center', bold: true, background: '#ffffff', color: '#000000', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                <ExcelExportColumn field="companyName" title="Tên Doanh Nghiệp"
                                    headerCellOptions={{ textAlign: 'center', bold: true, background: '#ffffff', color: '#000000', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                <ExcelExportColumn field="projectName" title="Tên Dự Án"
                                    headerCellOptions={{ textAlign: 'center', bold: true, background: '#ffffff', color: '#000000', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                <ExcelExportColumn field="startDate" title="Ngày bắt đầu đánh giá"
                                    headerCellOptions={{ textAlign: 'center', bold: true, background: '#ffffff', color: '#000000', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                <ExcelExportColumn field="endDate" title="Ngày kết thúc đánh giá"
                                    headerCellOptions={{ textAlign: 'center', bold: true, background: '#ffffff', color: '#000000', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                <ExcelExportColumnGroup title="Đánh giá OJT"
                                    headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }}>
                                    <ExcelExportColumn field="discipline" title="Kỷ luật(40%)"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                    <ExcelExportColumn field="workEffect" title="Hiệu quả công việc(50%)"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                    <ExcelExportColumn field="activity" title="Tham gia các hoạt động(10%)"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                    <ExcelExportColumn field="averageScore" title="Kết quả thực tập"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                    <ExcelExportColumn field="rating" title="Xếp loại"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                    <ExcelExportColumn field="daysWork" title="Số ngày làm việc"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                    <ExcelExportColumn field="remark" title="Nhận xét"
                                        headerCellOptions={{ textAlign: 'center', bold: true, color: '#000000', background: '#FFFF00', borderTop: "size:2", borderLeft: "size:2", borderRight: "size:2", borderBottom: "size:2" }} />
                                </ExcelExportColumnGroup>
                            </ExcelExportColumnGroup>
                        </ExcelExport>
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Đánh giá
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>MSSV</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Họ và tên</th>
                                                        {role && role === 'ROLE_SUPERVISOR' ?
                                                            <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Chuyên ngành</th> :
                                                            (role && role === 'ROLE_HR' ?
                                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                                    <Dropdown isOpen={this.state.dropdownSpecializedOpen} toggle={() => this.toggleDropdownSpecialized()}>
                                                                        <DropdownToggle nav caret style={{ color: "black" }}>
                                                                            Chuyên ngành
                                                                        </DropdownToggle>
                                                                        <DropdownMenu style={{ textAlign: 'center', right: 'auto' }}>
                                                                            <DropdownItem onClick={() => this.handleSelectSpecialized(-1)}>Tổng</DropdownItem>
                                                                            {dropdownSpecialized && dropdownSpecialized.map((specialized, index) => {
                                                                                return (
                                                                                    <DropdownItem onClick={() => this.handleSelectSpecialized(specialized.id)}>{specialized.name}</DropdownItem>
                                                                                )
                                                                            })
                                                                            }
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </th> :
                                                                (role && role === 'ROLE_ADMIN' ?
                                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                                        <Dropdown isOpen={this.state.dropdownSpecializedOpen} toggle={() => this.toggleDropdownSpecialized()}>
                                                                            <DropdownToggle nav caret style={{ color: "black" }}>
                                                                                Chuyên ngành
                                                                            </DropdownToggle>
                                                                            <DropdownMenu style={{ textAlign: 'center', right: 'auto' }}>
                                                                                <DropdownItem onClick={() => this.handleSelectSpecialized(-1)}>Tổng</DropdownItem>
                                                                                {dropdownSpecialized && dropdownSpecialized.map((specialized, index) => {
                                                                                    return (
                                                                                        <DropdownItem onClick={() => this.handleSelectSpecialized(specialized.id)}>{specialized.name}</DropdownItem>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </DropdownMenu>
                                                                        </Dropdown>
                                                                    </th> :
                                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Chuyên ngành</th>)
                                                            )
                                                        }
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Đánh giá #1</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Đánh giá #2</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Đánh giá #3</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Đánh giá #4</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Kết quả OJT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isSearching === false ?
                                                        (students && students.map((student, index) =>
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {onScreenStatus[index * 4] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/1~${student.email}`)}>
                                                                                        Tạo
                                                                                    </Button> :
                                                                                    (student.supervisor.email === currentEmail ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/1~${student.email}`)}>
                                                                                            Tạo
                                                                                    </Button> :
                                                                                        <p>N/A</p>
                                                                                    )
                                                                                )
                                                                                :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${overviewReports[index * 4].id}~${student.email}`)}>
                                                                                    {rate[onScreenStatus[index * 4]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${overviewReports[index * 4].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${overviewReports[index * 4].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {onScreenStatus[index * 4 + 1] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (onScreenStatus[index * 4] !== null ?
                                                                                    (role === "ROLE_SUPERVISOR" ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/2~${student.email}`)}>
                                                                                            Tạo
                                                                                        </Button> :
                                                                                        (student.supervisor.email === currentEmail ?
                                                                                            <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/2~${student.email}`)}>
                                                                                                Tạo
                                                                                        </Button> :
                                                                                            <p>N/A</p>
                                                                                        )
                                                                                    )
                                                                                    :
                                                                                    <p>N/A</p>
                                                                                ) :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${overviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                                    {rate[onScreenStatus[index * 4 + 1]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${overviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4 + 1]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${overviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4 + 1]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {onScreenStatus[index * 4 + 2] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (onScreenStatus[index * 4 + 1] !== null ?
                                                                                    (role === "ROLE_SUPERVISOR" ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/3~${student.email}`)}>
                                                                                            Tạo
                                                                                        </Button> :
                                                                                        (student.supervisor.email === currentEmail ?
                                                                                            <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/3~${student.email}`)}>
                                                                                                Tạo
                                                                                        </Button> :
                                                                                            <p>N/A</p>
                                                                                        )
                                                                                    )
                                                                                    :
                                                                                    <p>N/A</p>
                                                                                ) :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${overviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                                    {rate[onScreenStatus[index * 4 + 2]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${overviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4 + 2]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${overviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4 + 2]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {onScreenStatus[index * 4 + 3] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (onScreenStatus[index * 4 + 2] !== null ?
                                                                                    (role === "ROLE_SUPERVISOR" ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/4~${student.email}`)}>
                                                                                            Tạo
                                                                                        </Button> :
                                                                                        (student.supervisor.email === currentEmail ?
                                                                                            <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/4~${student.email}`)}>
                                                                                                Tạo
                                                                                        </Button> :
                                                                                            <p>N/A</p>
                                                                                        )
                                                                                    )
                                                                                    :
                                                                                    <p>N/A</p>
                                                                                ) :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${overviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                                    {rate[onScreenStatus[index * 4 + 3]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${overviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4 + 3]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${overviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                                        {rate[onScreenStatus[index * 4 + 3]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                {finalOnScreenStatus[index] === null ?
                                                                    <td style={{ textAlign: "center" }}>N/A</td> :
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <Button style={{ fontWeight: 'bold', color: finalReportColor[finalOnScreenStatus[index]] }} color="link" onClick={() => this.export(student.name, student.code, student.email)}>
                                                                            {rate[finalOnScreenStatus[index]]}
                                                                        </Button>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )) :
                                                        (searchingEvaluationList && searchingEvaluationList.map((student, index) =>
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {searchOnScreenStatus[index * 4] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/1~${student.email}`)}>
                                                                                        Tạo
                                                                                    </Button> :
                                                                                    (student.supervisor.email === currentEmail ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/1~${student.email}`)}>
                                                                                            Tạo
                                                                                    </Button> :
                                                                                        <p>N/A</p>
                                                                                    )
                                                                                )
                                                                                :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${searchOverviewReports[index * 4].id}~${student.email}`)}>
                                                                                    {rate[searchOnScreenStatus[index * 4]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${searchOverviewReports[index * 4].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${searchOverviewReports[index * 4].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {searchOnScreenStatus[index * 4 + 1] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (searchOnScreenStatus[index * 4] !== null ?
                                                                                    (role === "ROLE_SUPERVISOR" ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/2~${student.email}`)}>
                                                                                            Tạo
                                                                                        </Button> :
                                                                                        (student.supervisor.email === currentEmail ?
                                                                                            <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/2~${student.email}`)}>
                                                                                                Tạo
                                                                                        </Button> :
                                                                                            <p>N/A</p>
                                                                                        )
                                                                                    )
                                                                                    :
                                                                                    <p>N/A</p>
                                                                                ) :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${searchOverviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                                    {rate[searchOnScreenStatus[index * 4 + 1]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${searchOverviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4 + 1]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${searchOverviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4 + 1]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {searchOnScreenStatus[index * 4 + 2] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (searchOnScreenStatus[index * 4 + 1] !== null ?
                                                                                    (role === "ROLE_SUPERVISOR" ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/3~${student.email}`)}>
                                                                                            Tạo
                                                                                        </Button> :
                                                                                        (student.supervisor.email === currentEmail ?
                                                                                            <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/3~${student.email}`)}>
                                                                                                Tạo
                                                                                        </Button> :
                                                                                            <p>N/A</p>
                                                                                        )
                                                                                    )
                                                                                    :
                                                                                    <p>N/A</p>
                                                                                ) :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${searchOverviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                                    {rate[searchOnScreenStatus[index * 4 + 2]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${searchOverviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4 + 2]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${searchOverviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4 + 2]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {searchOnScreenStatus[index * 4 + 3] === null ?
                                                                        (
                                                                            role && role !== 'ROLE_ADMIN' ?
                                                                                (searchOnScreenStatus[index * 4 + 2] !== null ?
                                                                                    (role === "ROLE_SUPERVISOR" ?
                                                                                        <Button color='primary' onClick={() => this.handleDirect(`/supervisor/Report/Create_Report/4~${student.email}`)}>
                                                                                            Tạo
                                                                                        </Button> :
                                                                                        (student.supervisor.email === currentEmail ?
                                                                                            <Button color='primary' onClick={() => this.handleDirect(`/hr/Report/Create_Report/4~${student.email}`)}>
                                                                                                Tạo
                                                                                        </Button> :
                                                                                            <p>N/A</p>
                                                                                        )
                                                                                    )
                                                                                    :
                                                                                    <p>N/A</p>
                                                                                ) :
                                                                                <p>N/A</p>
                                                                        ) :
                                                                        (
                                                                            role && role === "ROLE_ADMIN" ?
                                                                                <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/admin/Report/Report_Detail/${searchOverviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                                    {rate[searchOnScreenStatus[index * 4 + 3]]}
                                                                                </Button> :
                                                                                (role === "ROLE_SUPERVISOR" ?
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${searchOverviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4 + 3]]}
                                                                                    </Button> :
                                                                                    <Button style={{ fontWeight: 'bold' }} outline color={reportColor[searchOnScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${searchOverviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                                        {rate[searchOnScreenStatus[index * 4 + 3]]}
                                                                                    </Button>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                {searchFinalOnScreenStatus[index] === null ?
                                                                    <td style={{ textAlign: "center" }}>N/A</td> :
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <Button style={{ fontWeight: 'bold', color: finalReportColor[searchFinalOnScreenStatus[index]] }} color="link" onClick={() => this.export(student.name, student.code, student.email)}>
                                                                            {rate[searchFinalOnScreenStatus[index]]}
                                                                        </Button>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        {students && students !== null ?
                                            (isSearching === false ?
                                                <Row>
                                                    <Col>
                                                        <Row>
                                                            <Pagination>
                                                                <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                            </Pagination>
                                                            &emsp;
                                                        <h6 style={{ marginTop: '7px' }}>Số dòng trên trang: </h6>
                                                            &nbsp;&nbsp;
                                                        <Input onChange={this.handleInputPaging} type="select" name="rowsPerPage" style={{ width: "70px" }}>
                                                                <option value={10} selected={rowsPerPage === 10}>10</option>
                                                                <option value={20}>20</option>
                                                                <option value={50}>50</option>
                                                            </Input>
                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                        <Row className="float-right">
                                                            <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + students.length} trên tổng số {numOfStudent} kết quả</Label>
                                                        </Row>
                                                    </Col>
                                                </Row> : <></>) : <></>
                                        }
                                    </CardBody>
                                    {/* <CardFooter>
                                    </CardFooter> */}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Report;
