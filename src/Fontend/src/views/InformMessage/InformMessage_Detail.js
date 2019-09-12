import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Input, Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Label, Pagination, Row, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';

class InformMessage_Detail extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            title: '',
            description: '',
            students: null,
            business: null,
            informFromName: '',
            informFromEmail: '',
            isStudentSent: false,
            modalReply: false,
            titleReply: '',
            descriptionReply: '',
            emailStudentSent: '',
            role: '',
        };
    }

    async componentDidMount() {
        const informMessageID = window.location.href.split("/").pop();
        const token = localStorage.getItem('id_token');
        const decoded = decode(token);
        const data = await ApiServices.Get(`/event/getEvent?id=${informMessageID}`);
        if (data != null) {
            const read = await ApiServices.Put(`/event/setStateEvent?eventId=${data.event.id}`)
        }
        let isStudentSent = false;
        if (data.studentSent === true) {
            isStudentSent = data.studentSent;
        }
        let business = null;
        let informFromName = '';
        let informFromEmail = '';
        if (token !== null) {
            const decoded = decode(token);
            if (decoded.role === "ROLE_ADMIN") {
                informFromName = "FPT University";
                informFromEmail = decoded.email;
            }
            if (decoded.role === "ROLE_HR") {
                business = await ApiServices.Get('/business/getBusiness');
                informFromName = business.business_name;
                informFromEmail = business.email;
            }
        }
        if (data !== null) {
            let tmpstudentList = data.studentList;
            let listStudentEmail = [];
            console.log(tmpstudentList);
            tmpstudentList && tmpstudentList.map((student, i) => {
                listStudentEmail.push(student.email);
            })
            this.setState({
                loading: false,
                title: data.event.title,
                description: data.event.description,
                students: data.studentList,
                business: business,
                informFromName: informFromName,
                informFromEmail: informFromEmail,
                isStudentSent: isStudentSent,
                titleReply: data.event.title,
                listStudentEmail,
                role: decoded.role,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    toggleModalReply = async () => {
        this.setState({
            modalReply: !this.state.modalReply,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleSubmit = async () => {
        const { listStudentEmail } = this.state;

        let descriptionNeedFix = this.state.descriptionReply;
        descriptionNeedFix = descriptionNeedFix.replace('<p>', '');
        descriptionNeedFix = descriptionNeedFix.replace('</p>', '');

        let titleNeedFix = this.state.titleReply;

        const description = descriptionNeedFix;
        const title = titleNeedFix;
        if (this.validator.allValid()) {
            // this.setState({
            //     loading: true
            // })
            const event = {
                description,
                title,
            }

            console.log(event);
            console.log(listStudentEmail);
            const result = await ApiServices.Post(`/event/event?listStudentEmail=${listStudentEmail}`, event);
            if (result.status === 201) {
                Toastify.actionSuccess("Trả lời thông báo thành công!");
                // setTimeout(
                //     function () {
                //         this.props.history.push('/informmessage');
                //     }
                //         .bind(this),
                //     2000
                // );
                this.toggleModalReply();
            } else {
                Toastify.actionFail("Trả lời thông báo thất bại!");
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
        const { loading, title, description, students, informFromName, informFromEmail, isStudentSent, titleReply, descriptionReply } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Chi tiết thông báo
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Từ:</h6>
                                            </Col>
                                            <Col xs="12" md="9">
                                                {isStudentSent === false ?
                                                    <Label>{<>{informFromName}<br />({informFromEmail})</>}</Label> :
                                                    <div>
                                                        {students && students.map((student, index) => {
                                                            return (
                                                                <>{student.name}<br />({student.email})<br /></>
                                                            )
                                                        })}
                                                    </div>
                                                }
                                            </Col>
                                            {
                                                isStudentSent === true ? (
                                                    <Col md="1">
                                                        <Button color="ghost-secondary" onClick={() => this.toggleModalReply()}>
                                                            <i className="fa fa-mail-reply"></i>
                                                        </Button>
                                                    </Col>
                                                ) : (
                                                        <></>
                                                    )
                                            }
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Đến:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>
                                                    {isStudentSent === false ?
                                                        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                            {students && students.map((student, index) => {
                                                                return (
                                                                    <>{student.name} ({student.email})<br /></>
                                                                )
                                                            })}
                                                        </div> :
                                                        <Label>{<>{informFromName}<br />({informFromEmail})</>}</Label>
                                                    }
                                                </Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Chủ đề:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold' }}>{title}</Label>
                                            </Col>
                                        </FormGroup>
                                        <hr />
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Nội dung:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{description}</Label>
                                            </Col>
                                        </FormGroup>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-3">
                                        <Row>
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
                                        </Row>
                                    </CardFooter>
                                </Card>
                                <Modal isOpen={this.state.modalReply} toggle={this.toggleModalReply}
                                    className={this.props.className}>
                                    <ModalHeader style={{ fontWeight: 'bold', backgroundColor:"#F0F3F5" }} toggle={this.toggleModalReply}>Trả lời thông báo</ModalHeader>
                                    <ModalBody>
                                        <FormGroup row>
                                            <Col md="3">
                                                <h6>Từ:</h6>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <Input type="text" disabled defaultValue={informFromEmail} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="3">
                                                <h6>Đến:</h6>
                                            </Col>
                                            <Col xs="12" md="9">
                                                {students && students.map((student, index) => {
                                                    return (
                                                        <Input type="text" disabled defaultValue={student.email} />
                                                    )
                                                })}
                                            </Col>
                                            <Col xs="12" md="1">
                                                {/* <Button block outline color="primary" onClick={this.openPopupRegist}>Thêm</Button> */}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="3">
                                                <h6>Chủ đề:</h6>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <Input type="text" value={titleReply} onChange={this.handleInput} id="titleReply" name="titleReply" />
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Chủ đề', titleReply, 'required')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <hr />
                                        <FormGroup row>
                                            <Col md="3">
                                                <h6>Nội dung:</h6>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <Input type="textarea" name="descriptionReply" id="descriptionReply" rows="9" value={descriptionReply} onChange={this.handleInput} />
                                                {/* <CKEditor
                                                    editor={ClassicEditor}
                                                    data={descriptionReply}
                                                    onChange={(event, editor) => {
                                                        this.setState({
                                                            descriptionReply: editor.getData(),
                                                        })
                                                    }}
                                                /> */}
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Nội dung', descriptionReply, 'required')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={() => this.handleSubmit()}>
                                            Tạo
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default InformMessage_Detail;
