import firebase from 'firebase/app';
// import { initializeApp } from '../hr/invitation/push-notification';
import 'firebase/storage';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Label, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';


const storage = firebase.storage();

class Student_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            loading: true,
            resumeLink: '',
        }
    }


    async componentDidMount() {
        const email = window.location.href.split("/").pop();
        const students = await ApiServices.Get(`/student/student/${email}`);

        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }

        if (students !== null) {
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
                loading: false
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
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
        } else {
            Toastify.actionFail('Cập nhật bảng điểm thất bại');
        }
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            this.setState({
                file: file
            })
        }
    }

    handleSubmit = async () => {
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

    render() {
        const { name, code, email, phone, address, specialized, objective, gpa, skills, resumeLink, transcriptLink, role, loading } = this.state;
        const linkDownCV = `http://localhost:8000/api/file/downloadFile/${resumeLink}`;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Thông tin chi tiết học sinh
                            </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Họ và tên</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{name}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>MSSV</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{code}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{email}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>SĐT</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{phone}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Chuyên ngành</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{specialized}</Label>
                                                </Col>
                                            </FormGroup>
                                            {/* <FormGroup row>
                                        <Col md="2">
                                            <h6>Học kỳ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{}</Label>
                                        </Col>
                                    </FormGroup> */}
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Địa chỉ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{address}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Mục tiêu</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{objective}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>GPA</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="" name="">{gpa}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Kỹ năng</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {
                                                        skills && skills.map((skill, index) => {
                                                            return (
                                                                <div>
                                                                    {
                                                                        skill.name && skill.name ? (
                                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                        ) : (
                                                                                <label style={{ marginRight: "15px" }}>N/A</label>
                                                                            )
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>CV</h6>
                                                </Col>
                                                {
                                                    resumeLink && resumeLink ?
                                                        (<Col xs="12" md="10">
                                                            <a target="_blank" href={linkDownCV} download>Tải về</a>
                                                        </Col>)
                                                        :
                                                        (
                                                            <Col xs="12" md="10">
                                                                <label>N/A</label>
                                                            </Col>)
                                                }
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Bảng điểm</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {
                                                        this.showTranscript(transcriptLink)
                                                    }
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            {
                                                role && role === 'ROLE_HR' ?
                                                    (<Col xs="3" sm="3">
                                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr/official_list")} type="submit" color="secondary" block>Trở về</Button>
                                                    </Col>) :
                                                    (<Col xs="3" sm="3">
                                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/supervisor/hr-student-list")} type="submit" color="secondary" block>Trở về</Button>
                                                    </Col>)
                                            }
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

export default Student_Detail;
