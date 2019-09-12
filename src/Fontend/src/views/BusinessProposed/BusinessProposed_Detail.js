import decode from 'jwt-decode';
import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';
import * as jsPDF from 'jspdf';
import ReactToPrint from "react-to-print";

class BusinessProposed_Detail extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            business: null,
            open: false,
            comment: '',
            id: '',
            status: '',
            role: '',
            success: false,
            danger: false
        };
    }

    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const business = await ApiServices.Get(`/heading/id?id=${id}`);

        const token = localStorage.getItem('id_token');
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }

        if (business !== null) {
            this.setState({
                loading: false,
                open: false,
                business: business,
                id: business.id,
                role: role
            });
        }

        console.log(role);

        // if (role === 'ROLE_STARTUP') {
        //     if (business.isAcceptedByHeadOfTraining !== 'PENDING') {
        //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
        //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
        //     } else if (business.isAcceptedByStartupRoom === 'ACCEPTED') {
        //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
        //     } else if (business.isAcceptedByStartupRoom === 'REJECTED') {
        //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
        //     }
        // } else if (role === 'ROLE_HEADTRAINING') {
        //     if (business.isAcceptedByHeadMaster !== 'PENDING') {
        //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
        //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
        //     } else if (business.isAcceptedByHeadOfTraining === 'ACCEPTED') {
        //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
        //     } else if (business.isAcceptedByHeadOfTraining === 'REJECTED') {
        //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
        //     }
        // }
        // else if (role === 'ROLE_HEADMASTER') {
        //     if (business.isAcceptedByHeadMaster === 'ACCEPTED') {
        //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
        //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
        //     } else if (business.isAcceptedByHeadMaster === 'REJECTED') {
        //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
        //     }
        // }

        if (role === 'ROLE_ADMIN') {
            if (business.isAcceptedByAdmin === 'ACCEPTED') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            } else if (business.isAcceptedByAdmin === 'REJECTED') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            }
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    showStatus(status, role) {
        // if (status === 'ACCEPTED' && role === 'Startup') {
        //     return (
        //         <div style={{ marginLeft: "43%" }}>
        //             <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
        //         </div>
        //     )
        // } else if (status === 'REJECTED' && role === 'Startup') {
        //     return (
        //         <div style={{ marginLeft: "43%" }}>
        //             <Badge color="danger" style={{ marginLeft: "8%" }}>BỊ TỪ CHỐI</Badge>
        //         </div>
        //     )
        // } else if (status === 'PENDING' && role === 'Startup') {
        //     return (
        //         <div style={{ marginLeft: "40%" }}>
        //             <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
        //         </div>
        //     )
        // } else if (status === 'ACCEPTED' && role === 'Training') {
        //     return (
        //         <div style={{ marginLeft: "48%" }}>
        //             <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
        //         </div>
        //     )
        // } else if (status === 'REJECTED' && role === 'Training') {
        //     return (
        //         <div style={{ marginLeft: "48%" }}>
        //             <Badge color="danger" style={{ marginLeft: "8%" }}>BỊ TỪ CHỐI</Badge>
        //         </div>
        //     )
        // } else if (status === 'PENDING' && role === 'Training') {
        //     return (
        //         <div style={{ marginLeft: "45%" }}>
        //             <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
        //         </div>
        //     )
        // } else if (status === 'ACCEPTED' && role === 'Master') {
        //     return (
        //         <div style={{ marginLeft: "59%" }}>
        //             <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
        //         </div>
        //     )
        // } else if (status === 'REJECTED' && role === 'Master') {
        //     return (
        //         <div style={{ marginLeft: "61%" }}>
        //             <Badge color="danger">BỊ TỪ CHỐI</Badge>
        //         </div>
        //     )
        // } else if (status === 'PENDING' && role === 'Master') {
        //     return (
        //         <div style={{ marginLeft: "58%" }}>
        //             <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
        //         </div>
        //     )
        // }

        if (status === 'ACCEPTED' && role === 'ROLE_ADMIN') {
            return (
                <div style={{ marginLeft: "60%" }}>
                    <Badge color="success" style={{ marginLeft: "8%" }}>CHẤP NHẬN</Badge>
                </div>
            )
        } else if (status === 'REJECTED' && role === 'ROLE_ADMIN') {
            return (
                <div style={{ marginLeft: "60%" }}>
                    <Badge color="danger" style={{ marginLeft: "8%" }}>TỪ CHỐI</Badge>
                </div>
            )
        } else if (status === 'PENDING' && role === 'ROLE_ADMIN') {
            return (
                <div style={{ marginLeft: "60%" }}>
                    <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
                </div>
            )
        }
    }

    handleConfirm = () => {
        const { status, business, role } = this.state;
        let message = '';

        if (this.validator.allValid() || (role === 'ROLE_ADMIN' && status)) {
            if (status) {
                this.setState({
                    success: false
                })
                message = `Bạn chắc chắn muốn "XÉT DUYỆT" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
            } else {
                this.setState({
                    danger: false
                })
                message = `Bạn chắc chắn muốn "TỪ CHỐI" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
            }
            // this.closePopup();
            confirmAlert({
                title: 'Xác nhận',
                message: message,
                buttons: [
                    {
                        label: 'Đồng ý',
                        onClick: () => this.handleSubmit()
                    },
                    {
                        label: 'Hủy bỏ',
                    }
                ]
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };

    // handleConfirmMaster = (status) => {
    //     this.setState({
    //         status: status
    //     })
    //     const { business } = this.state;
    //     let message = '';
    //     if (status) {
    //         message = `Bạn chắc chắn muốn "XÉT DUYỆT" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
    //     } else {
    //         message = `Bạn chắc chắn muốn "TỪ CHỐI" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
    //     }

    //     // this.closePopup();
    //     confirmAlert({
    //         title: 'Xác nhận',
    //         message: message,
    //         buttons: [
    //             {
    //                 label: 'Đồng ý',
    //                 onClick: () => this.handleSubmit()
    //             },
    //             {
    //                 label: 'Hủy bỏ',
    //             }
    //         ]
    //     });
    // };

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleSubmit = async () => {
        const { comment, id, status, role } = this.state;
        let result = {};

        let messageSucces = '', messageFail = '';
        if (status) {
            messageSucces = "Phê duyệt đề xuất thành công!";
            messageFail = "Phê duyệt đề xuất thất bại!";
        } else {
            messageSucces = "Từ chối đề xuất thành công!";
            messageFail = "Từ chối đề xuất thất bại!";
        }

        console.log(id + ' - ' + comment + ' - ' + status);

        this.setState({
            loading: true
        })

        // if (role === 'ROLE_STARTUP') {
        //     result = await ApiServices.Put(`/heading/startup?id=${id}&comment=${comment}&status=${status}`);
        // } else if (role === 'ROLE_HEADTRAINING') {
        //     result = await ApiServices.Put(`/heading/headTraining?id=${id}&comment=${comment}&status=${status}`);
        // } else if (role === 'ROLE_HEADMASTER') {
        //     result = await ApiServices.Put(`/heading/headMaster?id=${id}&comment=${comment}&status=${status}`);
        // }

        if (role === 'ROLE_ADMIN') {
            result = await ApiServices.Put(`/heading/admin?id=${id}&comment=${comment}&status=${status}`);
        }

        if (result.status === 200) {
            Toastify.actionSuccess(messageSucces);
            this.setState({
                loading: false
            })

            const business = await ApiServices.Get(`/heading/id?id=${id}`);

            if (business !== null) {
                this.setState({
                    loading: false,
                    open: false,
                    business: business,
                    id: business.id
                });
            }

            // if (role === 'ROLE_STARTUP') {
            //     if (business.isAcceptedByStartupRoom === 'ACCEPTED') {
            //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
            //     } else if (business.isAcceptedByStartupRoom === 'REJECTED') {
            //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
            //     }
            // } else if (role === 'ROLE_HEADTRAINING') {
            //     if (business.isAcceptedByHeadOfTraining === 'ACCEPTED') {
            //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
            //     } else if (business.isAcceptedByHeadOfTraining === 'REJECTED') {
            //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
            //     }
            // }
            // else if (role === 'ROLE_HEADMASTER') {
            //     if (business.isAcceptedByHeadMaster === 'ACCEPTED') {
            //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
            //         document.getElementById('btnApprove').setAttribute("disabled", "disabled");
            //     } else if (business.isAcceptedByHeadMaster === 'REJECTED') {
            //         document.getElementById('btnReject').setAttribute("disabled", "disabled");
            //     }
            // }

            if (role === 'ROLE_ADMIN') {
                if (business.isAcceptedByAdmin === 'ACCEPTED') {
                    document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                    document.getElementById('btnReject').setAttribute("disabled", "disabled");
                } else if (business.isAcceptedByAdmin === 'REJECTED') {
                    document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                    document.getElementById('btnReject').setAttribute("disabled", "disabled");
                }
            }
        } else {
            Toastify.actionFail(messageFail);
            this.setState({
                loading: false
            })
        }
    }

    toggleSuccess = (status) => {
        this.setState({
            success: !this.state.success,
            status: status
        });
    }

    toggleDanger = (status) => {
        this.setState({
            danger: !this.state.danger,
            status: status
        });
    }

    render() {
        const { business, loading, role, urlImage } = this.state;
        let linkDownContact = '';
        if (business !== null) {
            linkDownContact = `http://localhost:8000/api/file/downloadFile/${business.contactLink}`;
        }
        console.log(urlImage);
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn" id="divPDF">
                        <ToastContainer />
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <h4>Thông tin công ty đề xuất</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <div style={{ paddingLeft: "3%", paddingRight: "3%", textAlign: "center" }}>
                                                <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" width="675px" height="148px" />
                                                <br /><br /><br />
                                                <h2 style={{ fontWeight: "bold" }}>PHIẾU ĐĂNG KÍ THỰC TẬP CÔNG TY NGOÀI DANH SÁCH</h2>
                                            </div>
                                            <br />
                                            <hr />
                                            <div style={{ paddingLeft: "2%", paddingRight: "2%", paddingTop: "15px" }}>
                                                <FormGroup row>
                                                    <Col md="4">
                                                        <h3 style={{ fontWeight: "bold" }}>Thông tin sinh viên đề xuất</h3>
                                                        <br />
                                                    </Col>
                                                    <Col xs="12" md="4">
                                                    </Col>
                                                    <Col md="4">
                                                        {
                                                            business.contactLink && business.contactLink ?
                                                                (<Col xs="12" md="10">
                                                                    <a href={linkDownContact} download><h4>Tải ảnh hợp đồng</h4></a>
                                                                </Col>)
                                                                :
                                                                (
                                                                    <Col xs="12" md="10">

                                                                    </Col>)
                                                        }
                                                    </Col>
                                                </FormGroup>
                                                <hr />
                                                {/* <FormGroup row>
                                                    <h3 style={{ fontWeight: "bold" }}>Thông tin sinh viên đề xuất</h3>
                                                    <hr />
                                                    <br />
                                                </FormGroup> */}
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Họ và tên:</h6>
                                                    </Col>
                                                    <Col xs="12" md="6">
                                                        <Label>{business.student_proposed.name}</Label>
                                                    </Col>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Mã số sinh viên:</h6>
                                                    </Col>
                                                    <Col xs="12" md="2">
                                                        <Label>{business.student_proposed.code}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Ngành:</h6>
                                                    </Col>
                                                    <Col xs="12" md="6">
                                                        <Label>{business.student_proposed.specialized.name}</Label>
                                                    </Col>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>GPA:</h6>
                                                    </Col>
                                                    <Col xs="12" md="2">
                                                        <Label>{business.student_proposed.gpa}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Email:</h6>
                                                    </Col>
                                                    <Col xs="12" md="6">
                                                        <Label>{business.student_proposed.email}</Label>
                                                    </Col>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                    </Col>
                                                    <Col xs="12" md="2">
                                                        <Label>{business.student_proposed.phone}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <br />
                                                <hr />
                                                <FormGroup>
                                                    <h3 style={{ fontWeight: "bold" }}>Thông tin doanh nghiệp được đề xuất</h3>
                                                    <hr />
                                                    <br />
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Tên công ty thực tập:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_name}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Email:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.email}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_phone}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Địa chỉ:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_address}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Mô tả doanh nghiệp:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label dangerouslySetInnerHTML={{ __html: business.business_overview }} />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Quy mô doanh nghiệp</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.scale}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Lĩnh vực hoạt động</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_field_of_activity}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Quốc tịch công ty</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_nationality}</Label>
                                                    </Col>
                                                </FormGroup>
                                            </div>
                                            <br />
                                            <hr />
                                            <FormGroup>
                                                <h3 style={{ fontWeight: "bold" }}>Ý kiến của nhà trường</h3>
                                                <hr />
                                                <br />
                                            </FormGroup>
                                            {
                                                business.isAcceptedByAdmin === 'PENDING' ? (
                                                    <div>
                                                        <FormGroup row>
                                                            <Col md="6">
                                                                <h5 style={{ fontWeight: "bold", marginLeft: "30%" }}>Ý kiến của phòng khởi nghiệp</h5>
                                                            </Col>
                                                            <Col xs="12" md="4">
                                                                <h5 style={{ fontWeight: "bold", marginLeft: "30%" }}>Ý kiến của phòng đào tạo</h5>
                                                            </Col>
                                                        </FormGroup>
                                                        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
                                                        <FormGroup row>
                                                            <Col md="9">
                                                                <h5 style={{ fontWeight: "bold", marginLeft: "50%" }}>Phê duyệt của ban giám hiệu</h5>
                                                            </Col>
                                                        </FormGroup>
                                                        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
                                                    </div>
                                                ) : (
                                                        <div>
                                                            <FormGroup row>
                                                                <Col md="9">
                                                                    {
                                                                        this.showStatus(business.isAcceptedByAdmin, "ROLE_ADMIN")
                                                                    }
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <Col md="9">
                                                                    <div style={{ marginLeft: "31%", textAlign: "center" }}>
                                                                        {
                                                                            business.isAcceptedByAdmin !== 'PENDING' ? (
                                                                                <label style={{ width: "540px" }}>{business.commentAdmin}</label>
                                                                            ) : (
                                                                                    <label style={{ width: "300px" }}></label>
                                                                                )
                                                                        }
                                                                    </div>
                                                                </Col>
                                                            </FormGroup>
                                                        </div>
                                                    )
                                            }


                                            {/* <FormGroup row>
                                                <Col md="6">
                                                    <div style={{ marginLeft: "8%", textAlign: "center" }}>
                                                        {
                                                            business.isAcceptedByStartupRoom !== 'PENDING' ? (
                                                                <label style={{ width: "300px" }}>{business.commentStartupRoom}</label>
                                                            ) : (
                                                                    <label style={{ width: "300px" }}></label>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div style={{ marginLeft: "20%", textAlign: "center" }}>
                                                        {
                                                            business.isAcceptedByHeadOfTraining !== 'PENDING' ? (
                                                                <label style={{ width: "300px" }}>{business.commentHeadOfTraining}</label>
                                                            ) : (
                                                                    <label style={{ width: "300px" }}></label>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                            </FormGroup> */}

                                            {/* <FormGroup row>
                                                <Col md="9">
                                                    {
                                                        this.showStatus(business.isAcceptedByHeadMaster, "Master")
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="9">
                                                    <div style={{ marginLeft: "31%", textAlign: "center" }}>
                                                        {
                                                            business.isAcceptedByHeadMaster !== 'PENDING' ? (
                                                                <label style={{ width: "300px" }}>{business.commentHeadOfMaster}</label>
                                                            ) : (
                                                                    <label style={{ width: "300px" }}></label>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                            </FormGroup> */}
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button block color="secondary" block onClick={() => this.handleDirect("/admin/business-proposed")}>Trở về</Button>
                                            </Col>
                                            {
                                                (role === 'ROLE_ADMIN' && business.isAcceptedByAdmin === 'PENDING') ? (
                                                    <Col xs="3" sm="3">
                                                        <Button id="btnUpdate" type="submit" block color="primary" onClick={() => this.handleDirect(`/admin/business-proposed/update/${business.id}`)}>Chỉnh sửa</Button>
                                                    </Col>
                                                ) : (
                                                        <Col xs="3" sm="3">
                                                            <Button disabled id="btnUpdate" type="submit" block color="primary" onClick={() => this.handleDirect(`/admin/business-proposed/update/${business.id}`)}>Chỉnh sửa</Button>
                                                        </Col>
                                                    )
                                            }
                                            {/* {
                                                (role === 'ROLE_STARTUP' && business.isAcceptedByStartupRoom === 'PENDING') ? (
                                                    <Col xs="3" sm="3">
                                                        <Button id="btnUpdate" type="submit" block color="primary" onClick={() => this.handleDirect(`/admin/business-proposed/update/${business.id}`)}>Chỉnh sửa</Button>
                                                    </Col>
                                                ) : (
                                                        (role === 'ROLE_STARTUP' && business.isAcceptedByStartupRoom !== 'PENDING') ? (
                                                            <Col xs="3" sm="3">
                                                                <Button disabled id="btnUpdate" type="submit" block color="primary" onClick={() => this.handleDirect(`/supervisor/hr-task/update/`)}>Chỉnh sửa</Button>
                                                            </Col>
                                                        ) : (
                                                               <></>
                                                            )
                                                    )
                                            } */}
                                            <Col xs="3" sm="3">
                                                {/* {
                                                    role === 'ROLE_HEADMASTER' ? (
                                                        <Button id="btnReject" color="danger" block onClick={() => this.handleConfirmMaster(false)}>Từ chối</Button>
                                                    ) : (
                                                            <Button id="btnReject" color="danger" block onClick={() => this.openPopUp(false)}>Từ chối</Button>
                                                        )
                                                } */}
                                                <Button id="btnReject" color="danger" block onClick={() => this.toggleDanger(false)}>Từ chối</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                {/* {
                                                    role === 'ROLE_HEADMASTER' ? (
                                                        <Button id="btnApprove" onClick={() => this.handleConfirmMaster(true)} type="submit" color="primary" block>Phê duyệt</Button>
                                                    ) : (
                                                            <Button id="btnApprove" onClick={() => this.openPopUp(true)} type="submit" color="primary" block>Phê duyệt</Button>
                                                        )
                                                } */}
                                                <Button id="btnApprove" onClick={() => this.toggleSuccess(true)} type="submit" color="success" block>Phê duyệt</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                            {/* <Popup
                                open={this.state.open}
                                closeOnDocumentClick
                                onClose={this.closePopup}>
                                <div className="TabContent" style={{ width: "max" }}>
                                    <Button className="close" onClick={this.closePopup} >
                                        &times;
                                    </Button>
                                    <br /><br />
                                    <Card>
                                        <CardHeader>
                                            <h4 style={{ textAlign: "center", fontWeight: "bold" }}>Nhận xét - đánh giá về doanh nghiệp</h4>
                                        </CardHeader>
                                        <FormGroup row>
                                            <Col xs="12" md="12">
                                                <Input value={this.state.comment} type="textarea" rows="5" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="comment" name="comment" />
                                            </Col>
                                            <span style={{ marginLeft: "3%" }} className="form-error is-visible text-danger">
                                                {this.validator.message('Nhận xét - đánh giá', this.state.comment, 'required|max:255')}
                                            </span>
                                        </FormGroup>
                                        <CardFooter>
                                            <Row style={{ marginLeft: "30%" }}>
                                                <Col xs="4" sm="4">
                                                    <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Xác nhận</Button>
                                                </Col>
                                                <Col xs="4" sm="4">
                                                    <Button color="danger" block onClick={this.closePopup}>Hủy bỏ</Button>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </Popup> */}
                            <Modal isOpen={this.state.success} toggle={this.toggleSuccess}
                                className={'modal-success ' + this.props.className}>
                                <ModalHeader toggle={this.toggleSuccess}>Nhận xét - Đánh giá về doanh nghiệp</ModalHeader>
                                <ModalBody>
                                    <FormGroup row>
                                        <Col xs="12" md="12">
                                            <Input value={this.state.comment} type="textarea" rows="5" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="comment" name="comment" />
                                        </Col>
                                        <span style={{ marginLeft: "3%" }} className="form-error is-visible text-danger">
                                            {this.validator.message('Nhận xét - đánh giá', this.state.comment, 'required|max:255')}
                                        </span>
                                    </FormGroup>
                                </ModalBody>
                                <CardFooter className="p-3">
                                    <Row style={{ marginLeft: "21%" }}>
                                        <Col xs="4" sm="4">
                                            <Button block color="danger" onClick={this.toggleSuccess}>Hủy bỏ</Button>
                                        </Col>
                                        <Col xs="4" sm="4">
                                            <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Xác nhận</Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Modal>

                            <Modal isOpen={this.state.danger} toggle={this.toggleDanger}
                                className={'modal-danger ' + this.props.className}>
                                <ModalHeader toggle={this.toggleDanger}>Nhận xét - Đánh giá về doanh nghiệp</ModalHeader>
                                <ModalBody>
                                    <FormGroup row>
                                        <Col xs="12" md="12">
                                            <Input value={this.state.comment} type="textarea" rows="5" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="comment" name="comment" />
                                        </Col>
                                        <span style={{ marginLeft: "3%" }} className="form-error is-visible text-danger">
                                            {this.validator.message('Nhận xét - đánh giá', this.state.comment, 'required|max:255')}
                                        </span>
                                    </FormGroup>
                                </ModalBody>
                                <CardFooter className="p-3">
                                    <Row style={{ marginLeft: "21%" }}>
                                        <Col xs="4" sm="4">
                                            <Button block color="danger" onClick={this.toggleDanger}>Hủy bỏ</Button>
                                        </Col>
                                        <Col xs="4" sm="4">
                                            <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Xác nhận</Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Modal>
                        </Row>
                    </div >
                )
        );
    }
}

class Example extends React.Component {
    render() {
        return (
            <div>
                <ReactToPrint
                    trigger={() => <Button color="primary">Tải phiếu đăng kí thực tập</Button>}
                    content={() => this.componentRef}
                />
                <BusinessProposed_Detail urlImage="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" ref={el => (this.componentRef = el)} />
            </div>
        );
    }
}

export default Example;
