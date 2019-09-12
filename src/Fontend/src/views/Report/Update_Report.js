import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';
import decode from 'jwt-decode';

class Update_Report extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            reportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black', 'black'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', 'N/A'],
            onScore: 5,
            id: -1,
            title: '',
            timeStart: '',
            timeEnd: '',
            remark: '',
            score_discipline: '0',
            score_work: '0',
            score_activity: '0',
            project_name: '',
            workDays: 0,

            needId: null,
            reportId: -1,

            student: null,
            businessName: '',
            onScreenStartDate: '',
            onScreenEndDate: '',

            validatorNumRange_score_work: '',
            validatorNumRange_score_activity: '',
            validatorNumRange_score_discipline: '',
            maxWorkDays: 0,
            validatorMaxWorkDays: '',
            role: '',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        // if (role === 'ROLE_SUPERVISOR') {
        //     actor = await ApiServices.Get(`/supervisor`);
        //     businessName = actor.business.business_name;
        // } else if (role === 'ROLE_HR') {
        //     actor = await ApiServices.Get(`/business/getBusiness`);
        //     businessName = actor.business_name;
        // }
        var param = window.location.href.split("/").pop();
        var needId = param.split('~');
        const report = await ApiServices.Get(`/supervisor/getEvaluation?id=${needId[0]}`);
        let owner = await ApiServices.Get(`/supervisor/business?email=${report.supervisor_email}`);
        let businessName = '';
        if (owner !== null) {
            businessName = owner.business_name;
        } else {
            owner = await ApiServices.Get("/business/getBusiness");
            businessName = owner.business_name;
        }
        const student = await ApiServices.Get(`/student/student/${needId[1]}`);
        let title = '';
        title = report.title;
        const reportId = needId[0];
        // console.log("reportID" + reportId);

        const timeStart = report.timeStart;
        const timeEnd = report.timeEnd;
        const remark = report.remark;
        const project_name = report.project_name;
        const score_discipline = report.score_discipline;
        const score_activity = report.score_activity;
        const score_work = report.score_work;
        const workDays = report.workDays;
        let onScore = 5;
        if (((report.score_work + report.score_activity + report.score_discipline) / 3) > 9) {
            onScore = 0;
        } else if (((report.score_work + report.score_activity + report.score_discipline) / 3) > 8) {
            onScore = 1;
        } else if (((report.score_work + report.score_activity + report.score_discipline) / 3) > 7) {
            onScore = 2;
        } else if (((report.score_work + report.score_activity + report.score_discipline) / 3) >= 5) {
            onScore = 3;
        } else {
            onScore = 4;
        }

        let formatTimeStartShow = report.timeStart.split('-');
        let formatTimeEndShow = report.timeEnd.split('-');
        let onScreenStartDate = formatTimeStartShow[2] + "/" + formatTimeStartShow[1] + "/" + formatTimeStartShow[0];
        let onScreenEndDate = formatTimeEndShow[2] + "/" + formatTimeEndShow[1] + "/" + formatTimeEndShow[0];
        let mm31 = [1, 3, 5, 7, 8, 10, 12];
        let mm30 = [4, 6, 9, 11];

        let maxWorkDays = 0;
        if (mm30.includes(parseInt(formatTimeStartShow[1]))) {
            maxWorkDays = 30 - parseInt(formatTimeStartShow[2]) + parseInt(formatTimeEndShow[2]);
        } else if (mm31.includes(parseInt(formatTimeStartShow[1]))) {
            maxWorkDays = 31 - parseInt(formatTimeStartShow[2]) + parseInt(formatTimeEndShow[2]);
        } else if (parseInt(formatTimeStartShow[1]) === 2) {
            if (parseInt(formatTimeStartShow[0]) % 4 === 0) {
                maxWorkDays = 29 - parseInt(formatTimeStartShow[2]) + parseInt(formatTimeEndShow[2]);
            } else {
                maxWorkDays = 28 - parseInt(formatTimeStartShow[2]) + parseInt(formatTimeEndShow[2]);
            }
        }
        console.log(maxWorkDays);

        this.setState({
            loading: false,
            id: needId[0],
            needId: needId,
            reportId: reportId,
            title: title,
            student: student,
            businessName: businessName,
            maxWorkDays: maxWorkDays,

            timeStart: timeStart,
            timeEnd: timeEnd,
            remark: remark,
            score_work: score_work,
            score_activity: score_activity,
            score_discipline: score_discipline,
            project_name: project_name,
            onScore: onScore,
            onScreenStartDate: onScreenStartDate,
            onScreenEndDate: onScreenEndDate,
            workDays: workDays,
            role: role,
        });
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
            let tmpScore = parseFloat((parseFloat(score_discipline) + parseFloat(score_activity) + parseFloat(score_activity)) / 3);
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
        const { title, remark, score_discipline, score_work, score_activity, project_name, needId, id, timeStart, timeEnd, workDays, maxWorkDays } = this.state;
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
                    validatorNumRange_score_work = 'Điểm hiệu quả công việc không hợp lệ.';
                }
                if (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) {
                    validatorNumRange_score_activity = 'Điểm thái độ làm việc không hợp lệ';
                }
                if (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10) {
                    validatorNumRange_score_discipline = 'Điểm kỷ luật không hợp lệ';
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
                const reportId = parseInt(this.state.reportId);
                const evaluation = {
                    id,
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
                const result = await ApiServices.Put(`/supervisor/updateEvaluation?id=${reportId}`, evaluation);
                console.log(result);
                // console.log(emailStudent);
                console.log(evaluation);
                if (result.status === 200) {
                    Toastify.actionSuccess("Cập nhật đánh giá tháng thành công!");
                    setTimeout(
                        function () {
                            if (this.state.role === "ROLE_SUPERVISOR") {
                                this.props.history.push(`/supervisor/Report/Report_Detail/${needId[0]}~${needId[1]}`);
                            }
                            if (this.state.role === "ROLE_HR") {
                                this.props.history.push(`/hr/Report/Report_Detail/${needId[0]}~${needId[1]}`);
                            }
                        }
                            .bind(this),
                        2000
                    );

                } else {
                    Toastify.actionFail("Cập nhật đánh giá tháng thất bại!");
                    this.setState({
                        loading: false
                    })
                    // console.log(result);
                    // console.log(evaluation);
                }
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { maxWorkDays, validatorMaxWorkDays, needId, validatorNumRange_score_work, validatorNumRange_score_activity, validatorNumRange_score_discipline, loading, reportColor, rate, title, student, businessName, score_work, score_activity, score_discipline, remark, project_name, onScreenStartDate, onScreenEndDate, onScore, workDays } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>{title}
                                    </CardHeader>
                                    <CardBody>
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
                                                <Badge className="mr-1" color="primary" pill style={{ fontSize: "16px" }}>{onScreenStartDate === null ? "" : onScreenStartDate}</Badge>
                                            </Col>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày kết thúc:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Badge className="mr-1" color="danger" pill style={{ fontSize: "16px" }}>{onScreenEndDate === null ? "" : onScreenEndDate}</Badge>
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
                                                <Input value={score_work} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_work" name="score_work" min="0" max="10"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm hiệu quả công việc', score_work, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_work}
                                                </span>
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
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-3">
                                        <Row style={{ marginLeft: "21%" }}>
                                            <Col xs="4" sm="4">
                                                {needId === null ? (<></>) :
                                                    (this.state.role === "ROLE_SUPERVISOR" ?
                                                        <Button block color="danger" onClick={() => this.handleDirect(`/supervisor/Report/Report_Detail/${needId[0]}~${needId[1]}`)}>
                                                            Huỷ bỏ
                                                        </Button> :
                                                        <Button block color="danger" onClick={() => this.handleDirect(`/hr/Report/Report_Detail/${needId[0]}~${needId[1]}`)}>
                                                            Huỷ bỏ
                                                        </Button>
                                                    )
                                                }
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button block color="primary" onClick={() => this.handleSubmit()}>
                                                    Cập nhật
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

export default Update_Report;
