import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Label, Pagination, Row } from 'reactstrap';


class Invitation_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    //   async componentDidMount() {
    //     const products = await ApiService.Get('/product');
    //     if (products !== null) {
    //       this.setState({

    //       });
    //     }
    //   }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    // handleDelete = async (deletedId) => {
    //   const result = await ApiService.Delete(`/product/${deletedId}`, "");

    //   if (result) {
    //     // do something
    //   } else {

    //   }

    // }

    //   handleUpdateDiscontinued = async (id, discontinued) => {
    //     const result = await ApiService.Put(`/product/discontinued/${id}/${discontinued}`, "");
    //     const products = await ApiService.Get('/product');
    //     if (products !== null) {
    //       const { currentPage } = this.state;
    //       const pageNumber = getPaginationPageNumber(products.length);
    //       const productsPagination = products.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
    //       this.setState({
    //         products,
    //         pageNumber,
    //         productsPagination,
    //       });
    //     }

    //     if (result) {
    //       // do something
    //       Toastify.querySuccess("Update Status Successfully!");
    //     } else {
    //       Toastify.queryFail("Update Status Fail!");
    //     }

    //   }


    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Chi tiết lời mời
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Họ và tên</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">DUCNH</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>MSSV</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">SE62389</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Chuyên ngành</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">SE</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Học kỳ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">9</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Kỹ năng</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">ReactJS, Spring Boot</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Phản hồi từ sinh viên</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <h4 id="" name="">Đồng ý</h4>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Chọn công ty là nguyện vọng số</h6>
                                        </Col>
                                        <Col xs="12" md="6">
                                            <h4 id="" name="">1</h4>
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
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr/invitation")} type="submit" color="secondary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Invitation_Detail;
