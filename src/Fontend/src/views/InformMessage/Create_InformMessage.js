import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Popup from "reactjs-popup";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';

class Create_InformMessage extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            open: false,
            isSelect: null,
            preIsSelect: null,
            colorTextSelect: ['Black', 'White'],
            colorBackSelect: ['White', 'DeepSkyBlue'],
            informFromEmail: '',
            students: null,
            listStudentEmail: [],
            preListStudentEmail: [],
            informTo: '',

            searchValue: '',

            description: '',
            title: '',
            role: '',
        };
        this.openPopupRegist = this.openPopupRegist.bind(this);
        this.closePopupRegist = this.closePopupRegist.bind(this);
        this.closePopupWithConfirm = this.closePopupWithConfirm.bind(this);
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let students = [];
        let isSelect = [];
        let preIsSelect = [];
        let role = "";
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
            if (role === "ROLE_ADMIN") {
                students = await ApiServices.Get(`/admin/students`);
            }
            if (role === "ROLE_HR") {
                students = await ApiServices.Get(`/business/getStudentsByBusinessNotPaging`);
            }
        }
        let informFromEmail = '';
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        if (token !== null) {
            const decoded = decode(token);
            informFromEmail = decoded.email;
        }
        for (let index = 0; index < students.length; index++) {
            isSelect.push(0);
            preIsSelect.push(0);
        }
        this.setState({
            loading: false,
            informFromEmail: informFromEmail,
            students: students,
            time_created: today,
            isSelect: isSelect,
            preIsSelect: preIsSelect,
            role: role,
        });
    }

    openPopupRegist() {
        let preIsSelect = [];
        let isSelect = this.state.isSelect;
        let preListStudentEmail = [];
        let listStudentEmail = this.state.listStudentEmail;
        for (let index = 0; index < isSelect.length; index++) {
            preIsSelect.push(isSelect[index]);
        }
        for (let index = 0; index < listStudentEmail.length; index++) {
            preListStudentEmail.push(listStudentEmail[index]);
        }
        this.setState({
            open: true,
            preListStudentEmail: preListStudentEmail,
            preIsSelect: preIsSelect,
        })
    }

    closePopupRegist() {
        let informTo = '';
        let listStudentEmail = this.state.listStudentEmail;
        for (let index = 0; index < listStudentEmail.length; index++) {
            informTo += listStudentEmail[index] + "; ";
            if (informTo.length > 75) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            open: false,
            informTo: informTo,
            preListStudentEmail: listStudentEmail,
            preIsSelect: this.state.isSelect,
            searchValue: '',
        })
        // console.log("preIsSelect: " + this.state.preIsSelect);
        // console.log("isSelect: " + this.state.isSelect);
    }

    closePopupWithConfirm() {
        let preIsSelect = this.state.preIsSelect;
        let isSelect = [];
        let preListStudentEmail = this.state.preListStudentEmail;
        let listStudentEmail = [];
        let informTo = this.state.informTo;
        for (let index = 0; index < preIsSelect.length; index++) {
            isSelect.push(preIsSelect[index]);
        }
        for (let index = 0; index < preListStudentEmail.length; index++) {
            listStudentEmail.push(preListStudentEmail[index]);
        }
        this.setState({
            open: false,
            isSelect: isSelect,
            listStudentEmail: listStudentEmail,
            informTo: informTo,
            searchValue: '',
        })
        // console.log(this.state.isSelect);
        // console.log(this.state.listStudentEmail);
        // console.log(this.state.informTo);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleSelect = (selectEmail) => {
        let preListStudentEmail = this.state.preListStudentEmail;
        // console.log(preListStudentEmail);
        let preIsSelect = this.state.preIsSelect;
        // console.log(preIsSelect);
        let students = this.state.students;
        // console.log(students);
        let informTo = '';
        if (preListStudentEmail.includes(selectEmail)) {
            for (let index = 0; index < preListStudentEmail.length; index++) {
                if (preListStudentEmail[index] === selectEmail) {
                    preListStudentEmail.splice(index, 1);
                }
            }
            for (let index = 0; index < students.length; index++) {
                if (students[index].email == selectEmail) {
                    preIsSelect[index] = 0;
                }
            }
            console.log(preIsSelect);
        } else {
            preListStudentEmail.push(selectEmail);
            for (let i = 0; i < students.length; i++) {
                // for (let j = 0; j < preListStudentEmail.length; j++) {
                //     if (students[i] = preListStudentEmail[j]) {
                //         preIsSelect[i] = 1;
                //     }
                // }
                if (students[i].email === selectEmail) {
                    preIsSelect[i] = 1;
                }
                console.log(preIsSelect);
            }
        }
        for (let index = 0; index < preListStudentEmail.length; index++) {
            informTo += preListStudentEmail[index] + "; ";
            if (informTo.length > 75) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            preListStudentEmail: preListStudentEmail,
            preIsSelect: preIsSelect,
            informTo: informTo,
        })
        // console.log("preIsSelect: " + this.state.preIsSelect);
        // console.log("isSelect: " + this.state.isSelect);
        // console.log(this.state.preListStudentEmail);
    }

    handleSelectAll = (listSelect) => {
        let students = this.state.students;
        let preListStudentEmail = this.state.preListStudentEmail;
        let preIsSelect = this.state.preIsSelect;
        let informTo = '';
        let isSelected = false;
        for (let index = 0; index < students.length; index++) {
            for (let index0 = 0; index0 < listSelect.length; index0++) {
                if (listSelect[index0].email === students[index].email) {
                    preIsSelect[index] = 1;
                    for (let index1 = 0; index1 < preListStudentEmail.length; index1++) {
                        if (preListStudentEmail[index1] === students[index].email) {
                            isSelected = true;
                        }
                    }
                    if (isSelected === false) {
                        preListStudentEmail.push(students[index].email);
                    }
                    isSelected = false;
                }
            }
        }
        // console.log(preListStudentEmail);
        for (let index = 0; index < preListStudentEmail.length; index++) {
            informTo += preListStudentEmail[index] + "; ";
            if (informTo.length > 100) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            preListStudentEmail: preListStudentEmail,
            preIsSelect: preIsSelect,
            informTo: informTo,
        })
        // console.log(this.state.preIsSelect);
        // console.log(this.state.preListStudentEmail);
    }

    handleDeSelect = (listDeSelect) => {
        let students = this.state.students;
        let preListStudentEmail = [];
        // let deSelect = [];
        let preIsSelect = this.state.preIsSelect;
        let informTo = '';
        for (let index = 0; index < preIsSelect.length; index++) {
            for (let index0 = 0; index0 < listDeSelect.length; index0++) {
                if (listDeSelect[index0].email === students[index].email) {
                    preIsSelect[index] = 0;
                }
            }
        }
        for (let index = 0; index < preIsSelect.length; index++) {
            if (preIsSelect[index] === 1) {
                preListStudentEmail.push(students[index].email);
            }
        }
        for (let index = 0; index < preListStudentEmail.length; index++) {
            informTo += preListStudentEmail[index] + "; ";
            if (informTo.length > 100) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            preListStudentEmail: preListStudentEmail,
            informTo: informTo,
            preIsSelect: preIsSelect,
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSubmit = async () => {
        // console.log(title);
        // console.log(description);
        let descriptionNeedFix = this.state.description;
        descriptionNeedFix = descriptionNeedFix.replace('<p>', '');
        descriptionNeedFix = descriptionNeedFix.replace('</p>', '');
        // if (descriptionNeedFix === "") {
        //     descriptionNeedFix = "(No content)";
        // }
        let titleNeedFix = this.state.title;
        // if (titleNeedFix === "") {
        //     titleNeedFix = "(No Title)";
        // }
        const description = descriptionNeedFix;
        const title = titleNeedFix;
        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            const event = {
                description,
                title,
            }
            const listStudentEmail = this.state.listStudentEmail;
            const result = await ApiServices.Post(`/event/event?listStudentEmail=${listStudentEmail}`, event);
            // console.log(result);
            // console.log(listStudentEmail);
            // console.log(event);
            if (result.status === 201) {
                Toastify.actionSuccess("Tạo thông báo thành công!");
                setTimeout(
                    function () {
                        if (this.state.role === "ROLE_ADMIN") {
                            this.props.history.push('/admin/informmessage');
                        }
                        if (this.state.role === "ROLE_HR") {
                            this.props.history.push('/hr/informmessage');
                        }
                    }
                        .bind(this),
                    2000
                );
            } else {
                Toastify.actionFail("Tạo thông báo thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loading, searchValue, informFromEmail, students, informTo, title, description, colorTextSelect, colorBackSelect, preIsSelect } = this.state;
        let filteredListStudent;
        let filteredPreIsSelect = [];
        if (students !== null) {
            filteredListStudent = students.filter(
                (student) => {
                    if (student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        for (let index = 0; index < students.length; index++) {
                            if (students[index].email === student.email) {
                                filteredPreIsSelect.push(preIsSelect[index]);
                            }
                        }
                        return student;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Soạn thông báo
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Từ:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input type="text" disabled defaultValue={informFromEmail} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Đến:</h6>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <Input type="text" value={informTo} id="informTo" name="informTo" readOnly style={{ backgroundColor: "white" }}></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Email nhận', informTo, 'required')}
                                                </span>
                                            </Col>
                                            <Col xs="12" md="1">
                                                <Button block outline color="primary" onClick={this.openPopupRegist}>Thêm</Button>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Chủ đề:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input type="text" value={title} onChange={this.handleInput} id="title" name="title" />
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Chủ đề', title, 'required')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <hr />
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Nội dung:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={description}
                                                    onChange={(event, editor) => {
                                                        this.setState({
                                                            description: editor.getData(),
                                                        })
                                                    }}
                                                />
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Nội dung', description, 'required')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>

                                    <CardFooter className="p-3">
                                        <Row style={{ marginLeft: "21%" }}>
                                            <Col xs="4" sm="4">
                                                {this.state.role === "ROLE_ADMIN" ?
                                                    <Button block color="secondary" onClick={() => this.handleDirect('/admin/informmessage')}>
                                                        Trở về
                                                    </Button> :
                                                    <Button block color="secondary" onClick={() => this.handleDirect('/hr/informmessage')}>
                                                        Trở về
                                                    </Button>
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
                        <Popup
                            open={this.state.open}
                            // closeOnDocumentClick
                            onClose={this.closePopupRegist}
                        >
                            <div className="TabContent">
                                <nav className="navbar navbar-light bg-light justify-content-between">
                                    <form className="form-inline">
                                        <input style={{ width: '500px' }} onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                    </form>
                                    <FormGroup row style={{ marginRight: "4px", paddingTop: '15px' }}>
                                        <Button color="primary" onClick={() => this.handleSelectAll(filteredListStudent)}>Chọn tất cả</Button>
                                        &nbsp;&nbsp;
                                        <Button color="primary" onClick={() => this.handleDeSelect(filteredListStudent)}>Huỷ chọn</Button>
                                    </FormGroup>
                                </nav>
                                {/* <row>
                                    <Button color="primary" onClick={() => this.handleSelectAll()}>Chọn tất cả</Button>
                                    &nbsp;&nbsp;
                                    <Button color="primary" onClick={() => this.handleDeSelect()}>Huỷ chọn</Button>
                                </row>
                                <br /> */}
                                <hr />
                                <ListGroup>
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {filteredListStudent && filteredListStudent.map((student, index) =>
                                            <ListGroupItem action onClick={() => this.handleSelect(student.email)} style={{ color: colorTextSelect[filteredPreIsSelect[index]], backgroundColor: colorBackSelect[filteredPreIsSelect[index]] }}>
                                                <ListGroupItemHeading style={{ fontWeight: 'bold' }}>{student.name}</ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {student.email}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                        )}
                                    </div>
                                </ListGroup>
                                <hr />
                                <div style={{ paddingLeft: '45%' }}>
                                    <Button color="primary" onClick={this.closePopupWithConfirm} >Xác nhận</Button>
                                </div>
                            </div>
                        </Popup>
                    </div>
                )
        );
    }
}

export default Create_InformMessage;
