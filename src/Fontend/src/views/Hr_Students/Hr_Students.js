import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import PaginationComponent from '../Paginations/pagination';

class Hr_Students extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            searchValue: '',
            loading: true,
            modalDetail: false,
            modalTask: false,
            studentDetail: null,
            listStudentTask: null,
            months: null,
            isThisMonth: -1,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,

            filterStudentTaskList: null,
            stateTask: ["Tổng", "Hoàn thành", "Chưa hoàn thành"],
            stateNo: 0,
            numOfStudent: 0,
            isSearching: false,
            searchingStudentList: null,
        };
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/supervisor/students/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const numOfStudent = await ApiServices.Get("/supervisor/getNumStudent");
        if (numOfStudent === null) {
            numOfStudent = 0;
        }
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                numOfStudent: numOfStudent,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const searchingStudentList = await ApiServices.Get(`/supervisor/searchingStudentAllFields?valueSearch=${value.substr(0, 20)}`);
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: true,
                searchingStudentList: searchingStudentList,
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    toggleModalDetail = async (studentDetail) => {
        if (this.state.modalDetail === false) {
            this.setState({
                modalDetail: !this.state.modalDetail,
                studentDetail: studentDetail,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
            })
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

    toggleModalTask = async (studentDetail) => {
        if (this.state.modalTask === false) {
            this.setState({
                loading: true,
            })
            let months = [];
            var date = new Date();
            let isThisMonth = -1;

            const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${studentDetail.email}`);
            var dateEnroll = ojtEnrollment.timeEnroll;
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
                // console.log(formatTimeStartShow[1]);
                // tmpdate.setFullYear(parseInt(formatTimeStartShow[2]), parseInt(formatTimeStartShow[1] - 1), parseInt(formatTimeStartShow[0] - 1));
                tmpdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                tmpdate1 = parseInt(formatTimeStartShow[2]) + "-" + parseInt(formatTimeStartShow[1]) + "-" + parseInt(formatTimeStartShow[0]);
                date2.setFullYear(parseInt(formatTimeEndShow[2]), parseInt(formatTimeEndShow[1] - 1), parseInt(formatTimeEndShow[0]));
                if ((date > date1 || tmpdate === tmpdate1) && date < date2) {
                    isThisMonth = index - 1;
                }
                // console.log(isThisMonth);
                // console.log(date);
                // console.log(date1);
                // console.log(date2);
                // console.log(date >= date1);
                months.push(`${timeStartShow} - ${timeEndShow}`);
            }
            // console.log(months);
            // console.log(isThisMonth);

            var date = months[isThisMonth].split(" - ");
            var formatDateStart = date[0].split("/");
            let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
            var formatDateEnd = date[1].split("/");
            let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
            const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
            // const listStudentTask = await ApiServices.Get(`/supervisor/allTasksByStudentEmail?emailStudent=${studentDetail.email}`);
            months.unshift("Tổng");

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

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/supervisor/students/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/supervisor/students/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/supervisor/students/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handleInputPagingAll = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/supervisor/students/pagination?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage: 0,
                pageNumber: students.pageNumber
            })
        }
    }

    render() {
        const { months, isThisMonth, studentDetail, listStudentTask, students, searchValue, loading } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { filterStudentTaskList, stateNo, stateTask, numOfStudent, isSearching, searchingStudentList } = this.state;
        let filteredListStudents;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Danh sách sinh viên
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
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
                                                        {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px"  }}>Chuyên ngành</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px"  }}>GPA</th> */}
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isSearching === false ?
                                                        (
                                                            students && students.map((student, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                        <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                        <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                        <td style={{ textAlign: "center" }}>{student.email}</td>
                                                                        {/* <td style={{ textAlign: "center" }}>{student.specialized.name}</td> */}
                                                                        {/* <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.transcriptLink} download>Tải</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td> */}
                                                                        {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {/* <Button style={{ width: '100px', marginRight: '2px' }} color="primary" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}><i className="fa fa-eye"></i></Button> */}
                                                                            <Button color="primary" onClick={() => this.toggleModalDetail(student)}><i className="fa fa-eye"></i></Button>
                                                                            &nbsp;&nbsp;
                                                                    {/* <Button style={{ width: '100px' }} color="success" onClick={() => this.handleDirect(`/supervisor/hr-student-list/details/${student.email}`)}><i className="fa cui-task"></i></Button> */}
                                                                            <Button color="success" onClick={() => this.toggleModalTask(student)}><i className="fa cui-task"></i></Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        ) : (
                                                            searchingStudentList && searchingStudentList.map((student, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                        <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                        <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                        <td style={{ textAlign: "center" }}>{student.email}</td>
                                                                        {/* <td style={{ textAlign: "center" }}>{student.specialized.name}</td> */}
                                                                        {/* <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.transcriptLink} download>Tải</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td> */}
                                                                        {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {/* <Button style={{ width: '100px', marginRight: '2px' }} color="primary" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}><i className="fa fa-eye"></i></Button> */}
                                                                            <Button color="primary" onClick={() => this.toggleModalDetail(student)}><i className="fa fa-eye"></i></Button>
                                                                            &nbsp;&nbsp;
                                                                    {/* <Button style={{ width: '100px' }} color="success" onClick={() => this.handleDirect(`/supervisor/hr-student-list/details/${student.email}`)}><i className="fa cui-task"></i></Button> */}
                                                                            <Button color="success" onClick={() => this.toggleModalTask(student)}><i className="fa cui-task"></i></Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        )}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        {students && students !== null ? (isSearching === false ?
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Pagination>
                                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                        </Pagination>
                                                        &emsp;
                                                        <h6 style={{ marginTop: '7px' }}>Số dòng trên trang: </h6>
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
                                                        <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + students.length} trên tổng số {numOfStudent} kết quả</Label>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            :
                                            <></>) : <></>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                                <ModalBody>
                                    {/* <div style={{maxHeight:"663px", overflowY:'auto', overflowX:'hidden'}}> */}
                                    <div>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Ảnh đại diện</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {studentDetail.avatarLink === null ?
                                                    <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" style={{ width: "100px", height: "100px" }} alt="usericon" /> :
                                                    <img src={studentDetail.avatarLink} className="img-avatar" style={{ width: "100px", height: "100px" }} />
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Họ và tên</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.name}</label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>MSSV</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.code}</label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Chuyên ngành</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.specialized.name}</label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Giới thiệu bản thân</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.objective}</label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Bảng điểm</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.transcriptLink && studentDetail.transcriptLink ? (
                                                        <a href={studentDetail.transcriptLink} download>Tải về</a>
                                                    ) :
                                                        (<label>N/A</label>)
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Kỹ năng chuyên ngành</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.skills && studentDetail.skills.map((skill, index) => {
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
                                                    studentDetail.skills && studentDetail.skills.map((skill, index) => {
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
                                                <h6>GPA</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.gpa}</label>
                                            </Col>
                                        </FormGroup>
                                    </div>
                                </ModalBody>
                                {/* <ModalFooter>
                                </ModalFooter> */}
                            </Modal> :
                            <></>
                        }
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
                                        <Input onChange={e => { this.handleSelectStateTask(e) }} type="select" name="stateTask" style={{ width: '150px' }}>
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
                    </div>
                )
        );
    }
}

export default Hr_Students;
