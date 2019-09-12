import firebase from 'firebase';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';

class User_Student_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            email: '',
            name: '',
            phone: '',
            address: '',
            code: '',
            dob: '',
            gender: 0,
            specializeds: [],
            specializedItem: {},
            gpa: '',
            semesterName: '',

            isExisted: true,
        }
    }

    async componentDidMount() {
        const specializeds = await ApiServices.Get('/specialized');
        var month = new Date().getMonth() + 1; //Current Month.
        var year = new Date().getFullYear(); //Current Year.
        // console.log(month);
        let semesterName = "";
        if (parseInt(month) === 11 || parseInt(month) === 12 || parseInt(month) === 1 || parseInt(month) === 2) {
            semesterName = "SPRING" + year;
        } else if (parseInt(month) === 3 || parseInt(month) === 4 || parseInt(month) === 5 || parseInt(month) === 6) {
            semesterName = "SUMMER" + year;
        } else if (parseInt(month) === 7 || parseInt(month) === 8 || parseInt(month) === 9 || parseInt(month) === 10) {
            semesterName = "FALL" + year;
        }
        const isExisted = await ApiServices.Get(`/admin/checkSemester?semesterName=${semesterName}`);
        if (isExisted === true) {
            if (specializeds !== null) {
                this.setState({
                    specializeds,
                    specializedItem: specializeds[0],
                    loading: false,
                    semesterName: semesterName,
                    isExisted: true,
                });
            }
        } else {
            this.setState({
                isExisted: false,
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { specializeds } = this.state;
        if (name.includes('specialized')) {
            await this.setState({
                specializedItem: specializeds[value]
            })
        } else {
            await this.setState({
                [name]: value,
            })
        }
    }


    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            email: '',
            name: '',
            phone: '',
            address: '',
            code: '',
            dob: '',
            gender: 0,
            specializedItem: this.state.specializeds[0],
            gpa: '',
            semesterName: '',
        })
    }

    handleSubmit = async () => {
        const { email, name, phone, address, code, dob, gender, specializedItem, gpa, semesterName } = this.state;
        const specialized = {
            id: specializedItem.id
        }
        const student = {
            email,
            name,
            phone,
            address,
            code,
            dob,
            gender,
            specialized,
            gpa,
            semesterName
        }

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            const result = await ApiServices.Post('/student/new', student);
            if (result.status === 201) {
                this.setState({
                    loading: false
                })
                Toastify.actionSuccess("Tạo tài khoản mới thành công!");
                setTimeout(
                    function () {
                        this.props.history.push('/admin/admin_account/studentList');
                    }
                        .bind(this),
                    2000
                );

                var currentTime = new Date();

                var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
                var date = month + '-' + currentTime.getDate() + '-' + currentTime.getFullYear();
                var time = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();

                var database = firebase.database();
                var ref = database.ref('Users');

                var usersRef = ref.child(`${code}`);
                usersRef.set({
                    userState: {
                        date: date,
                        time: time,
                        type: 'offline'
                    }
                });

            } else if (result.status === 417) {
              Toastify.actionFail("Tài khoản đã tồn tại. Vui lòng thử lại!");
            }else
             {
                Toastify.actionFail("Tạo tài khoản mới thất bại!");
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
        const { specializeds, loading, isExisted } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Tạo tài khoản mới</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="email">Email</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.email} onChange={this.handleInput} type="text" name="email" placeholder="Email" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Email', this.state.email, 'required|email')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="email">Họ và tên</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.name} onChange={this.handleInput} type="text" name="name" placeholder="Họ và tên" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Họ và tên', this.state.name, 'required|min:5|alpha_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="code">MSSV</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.code} onChange={this.handleInput} type="text" name="code" placeholder="Mã số sinh viên" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Mã số sinh viên', this.state.code, 'required|min:7|alpha_num')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="gpa">GPA</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.gpa} onChange={this.handleInput} type="number" name="gpa" placeholder="GPA" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('GPA', this.state.gpa, 'required|numberic')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="phone">SĐT</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.phone} onChange={this.handleInput} type="number" name="phone" placeholder="Số điện thoại" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Số điện thoại', this.state.phone, 'required|min:10|max:11|numeric')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="address">Địa chỉ</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.address} onChange={this.handleInput} type="text" name="address" placeholder="Địa chỉ" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Địa chỉ', this.state.address, 'required|min:7|max:100|alpha_num_dot_splash')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="dob">Ngày sinh</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.dob} onChange={this.handleInput} type="date" name="dob" placeholder="Ngày sinh" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Ngày sinh', this.state.dob, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="gender">Giới tính</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.gender} onChange={this.handleInput} type="select" name="gender">
                                                        <option value={false}>Nữ</option>
                                                        <option value={true}>Nam</option>
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="specialized">Chuyên ngành</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input onChange={this.handleInput} type="select" name="specialized">
                                                        {specializeds && specializeds.map((specialized, i) => {
                                                            return (
                                                                <option value={i} selected={this.state.specializedItem.id === i + 1}>{specialized.name}</option>
                                                            )
                                                        })}
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="semesterName">Học kì</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    {isExisted === true ?
                                                        <Input value={this.state.semesterName} onChange={this.handleInput} type="text" name="semesterName" placeholder="Học kì" readOnly /> :
                                                        <>
                                                            <Input value={this.state.semesterName} onChange={this.handleInput} type="text" name="semesterName" placeholder="Học kì" />
                                                            <span className="form-error is-visible text-danger">
                                                                {this.validator.message('Học kì', this.state.semesterName, 'required|alpha_num_space|min:8|max:10')}
                                                            </span>
                                                        </>
                                                    }
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect('/admin/admin_account/studentList')}>Trở về</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo tài khoản</Button>
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

export default User_Student_Create;
