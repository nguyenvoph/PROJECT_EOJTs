import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Label, FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Feedback_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchValue: '',
        };
    }

    async componentDidMount() {
        let feedbackId = window.location.href.split("/").pop();
        this.setState({
            loading: false,
        });
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { loading, } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Chi tiết phản hồi
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{ paddingLeft: "3%", paddingRight: "3%", textAlign: "center" }}>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" />
                                            <br /><br /><br />
                                            <h2 style={{ fontWeight: "bold" }}>PHIẾU KHẢO SÁT NƠI THỰC TẬP</h2>
                                        </div>
                                        <div style={{ paddingLeft: "2%", paddingRight: "2%", paddingTop: "10px" }}>
                                            <FormGroup>
                                                <h3 style={{ fontWeight: "bold" }}>&emsp;Thông tin cá nhân</h3>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Họ tên sinh viên:</h6>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <Label>Nguyễn Văn A</Label>
                                                </Col>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>MSSV:</h6>
                                                </Col>
                                                <Col xs="12" md="2">
                                                    <Label>SE60001</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Ngành:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label>IS</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Nơi học tập:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label>FPT University</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup>
                                                <h3 style={{ fontWeight: "bold" }}>&emsp;Thông tin nơi thực tập</h3>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Tên công ty thực tập:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label>TP Bank</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Lĩnh vực hoạt động:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label>Ngân hàng</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Địa chỉ:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label>123 abc</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Label>0901234567</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Tên người hướng dẫn:</h6>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <Label>Nguyễn Văn B</Label>
                                                </Col>
                                                <Col md="2">
                                                    <h6 style={{ fontWeight: "bold" }}>Chức vụ:</h6>
                                                </Col>
                                                <Col xs="12" md="2">
                                                    <Label>Trưởng phòng thực tập</Label>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <hr />
                                        <div style={{ paddingTop: "10px", paddingLeft: "5%", paddingRight: "5%" }}>
                                            <FormGroup>
                                                <row>
                                                    &emsp;<u><b>Câu 1:</b></u> Bạn đánh giá như thế nào về nơi thực tập
                                                </row>
                                                <row style={{ paddingTop: "20px" }}>
                                                    <br />&emsp;&emsp;Điều kiện làm việc tại công ty (Máy móc, trang thiết bị phục vụ cho công việc, nội thất văn phòng):
                                                    </row>
                                                <row>
                                                    <ListGroup>
                                                        <ListGroupItem tag="button" action>
                                                            <FormGroup check className="radio">
                                                                <Input className="form-check-input" type="radio" id="radio1" name="radios" value="Tốt" checked />
                                                                <Label check className="form-check-label" htmlFor="radio1">Tốt</Label>
                                                            </FormGroup>
                                                        </ListGroupItem>
                                                        <ListGroupItem tag="button" action>
                                                            <FormGroup check className="radio">
                                                                <Input className="form-check-input" type="radio" id="radio2" name="radios" value="Khá" />
                                                                <Label check className="form-check-label" htmlFor="radio2">Khá</Label>
                                                            </FormGroup>
                                                        </ListGroupItem>
                                                        <ListGroupItem tag="button" action>
                                                            <FormGroup check className="radio">
                                                                <Input className="form-check-input" type="radio" id="radio3" name="radios" value="Trung bình" />
                                                                <Label check className="form-check-label" htmlFor="radio3">Trung bình</Label>
                                                            </FormGroup>
                                                        </ListGroupItem>
                                                        <ListGroupItem tag="button" action>
                                                            <FormGroup check className="radio">
                                                                <Input className="form-check-input" type="radio" id="radio4" name="radios" value="Kém" />
                                                                <Label check className="form-check-label" htmlFor="radio4">Kém</Label>
                                                            </FormGroup>
                                                        </ListGroupItem>
                                                    </ListGroup>
                                                </row>
                                            </FormGroup>
                                        </div>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter>
                                        <Row>
                                            <Col xs="4" sm="4">
                                                <Button block color="secondary" onClick={() => this.handleDirect('/Feedback/Feedback')}>
                                                    Trở về
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

export default Feedback_Detail;