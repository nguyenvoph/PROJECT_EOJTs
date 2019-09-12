import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';

import decode from 'jwt-decode';

class Hr_Task_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            id: '',
            title: '',
            description: '',
            time_created: '',
            time_end: '',
            level_task: '',
            priority: '',
            status: '',
            supervisorName: '',
            studentName: '',

            role: '',
        }
    }


    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const task = await ApiServices.Get(`/supervisor/task?id=${id}`);
        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        if (task !== null) {
            this.setState({
                loading: false,
                id: task.task.id,
                title: task.task.title,
                description: task.task.description,
                time_created: task.task.time_created,
                time_end: task.task.time_end,
                level_task: task.task.level_task,
                priority: task.task.priority,
                status: task.task.status,
                supervisorName: task.task.supervisor.name,
                studentName: task.nameStudent,
                role: role,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirmSetState = (id, status) => {

        var messageStatus = '';
        if (status === 3) {
            messageStatus = 'hoàn thành';
        } else {
            messageStatus = 'chưa hoàn thành';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn chuyển trạng thái nhiệm vụ '${this.state.title}' thành '${messageStatus}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(id, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleUpdateStatus = async (id, status) => {
        this.setState({
            loading: true
        })
        const result = await ApiServices.Put(`/supervisor/stateTask?id=${id}&typeTask=${status}`);

        if (result.status === 200) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");

            this.setState({
                loading: false
            })

            const task = await ApiServices.Get(`/supervisor/task?id=${id}`);

            if (task !== null) {
                this.setState({
                    id: task.task.id,
                    title: task.task.title,
                    description: task.task.description,
                    time_created: task.task.time_created,
                    time_end: task.task.time_end,
                    level_task: task.task.level_task,
                    priority: task.task.priority,
                    status: task.task.status,
                    supervisorName: task.task.supervisor.name,
                    studentName: task.nameStudent
                });
            }
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
            this.setState({
                loading: false
            })
        }
    }

    showTaskState(taskStatus) {
        console.log(taskStatus);
        if (taskStatus === 'NOTSTART') {
            return (
                <Badge color="danger">Chưa bắt đầu</Badge>
            )
        } else if (taskStatus === 'PENDING') {
            return (
                <Badge color="warning">Chưa hoàn thành</Badge>
            )
        } else if (taskStatus === 'DONE') {
            return (
                <Badge color="success">Hoàn Thành</Badge>
            )
        }
    }

    showButtonChangeStatus(taskStatus, id) {
        if (taskStatus === 'NOTSTART') {
            return (
                <div>
                    {this.state.role === "ROLE_SUPERVISOR" ?
                        <Button style={{ marginLeft: "950px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/supervisor/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button> :
                        <Button style={{ marginLeft: "950px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/hr/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button>
                    }
                </div>
            )
        } else if (taskStatus === 'PENDING') {
            return (
                <div>
                    <Button style={{ marginLeft: "720px" }} type="submit" color="success" onClick={() => this.handleConfirmSetState(id, 3)}>Đánh dấu nhiệm vụ hoàn thành</Button>
                    {this.state.role === "ROLE_SUPERVISOR" ?
                        <Button style={{ marginLeft: "5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/supervisor/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button> :
                        <Button style={{ marginLeft: "5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/hr/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button>
                    }
                </div>
            )
        } else if (taskStatus === 'DONE') {
            return (
                <div>
                    <Button style={{ marginLeft: "700px" }} type="submit" color="danger" onClick={() => this.handleConfirmSetState(id, 2)}>Đánh dấu nhiệm vụ chưa hoàn thành</Button>
                    <Button disabled style={{ marginLeft: "5px" }} type="submit" color="primary" onClick={() => this.handleDirect('')}><i className="fa cui-note"></i></Button>
                </div>
            )
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

    render() {
        const { id, title, description, time_created, time_end, level_task, priority, status, supervisorName,
            studentName, loading, role } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Chi tiết nhiệm vụ
                            </CardHeader>
                                    <CardBody>
                                        <div>
                                            {
                                                this.showButtonChangeStatus(status, id)
                                            }
                                        </div>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên nhiệm vụ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="title" name="title">{title}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Trạng thái</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {
                                                        this.showTaskState(status)
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Ngày tạo</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="time_created" name="time_created">{time_created}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Người giao</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="supervisorName" name="supervisorName">{supervisorName}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Sinh viên</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="studentName" name="studentName">{studentName}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Mô tả</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <label dangerouslySetInnerHTML={{ __html: description }} id="description" name="description" />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Ngày hết hạn</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="time_end" name="time_end">{time_end}</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Mức độ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {
                                                        this.showTaskLevel(level_task)
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Ưu tiên</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label id="priority" name="priority">{priority}</Label>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                {role === "ROLE_SUPERVISOR" ?
                                                    <Button id="submitBusinesses" onClick={() => this.handleDirect("/supervisor/hr-task")} type="submit" color="secondary" block>Trở về</Button> :
                                                    <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr/hr-task")} type="submit" color="secondary" block>Trở về</Button>
                                                }
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row >
                    </div >
                )
        );
    }
}

export default Hr_Task_Detail;
