import orderBy from "lodash/orderBy";
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Label, Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, Row, Table, Input } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import PaginationComponent from '../Paginations/pagination';

const invertDirection = {
    asc: 'desc',
    desc: 'asc'
};
class Invitation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            business_eng_name: '',
            searchValue: '',
            columnToSort: '',
            sortDirection: 'desc',
            loading: true,
            modal: false,
            studentDetail: null,
            invitationDetail: null,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,


            numOfStudent: 0,
            searchingList: [],
            isSearching: false,
        }
    }


    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentIsInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const business = await ApiServices.Get('/business/getBusiness');
        const numOfStudent = await ApiServices.Get(`/student/searchInviAllFields?valueSearch=${""}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                loading: false,
                business_eng_name: business.business_eng_name,
                numOfStudent: numOfStudent.length,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInputSearch = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const supervisors = await ApiServices.Get(`/student/searchInviAllFields?valueSearch=${value.substr(0, 20)}`);
            // console.log(students);
            if (supervisors !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingList: supervisors,
                    isSearching: true,
                })
            }
        }
    }

    toggleModalDetail = async (studentDetail) => {
        let invitationDetail = null;
        let invitation = null;
        if (this.state.modal === false) {
            invitation = await ApiServices.Get(`/business/getInvitationOfStudent?emailStudent=${studentDetail.email}`);
            invitationDetail = invitation.description;
            this.setState({
                modal: !this.state.modal,
                studentDetail: studentDetail,
                invitationDetail: invitationDetail,
            });
        } else {
            this.setState({
                modal: !this.state.modal,
            })
        }
    }


    // handleSort = (columnName) => {
    //     this.setState({
    //         columnToSort: columnName,
    //         sortDirection: state.columnToSort === columnName ? invertDirection[state.sortDirection] : "asc"
    //     })
    //     console.log(this.state);
    // }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentIsInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

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
        const students = await ApiServices.Get(`/student/getListStudentIsInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

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
        const students = await ApiServices.Get(`/student/getListStudentIsInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentIsInvited?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage: 0,
                pageNumber: students.pageNumber
            })
        }
    }

    render() {
        const { students, business_eng_name, searchValue, columnToSort, sortDirection, loading, studentDetail, invitationDetail } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfStudent, isSearching, searchingList } = this.state;


        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách các lời mời đã gửi hiện tại
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup row>
                                            <Col md="10">
                                                <Button color="primary" onClick={() => this.handleDirect('/hr/invitation/new')}>Gửi lời mời cho sinh viên</Button>
                                            </Col>
                                            <Col xs="12" md="2">
                                            </Col>
                                        </FormGroup>
                                        <nav className="navbar navbar-light bg-light justify-content-between">
                                            <form className="form-inline">
                                                <input onChange={this.handleInputSearch} name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                                            </form>

                                        </nav>
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>MSSV</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Họ và tên</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Chuyên ngành</th>
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}><div onClick={() => this.handleSort('Chuyên ngành')}>Chuyên ngành</div></th> */}
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Kỹ năng</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>GPA</th> */}
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nguyện vọng của sinh viên</th> */}
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái lời mời</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isSearching === false ?
                                                    (
                                                        students && students.map((student, index) => {

                                                            const invitations = student.invitations;
                                                            var invitationDetail = null;

                                                            invitations && invitations.map((invitation, index) => {
                                                                const business_eng_name_invitation = invitation.business.business_eng_name;
                                                                if (business_eng_name === business_eng_name_invitation) {
                                                                    invitationDetail = invitation;
                                                                }
                                                            })

                                                            const skills = student.student.skills;

                                                            let tmp = 'N/A';
                                                            if (invitationDetail !== null && invitationDetail.state !== 'false') {
                                                                if (student.student.option1 === business_eng_name) {
                                                                    tmp = 1;
                                                                }
                                                                if (student.student.option2 === business_eng_name) {
                                                                    tmp = 2;
                                                                }
                                                            }

                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                                    {/* <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        skills && skills.map((skill, index) => {
                                                                            return (
                                                                                <div>
                                                                                    {
                                                                                        <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>{student.student.gpa}</td> */}
                                                                    {/* <td style={{ textAlign: "center" }}>
                                                                    <strong>
                                                                        {tmp}
                                                                    </strong>
                                                                </td> */}
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {
                                                                            invitationDetail && (
                                                                                invitationDetail.state.toString() === 'true' ? (
                                                                                    <Badge color="success" style={{ fontSize: '12px' }}>ĐÃ CHẤP NHẬN</Badge>
                                                                                ) : (
                                                                                        <Badge color="danger" style={{ fontSize: '12px' }}>ĐANG CHỜ</Badge>
                                                                                    )
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <Button color="primary" onClick={() => this.toggleModalDetail(student.student)}><i className="fa fa-eye"></i></Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })) :
                                                    (
                                                        searchingList && searchingList.map((student, index) => {

                                                            const invitations = student.invitations;
                                                            var invitationDetail = null;

                                                            invitations && invitations.map((invitation, index) => {
                                                                const business_eng_name_invitation = invitation.business.business_eng_name;
                                                                if (business_eng_name === business_eng_name_invitation) {
                                                                    invitationDetail = invitation;
                                                                }
                                                            })

                                                            const skills = student.student.skills;

                                                            let tmp = 'N/A';
                                                            if (invitationDetail !== null && invitationDetail.state !== 'false') {
                                                                if (student.student.option1 === business_eng_name) {
                                                                    tmp = 1;
                                                                }
                                                                if (student.student.option2 === business_eng_name) {
                                                                    tmp = 2;
                                                                }
                                                            }

                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                                    {/* <td style={{ textAlign: "center" }}>
                                                                        {
                                                                            skills && skills.map((skill, index) => {
                                                                                return (
                                                                                    <div>
                                                                                        {
                                                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>{student.student.gpa}</td> */}
                                                                    {/* <td style={{ textAlign: "center" }}>
                                                                        <strong>
                                                                            {tmp}
                                                                        </strong>
                                                                    </td> */}
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {
                                                                            invitationDetail && (
                                                                                invitationDetail.state.toString() === 'true' ? (
                                                                                    <Badge color="success" style={{ fontSize: '12px' }}>ĐÃ CHẤP NHẬN</Badge>
                                                                                ) : (
                                                                                        <Badge color="danger" style={{ fontSize: '12px' }}>ĐANG CHỜ</Badge>
                                                                                    )
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <Button color="primary" onClick={() => this.toggleModalDetail(student.student)}><i className="fa fa-eye"></i></Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }))
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        {
                                            students && students !== null ?
                                                (isSearching === false ?
                                                    <Row>
                                                        <Col>
                                                            <Row >
                                                                <Pagination>
                                                                    <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                                </Pagination>
                                                                &emsp;
                                                        <h6 style={{ marginTop: "7px" }}>Số dòng trên trang: </h6>
                                                                &nbsp;&nbsp;
                                                        <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "70px" }}>
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
                                                    </Row> : <></>) :
                                                <></>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modal} toggle={this.toggleModalDetail}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                                <ModalBody>
                                    {/* <div style={{ maxHeight: "563px", overflowY: 'auto', overflowX: 'hidden' }}> */}
                                    <div>
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
                                        {/* <FormGroup row>
                                            <Col md="4">
                                                <h6>Bảng điểm</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.transcriptLink && studentDetail.transcriptLink ? (
                                                        <a href={studentDetail.transcriptLink} download>tải</a>
                                                    ) :
                                                        (<label>N/A</label>)
                                                }
                                            </Col>
                                        </FormGroup> */}
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
                                <ModalFooter>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Chi tiết lời mời</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <div style={{ maxHeight: "100px", overflowY: "auto", overflowX: "hidden" }}>
                                                <label>{invitationDetail}</label>
                                            </div>
                                        </Col>
                                    </FormGroup>
                                </ModalFooter>
                            </Modal> :
                            <></>
                        }
                    </div>
                )
        );
    }
}

export default Invitation;
