import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Modal, ModalHeader, ModalFooter, ModalBody, Table, FormText, Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';

class Create_Report extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            reportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black', 'black'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', 'N/A'],
            onScore: 4,
            title: '',
            timeStart: '',
            timeEnd: '',
            remark: '',
            score_discipline: '0',
            score_work: '0',
            score_activity: '0',
            project_name: '',
            workDays: 0,
            titleHeader: '',
            titleReport: '',

            emailStudent: '',

            student: null,
            businessName: '',

            timeStartShow: '',
            timeEndShow: '',

            validatorNumRange_score_work: '',
            validatorNumRange_score_activity: '',
            validatorNumRange_score_discipline: '',
            maxWorkDays: 0,
            validatorMaxWorkDays: '',
            listStudentTask: null,
            filterStudentTaskList: null,
            numTaskEasy: 0,
            numTaskNormal: 0,
            numTaskDificult: 0,
            numTaskEasyFinish: 0,
            numTaskNormalFinish: 0,
            numTaskDificultFinish: 0,

            modalTask: false,
            months: null,
            isThisMonth: -1,

            stateTask: ["Tổng", "Hoàn thành", "Chưa hoàn thành"],
            stateNo: 0,
            role:'',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let role = '';
        let actor = null;
        let businessName = '';
        let listStudentTask = [];
        let score_work = "";
        let numTaskEasy = 0;
        let numTaskNormal = 0;
        let numTaskDificult = 0;
        let numTaskEasyFinish = 0;
        let numTaskNormalFinish = 0;
        let numTaskDificultFinish = 0;
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        if (role === 'ROLE_SUPERVISOR') {
            actor = await ApiServices.Get(`/supervisor`);
            businessName = actor.business.business_name;
        } else if (role === 'ROLE_HR') {
            actor = await ApiServices.Get(`/business/getBusiness`);
            businessName = actor.business_name;
        }
        var param = window.location.href.split("/").pop();
        var needParam = param.split('~');
        let title = '';
        let titleHeader = '';
        let titleReport = '';
        let emailStudent = '';
        title = "EVALUATION" + needParam[0];
        titleHeader = "Đánh giá tháng #" + needParam[0];
        titleReport = "Bảng đánh giá thực tập tháng " + needParam[0];
        emailStudent = needParam[1];
        const student = await ApiServices.Get(`/student/student/${needParam[1]}`);
        const numOfEvaluations = await ApiServices.Get(`/supervisor/getNumOfEvaluationsOfStudent?stuEmail=${needParam[1]}`);
        if (needParam[0] > (numOfEvaluations + 1)) {
            if (role === 'ROLE_SUPERVISOR') {
                this.props.history.push("/supervisor/report");
            }
            if (role === 'ROLE_HR') {
                this.props.history.push("/hr/report");
            }
        }
        const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${needParam[1]}`);
        var dateEnroll = ojtEnrollment.timeEnroll;
        var splitDate = dateEnroll.split('-');
        let dd = parseInt(splitDate[2]);
        let mm = parseInt(splitDate[1]);
        let mm31 = [1, 3, 5, 7, 8, 10, 12];
        let mm30 = [4, 6, 9, 11];
        let yyyy = parseInt(splitDate[0]);
        let timeStartShow = "";
        if (mm + parseInt(needParam[0]) > 13) {
            if ((mm + parseInt(needParam[0]) - 12 - 1) === 2 && (yyyy + 1) % 4 === 0 && dd > 29) {
                timeStartShow = 29 + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            } else if ((mm + parseInt(needParam[0]) - 12 - 1) === 2 && (yyyy + 1) % 4 !== 0 && dd > 28) {
                timeStartShow = 28 + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            } else if (mm30.includes((mm + parseInt(needParam[0]) - 12 - 1)) && dd > 30) {
                timeStartShow = 30 + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            } else {
                timeStartShow = dd + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            }
        } else {
            if ((mm + parseInt(needParam[0]) - 1) === 2 && yyyy % 4 === 0 && dd > 29) {
                timeStartShow = 29 + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            } else if ((mm + parseInt(needParam[0]) - 1) === 2 && yyyy % 4 !== 0 && dd > 28) {
                timeStartShow = 28 + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            } else if (mm30.includes((mm + parseInt(needParam[0]) - 1)) && dd > 30) {
                timeStartShow = 30 + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            } else {
                timeStartShow = dd + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
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
        let timeEndShow = "";
        if (mm + parseInt(needParam[0]) > 12) {
            if ((mm + parseInt(needParam[0]) - 12) === 2 && (yyyy + 1) % 4 === 0 && dd > 29) {
                timeEndShow = 29 + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            } else if ((mm + parseInt(needParam[0]) - 12) === 2 && (yyyy + 1) % 4 !== 0 && dd > 28) {
                timeEndShow = 28 + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            } else if (mm30.includes((mm + parseInt(needParam[0]) - 12)) && dd > 30) {
                timeEndShow = 30 + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            } else {
                timeEndShow = dd + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            }
        } else {
            if ((mm + parseInt(needParam[0])) === 2 && yyyy % 4 === 0 && dd > 29) {
                timeEndShow = 29 + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            } else if ((mm + parseInt(needParam[0])) === 2 && yyyy % 4 !== 0 && dd > 28) {
                timeEndShow = 28 + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            } else if (mm30.includes((mm + parseInt(needParam[0]))) && dd > 30) {
                timeEndShow = 30 + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            } else {
                timeEndShow = dd + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
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
        let maxWorkDays = 0;
        if (mm30.includes(parseInt(formatTimeStartShow[1]))) {
            maxWorkDays = 30 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
        } else if (mm31.includes(parseInt(formatTimeStartShow[1]))) {
            maxWorkDays = 31 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
        } else if (parseInt(formatTimeStartShow[1]) === 2) {
            if (parseInt(formatTimeStartShow[2]) % 4 === 0) {
                maxWorkDays = 29 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
            } else {
                maxWorkDays = 28 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
            }
        }
        var formatDateStart = timeStartShow.split("/");
        let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
        var formatDateEnd = timeEndShow.split("/");
        let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
        //suggest score work
        let numApproved = 0;
        let numRealTask = 0;
        listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${needParam[1]}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
        for (let index = 0; index < listStudentTask.length; index++) {
            if (listStudentTask[index].level_task === "EASY") {
                numRealTask = numRealTask + 1;
                numTaskEasy++;
            } else if (listStudentTask[index].level_task === "NORMAL") {
                numRealTask = numRealTask + 2;
                numTaskNormal++;
            } else if (listStudentTask[index].level_task === "DIFFICULT") {
                numRealTask = numRealTask + 3;
                numTaskDificult++;
            }
            if (listStudentTask[index].status === "APPROVED") {
                if (listStudentTask[index].level_task === "EASY") {
                    numApproved = numApproved + 1;
                    numTaskEasyFinish++;
                } else if (listStudentTask[index].level_task === "NORMAL") {
                    numApproved = numApproved + 2;
                    numTaskNormalFinish++;
                } else if (listStudentTask[index].level_task === "DIFFICULT") {
                    numApproved = numApproved + 3;
                    numTaskDificultFinish++;
                }
            }
        }
        score_work = "" + parseFloat(10 - ((10 / numRealTask) * (numRealTask - numApproved))).toFixed(1);
        if (!(parseFloat(score_work).toFixed(1) > 0 && parseFloat(score_work).toFixed(1) <= 10)) {
            score_work = "0";
        }
        // console.log(score_work);
        this.setState({
            loading: false,
            title: title,
            emailStudent: emailStudent,
            student: student,
            businessName: businessName,
            //dd-MM-yyyy
            timeStartShow: timeStartShow,
            //dd-MM-yyyy
            timeEndShow: timeEndShow,
            maxWorkDays: maxWorkDays,
            titleHeader: titleHeader,
            titleReport: titleReport,
            listStudentTask: listStudentTask,
            filterStudentTaskList: listStudentTask,
            score_work: score_work,
            numTaskEasy: numTaskEasy,
            numTaskNormal: numTaskNormal,
            numTaskDificult: numTaskDificult,
            numTaskEasyFinish: numTaskEasyFinish,
            numTaskNormalFinish: numTaskNormalFinish,
            numTaskDificultFinish: numTaskDificultFinish,

            isThisMonth: needParam[0],
            stateNo: 0,
            role: role,
        });
        console.log(this.state.isThisMonth);
    }

    handleSelectMonth = async (event) => {
        let emailStudent = this.state.emailStudent;
        const { name, value } = event.target;
        const { months } = this.state;
        let listStudentTask = [];
        // console.log(value);
        if (value <= 0) {
            listStudentTask = await ApiServices.Get(`/supervisor/allTasksByStudentEmail?emailStudent=${emailStudent}`);
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
            listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${emailStudent}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
        }
        // console.log(listStudentTask);
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
            for (let index = 0; index < listStudentTask.length; index++) {
                if (listStudentTask[index].status === "APPROVED") {
                    console.log(listStudentTask[index].status === "APPROVED");
                    filterStudentTaskList.push(listStudentTask[index]);
                }
            }
        } else if (value == 2) {
            for (let index = 0; index < listStudentTask.length; index++) {
                if (listStudentTask[index].status !== "APPROVED") {
                    filterStudentTaskList.push(listStudentTask[index]);
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

    toggleModalTask = async () => {
        let emailStudent = this.state.emailStudent;
        if (this.state.modalTask === false) {
            this.setState({
                loading: true,
            })
            let months = [];
            let listStudentTask = [];

            const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${emailStudent}`);
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
                    months.push(`${timeStartShow} - ${timeEndShow}`);
                }
                months.unshift("Tổng");
                var date = months[this.state.isThisMonth].split(" - ");
                console.log(this.state.isThisMonth);
                console.log(months[this.state.isThisMonth]);
                var formatDateStart = date[0].split("/");
                let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
                var formatDateEnd = date[1].split("/");
                let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
                listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${emailStudent}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
            }
            this.setState({
                modalTask: !this.state.modalTask,
                listStudentTask: listStudentTask,
                filterStudentTaskList: listStudentTask,
                months: months,
                loading: false,
                stateNo: 0,
            });
        } else {
            this.setState({
                modalTask: !this.state.modalTask,
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

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleInputScore = async (event) => {
        const { name, value } = event.target;
        let validatorNumRange_score_work = '';
        let validatorNumRange_score_activity = '';
        let validatorNumRange_score_discipline = '';
        let validatorMaxWorkDays = '';
        // if ((parseFloat(score_work) >= 0 && parseFloat(score_work) <= 10) ||
        //         (parseFloat(score_activity) >= 0 && parseFloat(score_activity) <= 10) ||
        //         (parseFloat(score_discipline) >= 0 && parseFloat(score_discipline) <= 10)) {
        //         if (parseFloat(score_work) >= 0 && parseFloat(score_work) <= 10) {
        //             validatorNumRange_score_work = '';
        //         }
        //         if (parseFloat(score_activity) >= 0 && parseFloat(score_activity) <= 10) {
        //             validatorNumRange_score_activity = '';
        //         }
        //         if (parseFloat(score_discipline) >= 0 && parseFloat(score_discipline) <= 10) {
        //             validatorNumRange_score_discipline = '';
        //         }
        // }
        let score_discipline = this.state.score_discipline;
        if (event.target.name === "score_discipline") {
            score_discipline = value;
        }
        // console.log("score_discipline " + score_discipline);
        let score_work = this.state.score_work;
        if (event.target.name === "score_work") {
            score_work = value;
        }
        // console.log("score_discipline " + score_work);
        let score_activity = this.state.score_activity;
        if (event.target.name === "score_activity") {
            score_activity = value;
        }
        // console.log("score_discipline " + score_activity);
        let onScore = this.state.onScore;
        if (score_discipline === "" || score_work === "" || score_activity === "") {
            onScore = 5;
        } else {
            let tmpScore = parseFloat((parseFloat(score_discipline) * 0.4 + parseFloat(score_work) * 0.5 + parseFloat(score_activity) * 0.1));
            // console.log("score_discipline " + tmpScore);
            if (tmpScore > 9) {
                onScore = 0;
            } else if (tmpScore > 8) {
                onScore = 1;
            } else if (tmpScore > 7) {
                onScore = 2;
            } else if (tmpScore >= 5) {
                onScore = 3;
            } else if (tmpScore < 5) {
                onScore = 4;
            } else {
                onScore = 5;
            }
        }
        await this.setState({
            [name]: value,
            onScore: onScore,
            validatorNumRange_score_work: validatorNumRange_score_work,
            validatorNumRange_score_activity: validatorNumRange_score_activity,
            validatorNumRange_score_discipline: validatorNumRange_score_discipline,
            validatorMaxWorkDays: validatorMaxWorkDays,
        })
        // console.log(this.state.onScore);
        // console.log("score_discipline " + score_discipline);
        // console.log("score_discipline " + score_work);
        // console.log("score_discipline " + score_activity);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSubmit = async () => {
        const { title, remark, score_discipline, score_work, score_activity, project_name, workDays, maxWorkDays } = this.state;

        let timeStart = "";
        let timeStartShow = this.state.timeStartShow;
        var formatTimeStart = timeStartShow.split('/');
        //yyyy-MM-dd
        timeStart = formatTimeStart[2] + "-" + formatTimeStart[1] + "-" + formatTimeStart[0];

        let timeEnd = "";
        let timeEndShow = this.state.timeEndShow;
        var formatTimeEnd = timeEndShow.split('/');
        //yyyy-MM-dd
        timeEnd = formatTimeEnd[2] + "-" + formatTimeEnd[1] + "-" + formatTimeEnd[0];
        let validatorNumRange_score_work = '';
        let validatorNumRange_score_activity = '';
        let validatorNumRange_score_discipline = '';
        let validatorMaxWorkDays = '';
        if (this.validator.allValid()) {
            if ((parseFloat(score_work) < 0 || parseFloat(score_work) > 10) ||
                (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) ||
                (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10) ||
                workDays > maxWorkDays) {
                if (parseFloat(score_work) < 0 || parseFloat(score_work) > 10) {
                    validatorNumRange_score_work = 'Điểm hiệu quả công việc không hợp lệ.( >= 0 & <=10 )';
                }
                if (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) {
                    validatorNumRange_score_activity = 'Điểm thái độ làm việc không hợp lệ.( >= 0 & <=10 )';
                }
                if (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10) {
                    validatorNumRange_score_discipline = 'Điểm kỷ luật không hợp lệ. ( >= 0 & <=10 )';
                }

                if (workDays > maxWorkDays) {
                    validatorMaxWorkDays = 'Số ngày làm việc không thể vượt qua số ngày thực tế trong tháng.';
                }

                this.setState({
                    validatorNumRange_score_work: validatorNumRange_score_work,
                    validatorNumRange_score_activity: validatorNumRange_score_activity,
                    validatorNumRange_score_discipline: validatorNumRange_score_discipline,
                    validatorMaxWorkDays: validatorMaxWorkDays,
                })
            } else {
                this.setState({
                    loading: true
                })
                const emailStudent = this.state.emailStudent;
                const evaluation = {
                    title,
                    timeStart,
                    timeEnd,
                    remark,
                    score_discipline,
                    score_work,
                    score_activity,
                    project_name,
                    workDays,
                }
                const result = await ApiServices.Post(`/supervisor/evaluation?emailStudent=${emailStudent}`, evaluation);
                console.log(result);
                console.log(emailStudent);
                console.log(evaluation);
                if (result.status === 201) {
                    Toastify.actionSuccess("Tạo đánh giá tháng thành công!");
                    const notificationDTO = {
                        data: {
                            title: this.state.titleHeader,
                            body: 'Bạn đã có ' + this.state.titleHeader,
                            click_action: "http://localhost:3000/#/hr/invitation/new",
                            icon: "http://url-to-an-icon/icon.png"
                        },
                        to: `${this.state.student.token}`
                    }

                    const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
                    setTimeout(
                        function () {
                            if (this.state.role === "ROLE_SUPERVISOR") {
                                this.props.history.push("/supervisor/report");
                            }
                            if (this.state.role === "ROLE_HR") {
                                this.props.history.push("/hr/report");
                            }
                        }
                            .bind(this),
                        2000
                    );
                } else {
                    Toastify.actionFail("Tạo đánh giá tháng thất bại!");
                    this.setState({
                        loading: false
                    })
                }
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { filterStudentTaskList, stateNo, stateTask, isThisMonth, months, numTaskEasy, numTaskNormal, numTaskDificult, numTaskEasyFinish, numTaskNormalFinish, numTaskDificultFinish, listStudentTask, titleReport, titleHeader, maxWorkDays, validatorMaxWorkDays, validatorNumRange_score_work, validatorNumRange_score_activity, validatorNumRange_score_discipline, loading, reportColor, rate, title, student, businessName, score_work, score_activity, score_discipline, workDays, remark, project_name, onScore, timeStartShow, timeEndShow } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>{titleHeader}
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{ paddingLeft: "3%", paddingRight: "3%", textAlign: "center" }}>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" />
                                            <br /><br /><br />
                                            <h2 style={{ fontWeight: "bold" }}>{titleReport}</h2>
                                        </div>
                                        <hr />
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Doanh nghiệp:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{businessName}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Sinh viên:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{student === null ? "" : student.name}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>MSSV:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{student === null ? "" : student.code}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày bắt đầu:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Badge className="mr-1" color="primary" pill style={{ fontSize: "16px" }}>{timeStartShow === null ? "" : timeStartShow}</Badge>
                                            </Col>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày kết thúc:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Badge className="mr-1" color="danger" pill style={{ fontSize: "16px" }}>{timeEndShow === null ? "" : timeEndShow}</Badge>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Tên dự án</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={project_name} type="text" onKeyPress={this.handleKeyPress} onChange={this.handleInput} id="project_name" name="project_name"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Tên dự án', project_name, 'required|max:50|alpha_num_space')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm kỷ luật:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={score_discipline} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_discipline" name="score_discipline" min="0" max="10"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm kỷ luật', score_discipline, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_discipline}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm hiệu quả công việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Row>
                                                    &emsp;<Input value={score_work} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_work" name="score_work" min="0" max="10"></Input>
                                                    &nbsp;&nbsp;<Button color="success" onClick={() => this.toggleModalTask()}><i className="fa cui-task"></i></Button>
                                                </Row>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm hiệu quả công việc', score_work, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_work}
                                                </span>
                                                <FormText className="help-block">Tổng số nhiệm vụ: {listStudentTask.length} - Số nhiệm vụ hoàn thành: Dễ({numTaskEasyFinish}/{numTaskEasy}), Trung bình({numTaskNormalFinish}/{numTaskNormal}), Khó({numTaskDificultFinish}/{numTaskDificult})</FormText>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm thái độ làm việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={score_activity} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_activity" name="score_activity" min="0" max="10"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm thái độ làm việc', score_activity, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_activity}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Xếp loại:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold', color: reportColor[onScore] }}>{rate[onScore]}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Số ngày làm việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={workDays} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="workDays" name="workDays" min="0" max={maxWorkDays}></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Số ngày làm việc', workDays, 'required|integer')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorMaxWorkDays}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Nhận xét:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={remark} type="textarea" rows="9" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="remark" name="remark" />
                                            </Col>
                                        </FormGroup>
                                        {student !== null ?
                                            <Modal isOpen={this.state.modalTask} toggle={this.toggleModalTask}
                                                className={'modal-lg ' + this.props.className}>
                                                <ModalHeader style={{ backgroundColor: "#4DBD74", color: "white" }} toggle={this.toggleModalTask}>Nhiệm vụ của sinh viên</ModalHeader>
                                                <ModalBody>
                                                    <FormGroup row>
                                                        <Col md="3">
                                                            <h6>Người hướng dẫn</h6>
                                                        </Col>
                                                        <Col xs="12" md="9">
                                                            <Label>{student.supervisor === null ? <></> : (student.supervisor.name)}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="3">
                                                            <h6>Sinh viên</h6>
                                                        </Col>
                                                        <Col xs="12" md="9">
                                                            <label>{student.name}</label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row style={{ paddingLeft: '38%' }}>
                                                        <Input onChange={e => { this.handleSelectMonth(e, listStudentTask) }} type="select" name="months" style={{ width: '250px' }}>
                                                            {months && months.map((month, i) => {
                                                                return (
                                                                    <option value={i} selected={i == isThisMonth}>{month}</option>
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
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter>
                                        <Row style={{ marginLeft: "21%" }}>
                                            <Col xs="4" sm="4">
                                                {this.state.role === "ROLE_SUPERVISOR" ?
                                                    <Button block color="danger" onClick={() => this.handleDirect('/supervisor/report')}>Huỷ bỏ</Button> :
                                                    <Button block color="danger" onClick={() => this.handleDirect('/hr/report')}>Huỷ bỏ</Button>
                                                }
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button block color="primary" onClick={() => this.handleSubmit()}>
                                                    Tạo
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Create_Report;
