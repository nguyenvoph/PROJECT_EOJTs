import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Label, Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class Ojt_Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            business_name: '',
            business_eng_name: '',
            searchValue: '',
            loading: true,
            listInvitation: null,

            modal: false,
            studentDetail: null,
            invitationDetail: null,
            // resumeLink: '',
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,

            numOfStudent: 0,
            dropdownSpecializedOpen: false,
            dropdownSpecialized: [],
            selectedSpecialized: -1,
            searchingList: [],
            isSearching: false,
        }
    }


    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const business = await ApiServices.Get('/business/getBusiness');
        const invitations = await ApiServices.Get('/student/getListStudentIsInvitedNotPaging');
        const numOfStudent = await ApiServices.Get("/business/getNumStudent");
        const dropdownSpecialized = await ApiServices.Get("/business/getSpecializedsOfBusiness");
        let listInvitation = [];
        if (students !== null) {
            for (let index = 0; index < students.listData.length; index++) {
                listInvitation.push(false);
                for (let index1 = 0; index1 < invitations.length; index1++) {
                    if (invitations[index1].student.email === students.listData[index].email) {
                        listInvitation.splice(index, 1);
                        listInvitation.push(true);
                        break;
                    }
                }
            }
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                business_name: business.business_name,
                business_eng_name: business.business_eng_name,
                loading: false,
                listInvitation: listInvitation,
                numOfStudent: numOfStudent,
                dropdownSpecialized: dropdownSpecialized,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const students = await ApiServices.Get(`/student/getListStudentAndOptionAndStatusOptionByCodeName?valueSearch=${value.substr(0, 20)}`);
            // console.log(students);
            if (students !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingList: students,
                    isSearching: true,
                })
            }
        }
    }

    handleConfirm = (student, numberOfOption, statusOfOption) => {

        var messageStatus = '';
        if (statusOfOption) {
            messageStatus = 'duyệt';
        } else {
            messageStatus = 'từ chối';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} sinh viên "${student.name}" ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleIsAcceptedOption(student, numberOfOption, statusOfOption)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleIsAcceptedOption = async (student, numberOfOption, statusOfOption) => {

        var action, message, title;
        if (statusOfOption === true) {
            title = '[' + `${this.state.business_name}` + '] ' + 'ĐÃ CHẤP NHẬN';
            action = 'Duyệt';
            message = `Chúc mừng ${student.name}! Việc đăng kí thực tập của bạn đã được ${this.state.business_name} chấp nhận!`;
        } else {
            title = '[' + `${this.state.business_name}` + '] ' + 'ĐÃ TỪ CHỐI';
            action = 'Từ chối'
            message = `Xin chào ${student.name}! ${this.state.business_name} đã từ chối việc đăng kí thực tập của bạn tại doanh nghiệp của họ!`;
        }

        const notificationDTO = {
            data: {
                title: title,
                body: message,
                click_action: "http://localhost:3000/#/hr/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: `${student.token}`
        }

        this.setState({
            loading: true
        })

        if (numberOfOption === '1, 2') {
            var numberOfOption = [];
            numberOfOption.push(1);
            numberOfOption.push(2);
        }
        const result = await ApiServices.Put(`/business/updateStatusOfStudent?numberOfOption=${numberOfOption}&statusOfOption=${statusOfOption}&emailOfStudent=${student.email}`);

        if (result.status === 200) {
            Toastify.actionSuccess(`${action} thành công!`);
            const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
            this.setState({
                loading: false,
            })
        } else {
            Toastify.actionFail(`${action} thất bại!`);
            const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
            this.setState({
                loading: false
            })
        }

        const { currentPage, rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const business = await ApiServices.Get('/business/getBusiness');
        const invitations = await ApiServices.Get('/student/getListStudentIsInvitedNotPaging');
        console.log(students.listData);
        console.log(invitations);
        let listInvitation = [];
        if (students !== null) {
            for (let index = 0; index < students.listData.length; index++) {
                listInvitation.push(false);
                for (let index1 = 0; index1 < invitations.length; index1++) {
                    if (invitations[index1].student.email === students.listData[index].email) {
                        listInvitation.splice(index, 1);
                        listInvitation.push(true);
                        break;
                    }
                }
            }
            console.log(listInvitation);
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                business_name: business.business_name,
                business_eng_name: business.business_eng_name,
                loading: false,
                listInvitation: listInvitation,
            });
        }

        // const students = await ApiServices.Get('/student/getListStudentByOptionAndStatusOption');
        // const business = await ApiServices.Get('/business/getBusiness');
        // if (students !== null) {
        //     this.setState({
        //         students,
        //         business_eng_name: business.business_eng_name
        //     });
        // }
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

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

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
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

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
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${this.state.selectedSpecialized}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handleInputPaging = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${this.state.selectedSpecialized}&currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage: 0,
                pageNumber: students.pageNumber
            })
        }
    }

    toggleDropdownSpecialized = () => {
        this.setState({
            dropdownSpecializedOpen: !this.state.dropdownSpecializedOpen,
        });
    }

    handleSelectSpecialized = async (specializedId) => {
        console.log(specializedId);
        const { currentPage, rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentByOptionAndStatusOption?specializedID=${specializedId}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (students !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                currentPage: 0,
                selectedSpecialized: specializedId,
            })
        }
    }

    render() {
        const { students, business_eng_name, searchValue, loading, studentDetail, invitationDetail, listInvitation } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfStudent, dropdownSpecialized, isSearching, searchingList } = this.state;
        // const linkDownCV = ``;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách sinh viên đăng kí thực tập tại công ty
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
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Đã gửi lời mời</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nguyện vọng</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isSearching === false ?
                                                        (students && students.map((student, index) => {

                                                            let email = student.email;
                                                            let numberOfOption = 'N/A';

                                                            if (student.option1 === business_eng_name && student.option2 !== business_eng_name) {
                                                                numberOfOption = "1";
                                                            } else if (student.option2 === business_eng_name && student.option1 !== business_eng_name) {
                                                                numberOfOption = "2";
                                                            } else {
                                                                numberOfOption = "1, 2";
                                                                students.splice(index, 1);
                                                            }


                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {listInvitation && listInvitation[index] === true ?
                                                                            <Badge color="success" style={{ fontSize: '12px' }}>CÓ</Badge> :
                                                                            <Badge color="danger" style={{ fontSize: '12px' }}>KHÔNG</Badge>
                                                                        }
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <strong>{numberOfOption}</strong>
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {/* <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleDirect(`/student/${student.email}`)}><i className="fa fa-eye"></i></Button> */}
                                                                        <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.toggleModalDetail(student)}><i className="fa fa-eye"></i></Button>
                                                                        <Button id={'r' + index} type="submit" style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(student, numberOfOption, false)}><i className="fa cui-ban"></i></Button>
                                                                        <Button id={'a' + index} type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(student, numberOfOption, true)}><i className="fa cui-circle-check"></i></Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })) :
                                                        (searchingList && searchingList.map((student, index) => {

                                                            let email = student.email;
                                                            let numberOfOption = 'N/A';

                                                            if (student.option1 === business_eng_name && student.option2 !== business_eng_name) {
                                                                numberOfOption = "1";
                                                            } else if (student.option2 === business_eng_name && student.option1 !== business_eng_name) {
                                                                numberOfOption = "2";
                                                            } else {
                                                                numberOfOption = "1, 2";
                                                                searchingList.splice(index, 1);
                                                            }


                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                    <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {listInvitation && listInvitation[index] === true ?
                                                                            <Badge color="success" style={{ fontSize: '12px' }}>Có</Badge> :
                                                                            <Badge color="danger" style={{ fontSize: '12px' }}>Không</Badge>
                                                                        }
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <strong>{numberOfOption}</strong>
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {/* <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleDirect(`/student/${student.email}`)}><i className="fa fa-eye"></i></Button> */}
                                                                        <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.toggleModalDetail(student)}><i className="fa fa-eye"></i></Button>
                                                                        <Button id={'r' + index} type="submit" style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(student, numberOfOption, false)}><i className="fa cui-ban"></i></Button>
                                                                        <Button id={'a' + index} type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(student, numberOfOption, true)}><i className="fa cui-circle-check"></i></Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }))
                                                    }
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
                                                        <h6 style={{ marginTop: "7px" }}>Số dòng trên trang: </h6>
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
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modal} toggle={this.toggleModalDetail}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                                <ModalBody>
                                    {/* <div style={{ maxHeight: "563px", overflowY: 'auto', overflowX: 'hidden' }}> */}
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
                                                <h6>Email</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.email}</label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>SĐT</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.phone}</label>
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
                                                <h6>CV</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.resumeLink && studentDetail.resumeLink ?
                                                        <a target="_blank" href={`http://localhost:8000/api/file/downloadFile/${studentDetail.resumeLink}`} download>Tải về</a>
                                                        :
                                                        <label>N/A</label>
                                                }
                                            </Col>
                                        </FormGroup>
                                    </div>
                                </ModalBody>
                                {invitationDetail !== null ?
                                    <ModalFooter>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Chi tiết lời mời</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <div style={{ maxHeight: "100px", overflowY: 'auto', overflowX: 'hidden' }}>
                                                    <label>{invitationDetail}</label>
                                                </div>
                                            </Col>
                                        </FormGroup>
                                    </ModalFooter> :
                                    <></>
                                }
                            </Modal> :
                            <></>
                        }
                    </div>
                )
        );
    }
}

export default Ojt_Registration;
