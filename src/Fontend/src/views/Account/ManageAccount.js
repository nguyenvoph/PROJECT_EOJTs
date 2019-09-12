import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Input, Pagination, Label, FormGroup } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class ManageAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supervisors: [],
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,

            numOfSupervisor: 0,
            searchingList: [],
            isSearching: false,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (email, status) => {
        const result = await ApiServices.Put(`/business/updateStatus?email=${email}&isActive=${status}`);
        const { currentPage, rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                pageNumber: supervisors.pageNumber,
                loading: false
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const numOfSupervisor = await ApiServices.Get(`/business/searchSupervisorABusinessAllFields?valueSearch=${""}`);
        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                pageNumber: supervisors.pageNumber,
                loading: false,
                numOfSupervisor: numOfSupervisor.length,
            });
        }
    }

    handleConfirm = (supervisorEmail, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} tài khoản '${supervisorEmail}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(supervisorEmail, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage: 0,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handleInputSearch = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const supervisors = await ApiServices.Get(`/business/searchSupervisorABusinessAllFields?valueSearch=${value.substr(0, 20)}`);
            // console.log(supervisors);
            if (supervisors !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingList: supervisors,
                    isSearching: true,
                })
            }
        }
    }

    render() {
        const { supervisors, loading, pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfSupervisor, isSearching, searchingList } = this.state;
        console.log(searchingList);
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách tài khoản Supervisor
                                    </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/account/create')}>Tạo tài khoản mới</Button>
                                        <br /><br /><br />
                                        <nav className="navbar navbar-light bg-light justify-content-between">
                                            <form className="form-inline">
                                                <input onChange={this.handleInputSearch} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                            </form>
                                        </nav>
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Họ Tên</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>SĐT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Địa chỉ</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isSearching === false ?
                                                    (
                                                        supervisors && supervisors.map((supervisor, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + i + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.email}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.name}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.phone}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.address}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {supervisor.active.toString() === 'true' ? (
                                                                            <Badge color="success">KÍCH HOẠT</Badge>
                                                                        ) : (
                                                                                <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                            )}
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {supervisor.active.toString() === 'true' ? (
                                                                            <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(supervisor.email, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                        ) : (
                                                                                <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(supervisor.email, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                            )}
                                                                        {/* <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/supervisor/update/${supervisor.id}`)}>Update</Button> */}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })) : (
                                                        searchingList && searchingList.map((supervisor, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.email}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.name}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.phone}</td>
                                                                    <td style={{ textAlign: "center" }}>{supervisor.address}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {supervisor.active.toString() === 'true' ? (
                                                                            <Badge color="success">KÍCH HOẠT</Badge>
                                                                        ) : (
                                                                                <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                            )}
                                                                    </td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        {supervisor.active.toString() === 'true' ? (
                                                                            <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(supervisor.email, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                        ) : (
                                                                                <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(supervisor.email, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                            )}
                                                                        {/* <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/supervisor/update/${supervisor.id}`)}>Update</Button> */}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }))
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        {supervisors && supervisors!== null ? (isSearching === false ?
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Pagination>
                                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                        </Pagination>
                                                        &emsp;
                                                        <h6 style={{ marginTop: '7px' }}>Số dòng trên trang: </h6>
                                                        &nbsp;&nbsp;
                                                        <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "70px" }}>
                                                            <option value={10} selected={rowsPerPage === 10}>10</option>
                                                            <option value={20}>20</option>
                                                            <option value={50}>50</option>
                                                        </Input>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Row className="float-right">
                                                        <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + supervisors.length} trên tổng số {numOfSupervisor} kết quả</Label>
                                                    </Row>
                                                </Col>
                                            </Row> : <></>) : <></>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default ManageAccount;
