import firebase from 'firebase/app';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Badge, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, Pagination, Row, TabContent, Table, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

const storage = firebase.storage();

class student_list extends Component {

    constructor(props) {
        super(props);

        // this.toggle = this.toggle.bind(this);
        this.state = {
            modal: false,
            modalDetail: false,
            modalTask: false,
            modalFeedBack: false,
            listFeedBack: [],
            studentFeedBack: null,
            activeTab: new Array(1).fill('1'),
            // open: false,
            students: [],
            searchValue: '',
            loading: true,
            suggestedBusiness: null,
            otherBusiness: null,
            studentSelect: null,
            isUploadTranscriptLink: false,


            student: null,
            name: '',
            code: '',
            email: '',
            phone: '',
            address: '',
            specialized: '',
            objective: '',
            gpa: '',
            resumeLink: '',
            transcriptLink: '',
            file: null,
            skills: [],
            role: '',

            listStudentTask: null,
            studentDetail: null,
            months: null,
            isThisMonth: -1,

            typesOfStudent: ['Tổng', 'Rớt'],
            typeSelected: 1,

            isViewSurvey: 0,
            survey: null,
            businessSurvey: null,

            dropdownOpen: false,
            nameSortOrder: 0,
            codeSortOrder: 0,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,
            pageNumberSuggest: 1,
            currentPageSuggest: 0,
            rowsPerPageSuggest: 10,
            pageNumberCbAll: 1,
            currentPageCbAll: 0,
            rowsPerPageCbAll: 10,

            filterStudentTaskList: null,
            stateTask: ["Tổng", "Hoàn thành", "Chưa hoàn thành"],
            stateNo: 0,

            dropdownSpecializedOpen: false,
            dropdownSpecialized: [],
            isSearching: false,

            selectedSpecialized: -1,
            searchingListAll: [],
            searchingListCbAll: [],
            searchingListSuggest: [],
            isSearchingAll: false,
            numOfStudentAll: 0,
            isSearchingSuggest: false,
            numOfStudentSuggest: 0,
        };
        // this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const dropdownSpecialized = await ApiServices.Get("/admin/getSpecializedsActive");
        const numOfStudentAll = await ApiServices.Get(`/student/searchListStudent?valueSearch=${""}`);
        const numOfStudentSuggest = await ApiServices.Get(`/student/searchStudentWithHope?valueSearch=${""}&type=1`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
                dropdownSpecialized: dropdownSpecialized,
                numOfStudentAll: numOfStudentAll.length,
                numOfStudentSuggest: numOfStudentSuggest.length,
            });
        }
        // const students = await ApiServices.Get('/student/getAllStudent');
        // if (students !== null) {
        //     this.setState({
        //         students,
        //         loading: false,
        //         nameSortOrder: 0,
        //         codeSortOrder: 0,
        //     });
        // }
    }

    toggleDropdownSpecialized = () => {
        this.setState({
            dropdownSpecializedOpen: !this.state.dropdownSpecializedOpen,
        });
    }

    handleSelectSpecialized = async (specializedId) => {
        console.log(specializedId);

        const { rowsPerPage } = this.state;

        const studentsPaging = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${specializedId}&currentPage=0&rowsPerPage=${rowsPerPage}`);
        console.log(studentsPaging);

        if (studentsPaging !== null) {
            this.setState({
                students: studentsPaging.listData,
                pageNumber: studentsPaging.pageNumber,
                nameSortOrder: 0,
                codeSortOrder: 0,
                selectedSpecialized: specializedId,
            })
        }
    }

    toggle = async (tabPane, tab) => {
        const newArray = this.state.activeTab.slice();
        newArray[tabPane] = tab;
        let students = null;
        let typeSelected;
        if (tab == 1) {
            const { currentPage, rowsPerPage } = this.state;
            students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            if (students !== null) {
                this.setState({
                    students: students.listData,
                    pageNumber: students.pageNumber,
                    loading: false,
                    nameSortOrder: 0,
                    codeSortOrder: 0,
                });
            }
            // students = await ApiServices.Get('/student/getAllStudent');
        } else if (tab == 2) {
            const { currentPageSuggest, rowsPerPageSuggest } = this.state;
            students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);
            if (students !== null) {
                this.setState({
                    students: students.listData,
                    pageNumberSuggest: students.pageNumber,
                    loading: false,
                    nameSortOrder: 0,
                    codeSortOrder: 0,
                    selectedSpecialized: -1,
                });
            }
            // students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            typeSelected = 1;
        }
        if (students != null) {
            this.setState({
                activeTab: newArray,
                // students: students,
                typeSelected: typeSelected,
            });
        }
        // console.log(tabPane);
        // console.log(tab);
        // console.log(this.state.activeTab);
    }

    toggleModal = async (studentSelect) => {
        let suggestedBusiness = null;
        let otherBusiness = null;
        if (this.state.modal === false) {
            this.setState({
                loading: true,
            })
            suggestedBusiness = await ApiServices.Get(`/admin/getSuggestedBusinessForFail?email=${studentSelect.email}`);
            otherBusiness = await ApiServices.Get(`/admin/getOtherBusiness?email=${studentSelect.email}`);
        }
        // console.log(suggestedBusiness);
        // console.log(otherBusiness);
        this.setState({
            modal: !this.state.modal,
            suggestedBusiness: suggestedBusiness,
            otherBusiness: otherBusiness,
            studentSelect: studentSelect,
            loading: false,
        });
    }

    toggleModalDetail = async (email) => {
        let students = null;
        let businessSurvey = null;
        let survey = null;
        let role = '';
        if (this.state.modalDetail === false) {
            students = await ApiServices.Get(`/student/student/${email}`);
            businessSurvey = await ApiServices.Get(`/student/business?email=${email}`);
            survey = await ApiServices.Get(`/student/answersOfStudent?studentEmail=${email}`);
            // console.log(survey.length);
            if (survey !== null) {
                if (survey.length === 0) {
                    survey = null;
                }
            }
            const token = localStorage.getItem('id_token');
            if (token !== null) {
                const decoded = decode(token);
                role = decoded.role;
            }

            this.setState({
                student: students,
                name: students.name,
                code: students.code,
                email: students.email,
                phone: students.phone,
                address: students.address,
                specialized: students.specialized.name,
                objective: students.objective,
                gpa: students.gpa,
                skills: students.skills,
                resumeLink: students.resumeLink,
                transcriptLink: students.transcriptLink,
                role: role,
                modalDetail: !this.state.modalDetail,

                businessSurvey: businessSurvey,
                survey: survey,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
                isViewSurvey: 0,
            });
        }
    }

    handleSelectMonth = async (event, studentDetail) => {
        const { name, value } = event.target;
        const { months } = this.state;
        let listStudentTask = [];
        // console.log(value);
        if (value <= 0) {
            listStudentTask = await ApiServices.Get(`/supervisor/allTasksByStudentEmail?emailStudent=${studentDetail.email}`);
            // console.log(listStudentTask);
        } else {
            var date = months[value].split(" - ");
            // console.log(date[0]);
            // console.log(date[1]);
            var formatDateStart = date[0].split("/");
            let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
            // console.log(dateStart);
            var formatDateEnd = date[1].split("/");
            let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
            // console.log(dateEnd);
            listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
        }
        await this.setState({
            listStudentTask: listStudentTask,
            filterStudentTaskList: listStudentTask,
            isThisMonth: -1,
            stateNo: 0,
        })
    }

    handleSelectStateTask = async (event) => {
        let listStudentTask = this.state.listStudentTask;
        const { name, value } = event.target;
        let filterStudentTaskList = [];
        // console.log(value);
        if (value == 0) {
            filterStudentTaskList = listStudentTask;
        } else if (value == 1) {

        if(listStudentTask!=null) {
          for (let index = 0; index < listStudentTask.length; index++) {
            if (listStudentTask[index].status === "APPROVED") {
              console.log(listStudentTask[index].status === "APPROVED");
              filterStudentTaskList.push(listStudentTask[index]);

            }
          }
        }
        } else if (value == 2) {
          if(listStudentTask!=null) {
            for (let index = 0; index < listStudentTask.length; index++) {
                if (listStudentTask[index].status !== "APPROVED") {
                    filterStudentTaskList.push(listStudentTask[index]);

                }
            }
          }
        }
        // console.log(value);
        // console.log(filterStudentTaskList);
        // console.log(listStudentTask);
        await this.setState({
            filterStudentTaskList: filterStudentTaskList,
            stateNo: value,
        })
    }

    sortCodeInOrder = async (orderBy) => {
        if (orderBy === 1) {
            const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=1&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${this.state.rowsPerPage}`);
            this.setState({
                students: students.listData,
                codeSortOrder: 1,
                nameSortOrder: 0,
                currentPage: 0,
            });
        }
        if (orderBy === 2) {
            const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=2&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${this.state.rowsPerPage}`);
            this.setState({
                students: students.listData,
                codeSortOrder: 2,
                nameSortOrder: 0,
                currentPage: 0,
            });
        }
    }

    sortNameInOrder = async (orderBy) => {
        if (orderBy === 1) {
            const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=1&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${this.state.rowsPerPage}`);
            console.log(students);
            this.setState({
                students: students.listData,
                nameSortOrder: 1,
                codeSortOrder: 0,
                currentPage: 0,
            });
            // console.log(this.state.students.sort((a, b) => (a.student.name > b.student.name) ? 1 : -1));
        }
        if (orderBy === 2) {
            const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=2&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${this.state.rowsPerPage}`);
            this.setState({
                students: students.listData,
                nameSortOrder: 2,
                codeSortOrder: 0,
                currentPage: 0,
            });
        }
    }

    toggleDropdown = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    toggleModalTask = async (studentDetail) => {
        if (this.state.modalTask === false) {
            this.setState({
                loading: true,
            })
            let months = [];
            var date = new Date();
            let isThisMonth = -1;
            let listStudentTask = [];

            const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${studentDetail.email}`);
            var dateEnroll = ojtEnrollment.timeEnroll;
            if (dateEnroll !== null) {
                var splitDate = dateEnroll.split('-');
                let dd = parseInt(splitDate[2]);
                let mm = parseInt(splitDate[1]);
                // let mm31 = [1, 3, 5, 7, 8, 10, 12];
                let mm30 = [4, 6, 9, 11];
                let yyyy = parseInt(splitDate[0]);
                for (let index = 1; index < 5; index++) {
                    let timeStartShow = "";
                    if (mm + parseInt(index) > 13) {
                        if ((mm + parseInt(index) - 12 - 1) === 2 && (yyyy + 1) % 4 === 0 && dd > 29) {
                            timeStartShow = 29 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        } else if ((mm + parseInt(index) - 12 - 1) === 2 && (yyyy + 1) % 4 !== 0 && dd > 28) {
                            timeStartShow = 28 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        } else if (mm30.includes((mm + parseInt(index) - 12 - 1)) && dd > 30) {
                            timeStartShow = 30 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        } else {
                            timeStartShow = dd + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        }
                    } else {
                        if ((mm + parseInt(index) - 1) === 2 && yyyy % 4 === 0 && dd > 29) {
                            timeStartShow = 29 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        } else if ((mm + parseInt(index) - 1) === 2 && yyyy % 4 !== 0 && dd > 28) {
                            timeStartShow = 28 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        } else if (mm30.includes((mm + parseInt(index) - 1)) && dd > 30) {
                            timeStartShow = 30 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        } else {
                            timeStartShow = dd + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        }
                    }
                    let formatTimeStartShow = timeStartShow.split('/');
                    // console.log(formatTimeStartShow[1]);
                    // console.log(formatTimeStartShow[0]);
                    if (parseInt(formatTimeStartShow[1]) < 10) {
                        formatTimeStartShow[1] = "0" + formatTimeStartShow[1];
                    }
                    if (parseInt(formatTimeStartShow[0]) < 10) {
                        formatTimeStartShow[0] = "0" + formatTimeStartShow[0];
                    }
                    timeStartShow = formatTimeStartShow[0] + "/" + formatTimeStartShow[1] + "/" + formatTimeStartShow[2];
                    // console.log(timeStartShow);
                    let timeEndShow = "";
                    if (mm + parseInt(index) > 12) {
                        if ((mm + parseInt(index) - 12) === 2 && (yyyy + 1) % 4 === 0 && dd > 29) {
                            timeEndShow = 29 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        } else if ((mm + parseInt(index) - 12) === 2 && (yyyy + 1) % 4 !== 0 && dd > 28) {
                            timeEndShow = 28 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        } else if (mm30.includes((mm + parseInt(index) - 12)) && dd > 30) {
                            timeEndShow = 30 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        } else {
                            timeEndShow = dd + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        }
                    } else {
                        if ((mm + parseInt(index)) === 2 && yyyy % 4 === 0 && dd > 29) {
                            timeEndShow = 29 + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        } else if ((mm + parseInt(index)) === 2 && yyyy % 4 !== 0 && dd > 28) {
                            timeEndShow = 28 + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        } else if (mm30.includes((mm + parseInt(index))) && dd > 30) {
                            timeEndShow = 30 + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        } else {
                            timeEndShow = dd + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        }
                    }
                    let formatTimeEndShow = timeEndShow.split('/');
                    if (parseInt(formatTimeEndShow[1]) < 10) {
                        formatTimeEndShow[1] = "0" + formatTimeEndShow[1];
                    }
                    if (parseInt(formatTimeEndShow[0]) < 10) {
                        formatTimeEndShow[0] = "0" + formatTimeEndShow[0];
                    }
                    timeEndShow = formatTimeEndShow[0] + "/" + formatTimeEndShow[1] + "/" + formatTimeEndShow[2];
                    // console.log(timeEndShow);
                    var date1 = new Date();
                    var date2 = new Date();
                    var tmpdate = "";
                    var tmpdate1 = "";
                    date1.setFullYear(parseInt(formatTimeStartShow[2]), parseInt(formatTimeStartShow[1] - 1), parseInt(formatTimeStartShow[0]));
                    // tmpdate.setFullYear(parseInt(formatTimeStartShow[2]), parseInt(formatTimeStartShow[1] - 1), parseInt(formatTimeStartShow[0] - 1))
                    // console.log(formatTimeStartShow[1]);
                    tmpdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    tmpdate1 = parseInt(formatTimeStartShow[2]) + "-" + parseInt(formatTimeStartShow[1]) + "-" + parseInt(formatTimeStartShow[0]);
                    date2.setFullYear(parseInt(formatTimeEndShow[2]), parseInt(formatTimeEndShow[1] - 1), parseInt(formatTimeEndShow[0]));
                    if ((date > date1 || tmpdate === tmpdate1) && date < date2) {
                        isThisMonth = index - 1;
                    }
                    // console.log(date);
                    // console.log(date1);
                    // console.log(date2);
                    // console.log(date >= date1);
                    // console.log(date <= date2);
                    months.push(`${timeStartShow} - ${timeEndShow}`);
                }
                // console.log(date);
                // console.log(months);
                // console.log(isThisMonth);
                var date = months[isThisMonth].split(" - ");
                var formatDateStart = date[0].split("/");
                let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
                var formatDateEnd = date[1].split("/");
                let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
                listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
                // listStudentTask = await ApiServices.Get(`/supervisor/allTasksByStudentEmail?emailStudent=${studentDetail.email}`);
                months.unshift("Tổng");
            }
            this.setState({
                modalTask: !this.state.modalTask,
                studentDetail: studentDetail,
                listStudentTask: listStudentTask,
                filterStudentTaskList: listStudentTask,
                months: months,
                loading: false,
                isThisMonth: isThisMonth + 1,
                // isThisMonth: 0,
            });
        } else {
            this.setState({
                modalTask: !this.state.modalTask,
            })
        }
    }

    toggleModalFeedBack = async (studentFeedBack) => {
        if (this.state.modalFeedBack === false) {
            this.setState({
                loading: true,
            })

            const listFeedBack = await ApiServices.Get(`/admin/feedback?studentEmail=${studentFeedBack.email}`);

            if (listFeedBack != null) {
                this.setState({
                    modalFeedBack: !this.state.modalFeedBack,
                    loading: false,
                    studentFeedBack,
                    listFeedBack
                });
            }

        } else {
            this.setState({
                modalFeedBack: !this.state.modalFeedBack,
            })
        }
    }

    uploadTranscriptToFireBase = async () => {
        let { file } = this.state;

        const uploadTask = await storage.ref(`transcripts/${file.name}`).put(file);
        await storage.ref('transcripts').child(file.name).getDownloadURL().then(url => {
            this.setState({
                transcriptLink: url
            })
        })
    }

    saveTranscript = async () => {
        const { student, transcriptLink } = this.state;
        student.transcriptLink = transcriptLink;
        const result = await ApiServices.Put('/business/updateLinkTranscript', student);

        if (result.status === 200) {
            Toastify.actionSuccess('Cập nhật bảng điểm thành công');
            this.setState({
                loading: false,
                modalDetail: !this.state.modalDetail,
            })
        } else {
            Toastify.actionFail('Cập nhật bảng điểm thất bại');
            this.setState({
                loading: false
            })
        }
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            this.setState({
                file: file,
                isUploadTranscriptLink: true,
            })
        }
    }

    showTaskLevel(taskLevel) {
        if (taskLevel === 'DIFFICULT') {
            return (
                <Badge color="danger">Khó</Badge>
            )
        } else if (taskLevel === 'EASY') {
            return (
                <Badge color="primary">Dễ</Badge>
            )
        } else if (taskLevel === 'NORMAL') {
            return (
                <Badge color="warning">Trung bình</Badge>
            )
        }
    }

    showTaskState(taskStatus) {
        // console.log(taskStatus);
        if (taskStatus === 'APPROVED') {
            return (
                <i style={{ color: "#4dbd74" }} className="fa fa-check"></i>
            )
        } else {
            return (
                <i style={{ color: "#f86c6b" }} className="fa fa-close"></i>
            )
        }
    }

    checkChose(quesAns, ans) {
        // console.log(quesAns.includes(ans));
        // console.log(quesAns);
        // console.log(quesAns.length);
        // console.log(ans);
        let isChecked = false;
        for (let index = 0; index < quesAns.length; index++) {
            if (quesAns[index].id === ans.id) {
                isChecked = true;
            }
        }
        return isChecked;
    }

    formatDate(inputDate, flag) {
        var date = inputDate.split('-');
        let formattedDate = date[2] + "/" + date[1] + "/" + date[0];
        if (flag === true) {
            return (
                <Badge color="primary">{formattedDate}</Badge>
            )
        } else if (flag === false) {
            return (
                <Badge color="danger">{formattedDate}</Badge>
            )
        }
    }

    handleViewSurvey = async () => {
        this.setState({
            isViewSurvey: 1,
        })
    }

    handleBackSurvey = async () => {
        this.setState({
            isViewSurvey: 0,
        })
    }


    handleSubmit = async () => {
        this.setState({
            loading: true,
            isUploadTranscriptLink: false,
        })
        await this.uploadTranscriptToFireBase();
        await this.saveTranscript();
    }

    showTranscript(transcriptLink) {
        if (transcriptLink !== null) {
            return (
                <a href={transcriptLink} download>Tải về</a>
            )
        } else {
            return (
                <label>N/A</label>
            )
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        console.log(value);
        if (value === "" || !value.trim()) {
            // console.log(1);
            await this.setState({
                [name]: value.substr(0, 20),
                isSearchingAll: false,
            })
        } else {
            const students = await ApiServices.Get(`/student/searchListStudent?valueSearch=${value.substr(0, 20)}`);
            console.log(students);
            if (students !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingListAll: students,
                    isSearchingAll: true,
                })
            }
        }
    }

    handleInputTab2 = async (event) => {
        const { name, value } = event.target;
        console.log(value);
        if (value === "" || !value.trim()) {
            // console.log(1);
            await this.setState({
                [name]: value.substr(0, 20),
                isSearchingSuggest: false,
                isSearchingAll: false,
            })
        } else {
            // this.state.typeSelected
            const students = await ApiServices.Get(`/student/searchStudentWithHope?valueSearch=${value.substr(0, 20)}&type=${this.state.typeSelected}`);
            console.log(students);
            if (students !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingListSuggest: students,
                    isSearchingSuggest: true,
                    isSearchingAll: false,
                })
            }
        }
    }

    handleInputSelect = async (event) => {
        const { name, value } = event.target;
        let typeSelected = this.state.typeSelected;
        let students = null;
        // console.log(name);
        // console.log(value);
        if (value == 0) {
            typeSelected = 0;
            // students = await ApiServices.Get('/student/getAllStudent');
            const { rowsPerPageCbAll, currentPageCbAll } = this.state;
            const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${rowsPerPageCbAll}`);
            if (students !== null) {
                this.setState({
                    students: students.listData,
                    pageNumberCbAll: students.pageNumber,
                    currentPageCbAll: 0,
                    loading: false,
                    nameSortOrder: 0,
                    codeSortOrder: 0,
                });
            }

        } else if (value == 1) {
            typeSelected = 1;
            const { rowsPerPageSuggest } = this.state;
            const students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=0&rowsPerPage=${rowsPerPageSuggest}`);
            if (students !== null) {
                this.setState({
                    students: students.listData,
                    pageNumberSuggest: students.pageNumber,
                    loading: false,
                    nameSortOrder: 0,
                    codeSortOrder: 0,
                    currentPageSuggest: 0
                });
            }
            // students = await ApiServices.Get('/student/getStudentsWithNoCompany');
        }
        await this.setState({
            typeSelected: typeSelected,
            // students: students,
        })
        // console.log(this.state.typeSelected);
        // console.log(this.state.students);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (studentSelect, businessEmail, businessName) => {
        this.setState({
            modal: !this.state.modal,
            open: true
        });
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn đăng ký công ty ${businessName} cho sinh viên ${studentSelect.name}?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleYes(studentSelect, businessEmail, businessName)
                },
                {
                    label: 'Hủy bỏ',
                    onClick: () => this.toggleModal(studentSelect)
                }
            ]
        });
    };

    handleYes = async (studentSelect, businessEmail, businessName) => {

        var message = `Chúc mừng ${studentSelect.name}! Bạn đã được đăng ký thực tập tại ${businessName}!`;

        const notificationDTO = {
            data: {
                title: `Kết quả đăng kí thực tập tại doanh nghiệp ${businessName}`,
                body: message,
                click_action: "http://localhost:3000/#/hr/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: `${studentSelect.token}`
        }

        this.setState({
            loading: true
        })

        const result = await ApiServices.Put(`/admin/setBusinessForStudent?emailOfBusiness=${businessEmail}&emailOfStudent=${studentSelect.email}`);
        // console.log(result);

        if (result.status === 200) {
            Toastify.actionSuccess(`Đăng ký thành công!`);
            const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);

            const { currentPageSuggest, rowsPerPageSuggest } = this.state;
            const students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);
            if (students !== null) {
                this.setState({
                    students: students.listData,
                    pageNumberSuggest: students.pageNumber,
                    loading: false,
                    nameSortOrder: 0,
                    codeSortOrder: 0,
                    typeSelected: 1
                });
            }
            // const students = await ApiServices.Get('/student/getAllStudent');
            // this.setState({
            //     students: students,
            //     loading: false
            // })

        } else {
            Toastify.actionFail(`Đăng ký thất bại!`);
            this.setState({
                loading: false
            })
        }
    }

    handlePageNumberCbAll = async (currentPageCbAll) => {
        const { rowsPerPageCbAll } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPageCbAll}&rowsPerPage=${rowsPerPageCbAll}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumberCbAll: students.pageNumber,
                currentPageCbAll,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handlePagePreviousCbAll = async (currentPageCbAll) => {
        const { rowsPerPageCbAll } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPageCbAll}&rowsPerPage=${rowsPerPageCbAll}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumberCbAll: students.pageNumber,
                currentPageCbAll,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handlePageNextCbAll = async (currentPageCbAll) => {
        const { rowsPerPageCbAll } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPageCbAll}&rowsPerPage=${rowsPerPageCbAll}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumberCbAll: students.pageNumber,
                currentPageCbAll,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handleInputPagingCbAll = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPageCbAll } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${rowsPerPageCbAll}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumberCbAll: students.pageNumber,
                loading: false,
                currentPageCbAll: 0,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                currentPage,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                currentPage,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                currentPage,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handleInputPagingAll = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getAllStudent?codeSortOrder=${this.state.codeSortOrder}&nameSortOrder=${this.state.nameSortOrder}&specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${rowsPerPage}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                currentPage: 0,
                nameSortOrder: 0,
                codeSortOrder: 0,
            });
        }
    }

    handlePageNumberSuggest = async (currentPageSuggest) => {
        const { rowsPerPageSuggest } = this.state;
        const students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
                currentPageSuggest
            });
        }
    }

    handlePagePreviousSuggest = async (currentPageSuggest) => {
        const { rowsPerPageSuggest } = this.state;
        const students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
                currentPageSuggest
            });
        }
    }

    handlePageNextSuggest = async (currentPageSuggest) => {
        const { rowsPerPageSuggest } = this.state;
        const students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
                currentPageSuggest
            });
        }
    }

    handleInputPagingSuggest = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPageSuggest } = this.state;
        const students = await ApiServices.Get(`/student/getStudentsWithNoCompany?currentPage=0&rowsPerPage=${rowsPerPageSuggest}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                nameSortOrder: 0,
                codeSortOrder: 0,
                currentPageSuggest: 0
            });
        }
    }

    tabPane() {
        const { studentFeedBack, listFeedBack, codeSortOrder, nameSortOrder, student, businessSurvey, months, isThisMonth, isViewSurvey, survey, students, searchValue, loading, suggestedBusiness, otherBusiness, studentSelect, studentDetail, typesOfStudent } = this.state;
        const { pageNumber, currentPage, rowsPerPage, pageNumberSuggest, currentPageSuggest, rowsPerPageSuggest, pageNumberCbAll, currentPageCbAll, rowsPerPageCbAll } = this.state;
        const { filterStudentTaskList, stateNo, stateTask, dropdownSpecialized } = this.state;
        const { name, code, email, phone, address, specialized, objective, gpa, skills, resumeLink, transcriptLink, role, isUploadTranscriptLink } = this.state;
        const { numOfStudentAll, isSearchingAll, searchingListAll } = this.state;
        const { numOfStudentSuggest, isSearchingSuggest, searchingListSuggest } = this.state;
        const linkDownCV = `http://localhost:8000/api/file/downloadFile/${resumeLink}`;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <>
                        <TabPane tabId="1">
                            {
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
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>
                                                    &emsp;&nbsp;&nbsp;MSSV
                                                    &nbsp;
                                                    {codeSortOrder === 0 ?
                                                        <i onClick={() => this.sortCodeInOrder(1)} style={{ cursor: 'pointer' }} className="fa fa-sort"></i> :
                                                        (codeSortOrder === 1 ?
                                                            <i onClick={() => this.sortCodeInOrder(2)} style={{ cursor: 'pointer' }} className="fa fa-sort-desc"></i> :
                                                            <i onClick={() => this.sortCodeInOrder(1)} style={{ cursor: 'pointer' }} className="fa fa-sort-asc"></i>
                                                        )
                                                    }
                                                </th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>
                                                    &emsp;&nbsp;&nbsp;Họ và tên
                                                    &nbsp;
                                                    {nameSortOrder === 0 ?
                                                        <i onClick={() => this.sortNameInOrder(1)} style={{ cursor: 'pointer' }} className="fa fa-sort"></i> :
                                                        (nameSortOrder === 1 ?
                                                            <i onClick={() => this.sortNameInOrder(2)} style={{ cursor: 'pointer' }} className="fa fa-sort-desc"></i> :
                                                            <i onClick={() => this.sortNameInOrder(1)} style={{ cursor: 'pointer' }} className="fa fa-sort-asc"></i>
                                                        )
                                                    }
                                                </th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
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
                                                </th>
                                                <th style={{ textAlign: "left" }}></th>
                                                {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Bảng điểm</th> */}
                                                {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>GPA</th> */}
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isSearchingAll === false ?
                                                (students && students.map((student, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.email}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                            {/* <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.student.transcriptLink} download>tải</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td> */}
                                                            {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                            <td style={{ textAlign: "center" }}>
                                                                {/* <Button style={{ width: "80px" }} color="primary" onClick={() => this.handleDirect(`/student/${student.student.email}`)}><i className="fa fa-eye"></i></Button> */}
                                                                <Button color="primary" onClick={() => this.toggleModalDetail(student.student.email)}><i className="fa fa-eye"></i></Button>
                                                                &nbsp;&nbsp;
                                                            {/* <Button style={{ width: "90px" }} color="success" onClick={() => this.handleDirect(`/supervisor/hr-student-list/details/${student.student.email}`)}><i className="fa cui-task"></i></Button> */}
                                                                {/* {student.businessEnroll !== null ?
                                                                <Button color="success" onClick={() => this.toggleModalTask(student.student)}><i className="fa cui-task"></i></Button> :
                                                                <>&emsp;&emsp;&emsp;</>
                                                            } */}
                                                                <Button color="success" onClick={() => this.toggleModalTask(student.student)}><i className="fa cui-task"></i></Button>
                                                                {/* <Button style={{ width: "70px" }} color="danger">Xoá</Button> */}
                                                                &nbsp;&nbsp;
                                                            <Button color="warning" onClick={() => this.toggleModalFeedBack(student.student)}><i className="fa fa-mail-reply"></i></Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })) :
                                                (searchingListAll && searchingListAll.map((student, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.code}</td>
                                                            <td style={{ textAlign: "center" }}>{student.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.email}</td>
                                                            <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                            {/* <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.student.transcriptLink} download>tải</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td> */}
                                                            {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                            <td style={{ textAlign: "center" }}>
                                                                {/* <Button style={{ width: "80px" }} color="primary" onClick={() => this.handleDirect(`/student/${student.student.email}`)}><i className="fa fa-eye"></i></Button> */}
                                                                <Button color="primary" onClick={() => this.toggleModalDetail(student.email)}><i className="fa fa-eye"></i></Button>
                                                                &nbsp;&nbsp;
                                                            {/* <Button style={{ width: "90px" }} color="success" onClick={() => this.handleDirect(`/supervisor/hr-student-list/details/${student.student.email}`)}><i className="fa cui-task"></i></Button> */}
                                                                {/* {student.businessEnroll !== null ?
                                                                <Button color="success" onClick={() => this.toggleModalTask(student.student)}><i className="fa cui-task"></i></Button> :
                                                                <>&emsp;&emsp;&emsp;</>
                                                            } */}
                                                                <Button color="success" onClick={() => this.toggleModalTask(student)}><i className="fa cui-task"></i></Button>
                                                                {/* <Button style={{ width: "70px" }} color="danger">Xoá</Button> */}
                                                                &nbsp;&nbsp;
                                                            <Button color="warning" onClick={() => this.toggleModalFeedBack(student)}><i className="fa fa-mail-reply"></i></Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </Table>
                                    {students && students !== null ? (isSearchingAll === false ?
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Pagination>
                                                        <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                    </Pagination>
                                                    &emsp;
                                                        <h6 style={{ marginTop: "7px" }}>Số dòng trên trang: </h6>
                                                    &nbsp;&nbsp;
                                                        <Input onChange={this.handleInputPagingAll} type="select" name="rowsPerPage" style={{ width: "70px" }}>
                                                        <option value={10} selected={rowsPerPage === 10}>10</option>
                                                        <option value={20}>20</option>
                                                        <option value={50}>50</option>
                                                    </Input>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row className="float-right">
                                                    <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + students.length} trên tổng số {numOfStudentAll} kết quả</Label>
                                                </Row>
                                            </Col>
                                        </Row> : <></>) : <></>
                                    }
                                </div>
                            }
                        </TabPane>
                        <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail}
                            className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                            <ModalBody>
                                {/* <div style={{ maxHeight: "563px", overflowY: 'auto', overflowX: 'hidden' }}> */}
                                <div>
                                    {isViewSurvey === 0 ?
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Họ và tên</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{name}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>MSSV</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{code}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{email}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>SĐT</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{phone}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Chuyên ngành</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{specialized}</Label>
                                                </Col>
                                            </FormGroup>
                                            {/* <FormGroup row>
                                        <Col md="4">
                                            <h6>Học kỳ</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Label id="" name="">{}</Label>
                                        </Col>
                                    </FormGroup> */}
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Địa chỉ</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{address}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Giới thiệu bản thân</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{objective}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Kỹ năng chuyên ngành</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    {
                                                        skills && skills.map((skill, index) => {
                                                            return (
                                                                <div>
                                                                    {
                                                                        skill.name && skill.name && skill.softSkill.toString() === 'false' ? (
                                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                        ) : (
                                                                                <></>
                                                                            )
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Kỹ năng mềm</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    {
                                                        skills && skills.map((skill, index) => {
                                                            return (
                                                                <div>
                                                                    {
                                                                        skill.softSkill.toString() === 'true' ? (
                                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                        ) : (
                                                                                <></>
                                                                            )
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>CV</h6>
                                                </Col>
                                                {
                                                    resumeLink && resumeLink ?
                                                        (<Col xs="12" md="8">
                                                            <a target="_blank" href={linkDownCV} download>Tải về</a>
                                                        </Col>)
                                                        :
                                                        (
                                                            <Col xs="12" md="8">
                                                                <label>N/A</label>
                                                            </Col>)
                                                }
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>GPA</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label id="" name="">{gpa}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Bảng điểm</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    {
                                                        role && role === 'ROLE_HR' ?
                                                            (
                                                                this.showTranscript(transcriptLink)
                                                            ) :
                                                            (<input onChange={this.handleChange} type="file" />)
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="4">
                                                    <h6>Khảo sát ý kiến</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    {
                                                        survey === null ?
                                                            <></> :
                                                            <Button color="primary" onClick={() => this.handleViewSurvey()}><i className="fa fa-eye"></i></Button>
                                                    }
                                                </Col>
                                            </FormGroup>
                                        </Form> :
                                        <Form>
                                            <div style={{ maxHeight: '563px', overflowY: 'auto', width: "100%", overflowX: "hidden" }}>
                                                <div style={{ textAlign: "center" }}>
                                                    <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" width="96%" />
                                                    <br /><br /><br />
                                                    <h3 style={{ fontWeight: "bold" }}>PHIẾU KHẢO SÁT NƠI THỰC TẬP</h3>
                                                </div>
                                                <div>
                                                    {/* <FormGroup row>
                                                <h4 style={{ fontWeight: "bold" }}>&emsp;Thông tin cá nhân</h4>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>Họ tên sinh viên:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>Nguyễn Văn A</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>MSSV:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>SE60000</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>Ngành:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>IS</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>Nơi học tập:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>FPT University</Label>
                                                </Col>
                                            </FormGroup> */}
                                                    <FormGroup row>
                                                        <h4 style={{ fontWeight: "bold" }}>&emsp;&emsp;Thông tin nơi thực tập</h4>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="5">
                                                            <h6 style={{ fontWeight: "bold" }}>Tên công ty thực tập:</h6>
                                                        </Col>
                                                        <Col xs="12" md="7">
                                                            {businessSurvey === null ? <></> : <Label>{businessSurvey.business_name}</Label>}
                                                        </Col>
                                                    </FormGroup>
                                                    {/* <FormGroup row>
                                                    <Col md="5">
                                                        <h6 style={{ fontWeight: "bold" }}>Lĩnh vực hoạt động:</h6>
                                                    </Col>
                                                    <Col xs="12" md="7">
                                                        <Label>Ngân hàng</Label>
                                                    </Col>
                                                </FormGroup> */}
                                                    <FormGroup row>
                                                        <Col md="5">
                                                            <h6 style={{ fontWeight: "bold" }}>Địa chỉ:</h6>
                                                        </Col>
                                                        <Col xs="12" md="7">
                                                            {businessSurvey === null ? <></> : <Label>{businessSurvey.business_address}</Label>}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="5">
                                                            <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                        </Col>
                                                        <Col xs="12" md="7">
                                                            {businessSurvey === null ? <></> : <Label>{businessSurvey.business_phone}</Label>}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="5">
                                                            <h6 style={{ fontWeight: "bold" }}>Tên người hướng dẫn:</h6>
                                                        </Col>
                                                        <Col xs="12" md="7">student
                                                        {student === null ? <></> : (student.supervisor === null ? <></> : <Label>{student.supervisor.name}</Label>)}
                                                        </Col>
                                                    </FormGroup>
                                                    {/* <FormGroup>
                                                <Col md="4">
                                                    <h6 style={{ fontWeight: "bold" }}>Chức vụ:</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label>Trưởng phòng thực tập</Label>
                                                </Col>
                                            </FormGroup> */}
                                                </div>
                                                <hr />
                                                <div style={{ paddingTop: "10px", paddingLeft: "5%", paddingRight: "5%" }}>
                                                    {survey && survey.map((ques, index) => {
                                                        return (
                                                            <>
                                                                <FormGroup>
                                                                    <row>
                                                                        &emsp;<u><b>Câu {index + 1}</b></u>: {ques.question.content}
                                                                    </row>
                                                                    <row>
                                                                        <ListGroup>
                                                                            {ques.question.answers && ques.question.answers.map((answer, index1) => {
                                                                                return (
                                                                                    <ListGroupItem tag="button" action active={this.checkChose(ques.answers, answer)} disabled>
                                                                                        <FormGroup check className="radio">
                                                                                            <Input className="form-check-input" type="radio" id={answer.id} name={ques.question.id} value={answer.content} checked={this.checkChose(ques.answers, answer)} readOnly />
                                                                                            <Label check className="form-check-label" htmlFor="radio1">{answer.content}</Label>
                                                                                        </FormGroup>
                                                                                    </ListGroupItem>
                                                                                )
                                                                            })}
                                                                        </ListGroup>
                                                                    </row>
                                                                </FormGroup>
                                                                {index === survey.length ? <></> : <hr />}
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </Form>
                                    }
                                </div>
                            </ModalBody>
                            {isUploadTranscriptLink === true ?
                                <ModalFooter>
                                    {role && role === 'ROLE_ADMIN' ?
                                        (
                                            <Button onClick={() => this.handleSubmit()} type="submit" color="primary">Xác nhận</Button>
                                        ) :
                                        (<></>)
                                    }
                                </ModalFooter> :
                                <></>
                            }
                            {
                                isViewSurvey === 1 ?
                                    <ModalFooter>
                                        <Button onClick={() => this.handleBackSurvey()} color="secondary"><i className="fa fa-arrow-left"></i></Button>
                                    </ModalFooter> :
                                    <></>
                            }
                        </Modal>
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modalTask} toggle={this.toggleModalTask}
                                className={'modal-lg ' + this.props.className}>
                                <ModalHeader style={{ backgroundColor: "#4DBD74", color: "white" }} toggle={this.toggleModalTask}>Nhiệm vụ của sinh viên</ModalHeader>
                                <ModalBody>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Người hướng dẫn</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Label>{studentDetail.supervisor === null ? <></> : (studentDetail.supervisor.name)}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Sinh viên</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <label>{studentDetail.name}</label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row style={{ paddingLeft: '38%' }}>
                                        <Input onChange={e => { this.handleSelectMonth(e, studentDetail) }} type="select" name="months" style={{ width: '250px' }}>
                                            {months && months.map((month, i) => {
                                                return (
                                                    <option value={i} selected={i === isThisMonth}>{month}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                    <hr />
                                    <FormGroup row style={{ paddingLeft: '70%' }}>
                                        Trạng thái: &nbsp;&nbsp;
                                        <Input onChange={e => { this.handleSelectStateTask(e) }} type="select" name="stateTask" style={{ width: '150px' }} size="sm">
                                            {stateTask && stateTask.map((state, i) => {
                                                return (
                                                    <option value={i} selected={i == stateNo}>{state}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                    <div style={{ maxHeight: '492px', overflowY: 'auto' }}>
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nhiệm vụ</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Người giao</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Độ khó</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ngày tạo</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Hạn cuối</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Hoàn thành</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filterStudentTaskList && filterStudentTaskList.map((task, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{task.title}</td>
                                                                <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        this.showTaskLevel(task.level_task)
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>{this.formatDate(task.time_created, true)}</td>
                                                                <td style={{ textAlign: "center" }}>{this.formatDate(task.time_end, false)}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        this.showTaskState(task.status)
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </ModalBody>
                                {/* <ModalFooter>
                                </ModalFooter> */}
                            </Modal> :
                            <></>
                        }
                        {studentFeedBack !== null ?
                            <Modal isOpen={this.state.modalFeedBack} toggle={this.toggleModalFeedBack}
                                className={'modal-lg ' + this.props.className}>
                                <ModalHeader style={{ backgroundColor: "#ffc107", color: "black" }} toggle={this.toggleModalFeedBack}>Danh sách feedback của sinh viên {studentFeedBack.name}</ModalHeader>
                                <ModalBody>
                                    {
                                        listFeedBack && listFeedBack.map((feedback, index) => {
                                            return (
                                                <FormGroup row>
                                                    <Col xs="12" md="12">
                                                        <Label>{index + 1}/ {feedback.content}</Label>
                                                    </Col>
                                                </FormGroup>
                                            )
                                        })
                                    }
                                </ModalBody>
                            </Modal> :
                            <></>
                        }
                        <TabPane tabId="2">
                            {
                                <div>
                                    <nav className="navbar navbar-light bg-light justify-content-between">
                                        <form className="form-inline">
                                            <input onChange={this.handleInputTab2} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </form>
                                        <div style={{ marginRight: "4px" }}>
                                            <Input style={{ width: '100px' }} onChange={e => { this.handleInputSelect(e) }} type="select" name="typeStudent">
                                                {typesOfStudent && typesOfStudent.map((typeStudent, i) => {
                                                    return (
                                                        <option value={i} selected={i === this.state.typeSelected}>{typeStudent}</option>
                                                    )
                                                })}
                                            </Input>
                                        </div>
                                    </nav>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>MSSV</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Họ và tên</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Chuyên ngành</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nguyện vọng 1</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nguyện vọng 2</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isSearchingSuggest === false ?
                                                (students && students.map((student, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}>{currentPageCbAll * rowsPerPageCbAll + index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.email}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.option1 === null ? 'N/A' : student.student.option1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.option2 === null ? 'N/A' : student.student.option2}</td>
                                                            <td style={{ textAlign: "center" }}>{student.businessEnroll === null ? 'N/A' : student.businessEnroll}</td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {
                                                                    student.businessEnroll === null ?
                                                                        <Button onClick={() => this.toggleModal(student.student)} color="primary">Đăng ký</Button> :
                                                                        (student.businessEnroll === "Rớt" ?
                                                                            <Button onClick={() => this.toggleModal(student.student)} color="primary">Đăng ký</Button> :
                                                                            <></>
                                                                        )
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })) :
                                                (searchingListSuggest && searchingListSuggest.map((student, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.email}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.option1 === null ? 'N/A' : student.student.option1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.student.option2 === null ? 'N/A' : student.student.option2}</td>
                                                            <td style={{ textAlign: "center" }}>{student.businessEnroll === null ? 'N/A' : student.businessEnroll}</td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {
                                                                    student.businessEnroll === null ?
                                                                        <Button onClick={() => this.toggleModal(student.student)} color="primary">Đăng ký</Button> :
                                                                        (student.businessEnroll === "Rớt" ?
                                                                            <Button onClick={() => this.toggleModal(student.student)} color="primary">Đăng ký</Button> :
                                                                            <></>
                                                                        )
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                            }
                                        </tbody>
                                    </Table>
                                    {
                                        (this.state.typeSelected) === 0 ? (
                                            isSearchingSuggest === false ?
                                                (students && students !== null ?
                                                    <Row>
                                                        <Col>
                                                            <Row>
                                                                {}
                                                                <Pagination>
                                                                    <PaginationComponent pageNumber={pageNumberCbAll} handlePageNumber={this.handlePageNumberCbAll} handlePageNext={this.handlePageNextCbAll} handlePagePrevious={this.handlePagePreviousCbAll} currentPage={currentPageCbAll} />
                                                                </Pagination>
                                                                &emsp;
                                                            <h6 style={{ marginTop: "7px" }}>Số dòng trên trang: </h6>
                                                                &nbsp;&nbsp;
                                                            <Input onChange={this.handleInputPagingCbAll} type="select" name="rowsPerPageCbAll" style={{ width: "70px" }}>
                                                                    <option value={10} selected={rowsPerPageCbAll === 10}>10</option>
                                                                    <option value={20}>20</option>
                                                                    <option value={50}>50</option>
                                                                </Input>
                                                            </Row>
                                                        </Col>
                                                        <Col>
                                                            <Row className="float-right">
                                                                <Label>Bạn đang xem kết quả từ {currentPageCbAll * rowsPerPageCbAll + 1} - {currentPageCbAll * rowsPerPageCbAll + students.length} trên tổng số {numOfStudentAll} kết quả</Label>
                                                            </Row>
                                                        </Col>
                                                    </Row> : <></>) : <></>
                                        ) : (
                                                isSearchingSuggest === false ?
                                                    (students && students !== null ?
                                                        <Row>
                                                            <Col>
                                                                <Row>
                                                                    <Pagination>
                                                                        <PaginationComponent pageNumber={pageNumberSuggest} handlePageNumber={this.handlePageNumberSuggest} handlePageNext={this.handlePageNextSuggest} handlePagePrevious={this.handlePagePreviousSuggest} currentPage={currentPageSuggest} />
                                                                    </Pagination>
                                                                    &emsp;
                                                                <h6 style={{ marginTop: "7px" }}>Số dòng trên trang: </h6>
                                                                    &nbsp;&nbsp;
                                                                <Input onChange={this.handleInputPagingSuggest} type="select" name="rowsPerPageSuggest" style={{ width: "70px" }}>
                                                                        <option value={10} selected={rowsPerPageSuggest === 10}>10</option>
                                                                        <option value={20}>20</option>
                                                                        <option value={50}>50</option>
                                                                    </Input>
                                                                </Row>
                                                            </Col>
                                                            <Col>
                                                                <Row className="float-right">
                                                                    <Label>Bạn đang xem kết quả từ {currentPageSuggest * rowsPerPageSuggest + 1} - {currentPageSuggest * rowsPerPageSuggest + students.length} trên tổng số {numOfStudentSuggest} kết quả</Label>
                                                                </Row>
                                                            </Col>
                                                        </Row> : <></>) : <></>
                                            )
                                    }

                                </div>
                            }
                        </TabPane>
                        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModal}>Đăng ký công ty thực tập</ModalHeader>
                            <ModalBody>
                                <h6 style={{ fontWeight: 'bold' }}>Công ty được đề cử(Theo thứ tự):</h6>
                                <hr />
                                {suggestedBusiness && suggestedBusiness.map((business, index) =>
                                    <FormGroup row>
                                        <Col md="10">
                                            <h6>{index + 1}. {business.business_eng_name}</h6>
                                        </Col>
                                        <Col xs="12" md="2">
                                            <Button color="primary" onClick={() => this.handleConfirm(studentSelect, business.email, business.business_eng_name)}>Chọn</Button>
                                        </Col>
                                    </FormGroup>
                                )}
                                <br />
                                <h6 style={{ fontWeight: 'bold' }}>Các công ty khác có tuyển cùng chuyên ngành:</h6>
                                <hr />
                                {otherBusiness && otherBusiness.map((business, index) =>
                                    <FormGroup row>
                                        <Col md="10">
                                            <h6>{business.business_eng_name}</h6>
                                        </Col>
                                        <Col xs="12" md="2">
                                            <Button color="primary" onClick={() => this.handleConfirm(studentSelect, business.email, business.business_eng_name)}>Chọn</Button>
                                        </Col>
                                    </FormGroup>
                                )}
                            </ModalBody>
                            {/* <ModalFooter>
                                <Button color="primary" onClick={this.toggleModal}>Do Something</Button>{' '}
                                <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            </ModalFooter> */}
                        </Modal>
                    </>
                )
        );
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Danh sách sinh viên
                            </CardHeader>
                            <CardBody>
                                <Nav tabs style={{ fontWeight: "bold" }}>
                                    <NavItem>
                                        <NavLink
                                            active={this.state.activeTab[0] === '1'}
                                            onClick={() => { this.toggle(0, '1'); }}
                                        >
                                            Tổng
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            active={this.state.activeTab[0] === '2'}
                                            onClick={() => { this.toggle(0, '2'); }}
                                        >
                                            Nguyện vọng
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab[0]}>
                                    {this.tabPane()}
                                </TabContent>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                            {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr/invitation")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter> */}
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default student_list;
