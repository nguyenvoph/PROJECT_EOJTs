import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';
import decode from 'jwt-decode';

class Hr_Task_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            title: '',
            description: '',
            time_end: '',
            level_task: 'EASY',
            // priority: '',
            status: 'NOTSTART',
            students: [],
            studentItem: {},
            validPassed: '',

            role: '',
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }

        var students = null;
        if (role === 'ROLE_SUPERVISOR') {
            students = await ApiServices.Get('/supervisor/students');
        } else if (role === 'ROLE_HR') {
            students = await ApiServices.Get('/business/getStudentsByBusinessWithNoSupervisor');
        }

        if (students !== null) {
            this.setState({
                students,
                studentItem: students[0],
                loading: false,
                role: role,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { students } = this.state;
        if (name.includes('time_end')) {
            let validPassed = '';
            let date = new Date();
            let endDate = new Date();
            var formatEndDate = value.split("-");
            endDate.setFullYear(formatEndDate[0], formatEndDate[1] - 1, formatEndDate[2]);
            if (!(endDate > date || date.toString() === endDate.toString())) {
                validPassed = "Không thể chọn ngày quá khứ";
            }
            await this.setState({
                validPassed: validPassed,
                [name]: value
            })
        }
        if (name.includes('student')) {
            await this.setState({
                studentItem: students[value]
            })
        } else if (name.includes('level_task')) {
            await this.setState({
                level_task: value
            })
        } else {
            await this.setState({
                [name]: value
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            title: '',
            description: '',
            time_end: '',
            level_task: 'EASY',
            // priority: '',
            studentItem: this.state.students[0],
        })
    }

    handleSubmit = async () => {
        const { title, description, time_end, level_task, status, studentItem } = this.state;
        const emailStudent = studentItem.email;

        const notificationDTO = {
            data: {
                title: 'Bạn có nhiệm vụ mới',
                body: `Xin chào ${studentItem.name}! Bạn được giao nhiệm mới "${title}" từ supervisor ${studentItem.supervisor.name}`,
                click_action: "http://localhost:3000/#/hr/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: `${studentItem.token}`
        }

        const task = {
            title,
            description,
            time_end,
            level_task,
            // priority,
            status
        }

        if (this.validator.allValid()) {
            if (this.state.validPassed === "") {
                this.setState({
                    loading: true
                })
                const result = await ApiServices.Post(`/supervisor?emailStudent=${emailStudent}`, task);
                if (result.status === 201) {
                    Toastify.actionSuccess("Tạo nhiệm vụ mới thành công!");
                    this.setState({
                        loading: false,
                        title: '',
                        description: '',
                        time_end: '',
                        level_task: 'EASY',
                    })
                    const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
                    setTimeout(
                        function () {
                            if (this.state.role === "ROLE_SUPERVISOR") {
                                this.props.history.push('/supervisor/hr-task');
                            } else {
                                this.props.history.push('/hr/hr-task');
                            }
                        }
                            .bind(this),
                        2000
                    );
                } else {
                    Toastify.actionFail("Tạo nhiệm vụ mới thất bại!");
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
        const { validPassed, title, description, time_end, level_task, priority, students, studentItem, loading, role } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Tạo nhiệm vụ mới</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="title">Tên nhiệm vụ</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={title} onChange={this.handleInput} type="text" id="title" name="title" placeholder="Tên nhiệm vụ" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên nhiệm vụ', title, 'required|max:50')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="student">Giao cho</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input onChange={this.handleInput} type="select" name="student">
                                                        {students && students.map((student, i) => {
                                                            return (
                                                                <option value={i} selected={studentItem.email === students[i].email}>{student.name}</option>
                                                            )
                                                        })}
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="description">Mô tả</Label>
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
                                                        {this.validator.message('Mô tả', description, 'required|max:255')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="time_end">Thời hạn hoàn thành</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={time_end} onChange={this.handleInput} type="date" id="time_end" name="time_end" placeholder="Thời hạn hoàn thành" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Thời hạn hoàn thành', time_end, 'required')}
                                                    </span>
                                                    <span className="form-error is-visible text-danger">
                                                        {validPassed}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="level_task">Mức độ</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {/* <Input value={level_task} onChange={this.handleInput} type="text" id="level_task" name="level_task" placeholder="Mức độ" /> */}
                                                    <Input onChange={this.handleInput} type="select" name="level_task">
                                                        <option selected={level_task === 'EASY'} value='EASY'>Dễ</option>
                                                        <option selected={level_task === 'NORMAL'} value='NORMAL'>Bình thường</option>
                                                        <option selected={level_task === 'DIFFICULT'} value='DIFFICULT'>Khó</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            {/* <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="priority">Ưu tiên</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={priority} onChange={this.handleInput} type="number" id="priority" name="priority" placeholder="Ưu tiên" />
                                                    <span className="form-error is-visible text-danger">
                                                        <i class="fa fa-exclamation-circle" />
                                                        {this.validator.message('Độ ưu tiên', priority, 'required|numberic')}
                                                    </span>
                                                </Col>
                                            </FormGroup> */}
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                {role === "ROLE_SUPERVISOR" ?
                                                    <Button color="secondary" block onClick={() => this.handleDirect('/supervisor/hr-task')}>Trở về</Button> :
                                                    <Button color="secondary" block onClick={() => this.handleDirect('/hr/hr-task')}>Trở về</Button>
                                                }
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo nhiệm vụ</Button>
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

export default Hr_Task_Create;
