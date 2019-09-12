import firebase from 'firebase/app';
import 'firebase/storage';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';


// // Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyBZRXJdcBsa3i0QXfFKsvNxWhn_1mKjmmc",
//     authDomain: "eojts-ddc9e.firebaseapp.com",
//     databaseURL: "https://eojts-ddc9e.firebaseio.com",
//     projectId: "eojts-ddc9e",
//     storageBucket: "gs://eojts-ddc9e.appspot.com",
//     messagingSenderId: "365126484633",
//     appId: "1:365126484633:web:623e362d3746d457"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();

class Account_Detail extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            image: null,
            username: '',
            logo: '',
            email: '',
            name: '',
            phone: '',
            address: '',
            loading: true,
            role: '',
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        if (token !== null) {
            const decoded = decode(token);
            const email = decoded.email;
            const role = decoded.role;
            let actor = null;
            let name = '';
            let logo = null;
            let phone = '';
            let address = '';
            if (role === "ROLE_ADMIN" || role === "ROLE_STARTUP" || role === "ROLE_HEADTRAINING" || role === "ROLE_HEADMASTER") {
                actor = await ApiServices.Get(`/admin/getCurrentUser`);
                if (actor !== null) {
                    name = actor.name;
                    logo = actor.logo;
                    phone = actor.phone;
                    address = actor.address;
                }
            } else if (role === "ROLE_SUPERVISOR") {
                let tmpActor = await ApiServices.Get(`/supervisor`);
                actor = tmpActor.supervisor;
                if (actor !== null) {
                    name = actor.name;
                    logo = actor.logo;
                    phone = actor.phone;
                    address = actor.address;
                }
            }
            this.setState({
                loading: false,
                email: email,
                logo: logo,
                name: name,
                phone: phone,
                address: address,
                role: role,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            var output = document.getElementById('img_logo');
            output.src = URL.createObjectURL(image);
            this.setState({
                image: image
            })
        }
    }

    handleReset = async () => {
        this.setState({
            email: '',
            logo: '',
            name: '',
            phone: '',
            address: '',
        })
    }

    uploadImageToFireBase = async () => {
        let { image } = this.state;

        if (image !== null) {
            const uploadTask = await storage.ref(`images/${image.name}`).put(image);
            await storage.ref('images').child(image.name).getDownloadURL().then(url => {
                this.setState({
                    logo: url
                })
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    savevProfile = async () => {
        let { logo, email, name, address, phone } = this.state;
        let role = this.state.role;
        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            var profile = {
                logo, email, name, address, phone
            }
            if (role === "ROLE_ADMIN" || role === "ROLE_STARTUP" || role === "ROLE_HEADTRAINING" || role === "ROLE_HEADMASTER") {
                const result = await ApiServices.Put('/admin/updateAdmin', profile);

                if (result.status === 200) {
                    Toastify.actionSuccess('Cập nhật thông tin thành công');
                    this.props.history.push(`/Account_Detail`);
                } else {
                    Toastify.actionFail('Cập nhật thông tin thất bại');
                    this.setState({
                        loading: false
                    })
                }
            } else if (role === "ROLE_SUPERVISOR") {
                const result = await ApiServices.Put('/supervisor/updateSupervisor', profile);

                if (result.status === 200) {
                    Toastify.actionSuccess('Cập nhật thông tin thành công');
                    this.props.history.push(`/Account_Detail`);
                } else {
                    Toastify.actionFail('Cập nhật thông tin thất bại');
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

    handleSubmit = async () => {
        await this.uploadImageToFireBase();
        await this.savevProfile();
    }

    render() {
        const { email, logo, name, phone, address, loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <ToastContainer />
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        {/* <FormGroup row>
                                            <Col md="2"> */}
                                        <h4>Thông tin tài khoản</h4>
                                        {/* </Col>
                                            <Col md="10">
                                            </Col>
                                        </FormGroup> */}
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Logo</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <img src={logo} style={{ width: "160px", height: "160px" }} onChange={this.handleInput} type="file" id="img_logo" name="logo" alt="logo" />
                                                    <br /><br />
                                                    <input onChange={this.handleChange} type="file" />
                                                    <br /><br />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Logo', logo, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Email</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label type="text" id="email" name="email">{email}</Label>
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Email', email, 'required|email')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Tên</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={name} onChange={this.handleInput} type="text" id="name" name="name" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên doanh nghiệp', name, 'required|min:7|max:50|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>SĐT</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={phone} onChange={this.handleInput} type="number" id="phone" name="phone" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Số điện thoại', phone, 'required|min:10|max:11|numeric')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6>Địa chỉ</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={address} onChange={this.handleInput} type="text" id="address" name="address" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Địa chỉ', address, 'required|min:7|max:100|alpha_num_dot_splash')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row >
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect(`/Account_Detail`)}>Trở về</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Xác nhận</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div >
                )
        );
    }
}

export default Account_Detail;
