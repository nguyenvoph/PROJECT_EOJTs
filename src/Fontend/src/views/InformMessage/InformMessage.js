import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, FormGroup, Input, Pagination, Row, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import { async } from 'q';


class InformMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            informs: null,
            searchValue: '',
            activeTab: 0,
            role: '',
            viewSent: true,

            typesOfEvent: ['Tổng', 'Chưa xem', 'Đã xem'],
            typeSelected: 0,
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let informs = null;
        let role = "";
        let activeTab = 0;
        let viewSent = true;
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
            if (role === "ROLE_ADMIN") {
                informs = await ApiServices.Get('/admin/events');
                console.log(informs);
            }
            if (role === "ROLE_HR") {
                informs = await ApiServices.Get('/business/events');
            }
            if (role === "ROLE_SUPERVISOR") {
                informs = await ApiServices.Get('/supervisor/eventsReceived');
                activeTab = 1;
                viewSent = false;
            }
        }
        if (informs !== null) {
            this.setState({
                loading: false,
                informs,
                role: role,
                activeTab: activeTab,
                viewSent: viewSent,
            });
        }
        // console.log(informs);
    }

    toggle = async (tab) => {
        const role = this.state.role;
        let informs = null;
        let viewSent = this.state.viewSent;
        if (this.state.activeTab !== tab) {
            if (tab === 0) {
                if (role === "ROLE_ADMIN") {
                    informs = await ApiServices.Get('/admin/events');
                    viewSent = true;
                }
                if (role === "ROLE_HR") {
                    informs = await ApiServices.Get('/business/events');
                    viewSent = true;
                }
            }
            if (tab === 1) {
                if (role === "ROLE_ADMIN") {
                    informs = await ApiServices.Get('/admin/eventsReceived');
                    viewSent = false;
                }
                if (role === "ROLE_HR") {
                    informs = await ApiServices.Get('/business/eventsReceived');
                    viewSent = false;
                }
            }
            this.setState({
                activeTab: tab,
                informs: informs,
                viewSent: viewSent,
                typeSelected: 0,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleInputSelect = async (event) => {
        const { name, value } = event.target;
        let typeSelected = this.state.typeSelected;
        const role = this.state.role;
        let informs = null;
        // console.log(name);
        // console.log(value);
        if (value == 0) {
            typeSelected = 0;
            if (role === "ROLE_ADMIN") {
                informs = await ApiServices.Get('/admin/eventsReceived');
            }
            if (role === "ROLE_HR") {
                informs = await ApiServices.Get('/business/eventsReceived');
            }
            if (role === "ROLE_SUPERVISOR") {
                informs = await ApiServices.Get('/supervisor/eventsReceived');
            }
        } else if (value == 1) {
            typeSelected = 1;
            if (role === "ROLE_ADMIN") {
                informs = await ApiServices.Get('/admin/eventsReceivedNotRead');
            }
            if (role === "ROLE_HR") {
                informs = await ApiServices.Get('/business/eventsReceivedNotRead');
            }
            if (role === "ROLE_SUPERVISOR") {
                informs = await ApiServices.Get('/supervisor/eventsReceivedNotRead');
            }
        } else if (value == 2) {
            typeSelected = 2;
            if (role === "ROLE_ADMIN") {
                informs = await ApiServices.Get('/admin/eventsReceivedRead');
            }
            if (role === "ROLE_HR") {
                informs = await ApiServices.Get('/business/eventsReceivedRead');
            }
            if (role === "ROLE_SUPERVISOR") {
                informs = await ApiServices.Get('/supervisor/eventsReceivedNotRead');
            }
        }
        await this.setState({
            typeSelected: typeSelected,
            informs: informs,
        })
    }

    handleDirect = async (uri) => {
        this.props.history.push(uri);
    }

    handleShowString(stringFormat) {
        if (stringFormat.length > 100) {
            var finalString = stringFormat.substr(0, 100);
            finalString += "...";
            return finalString;
        } else {
            return stringFormat;
        }
    }

    handleShowSent(studentList) {
        let informTo = '';
        for (let index = 0; index < studentList.length; index++) {
            informTo += studentList[index].email + "; ";
            if (informTo.length > 75) {
                informTo += "...";
                return informTo;
            }
        }
        return informTo;
    }

    render() {
        const { loading, searchValue, informs, activeTab, viewSent, typesOfEvent } = this.state;
        let filteredListInforms;
        if (informs !== null) {
            filteredListInforms = informs.filter(
                (inform) => {
                    if (inform.event.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return inform;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Thông báo
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.role !== "ROLE_SUPERVISOR" ?
                                            (this.state.role === "ROLE_ADMIN" ?
                                                <Row style={{ paddingLeft: '90%' }}><Button color="primary" onClick={() => this.handleDirect('/admin/InformMessage/Create_InformMessage')}>Soạn thông báo</Button></Row>
                                                :
                                                <Row style={{ paddingLeft: '90%' }}><Button color="primary" onClick={() => this.handleDirect('/hr/InformMessage/Create_InformMessage')}>Soạn thông báo</Button></Row>) :
                                            <></>
                                        }
                                        {this.state.role !== "ROLE_SUPERVISOR" ?
                                            <FormGroup row>
                                                <Col style={{ textAlign: 'right', paddingRight: "0px" }}>
                                                    {activeTab === 0 ?
                                                        <Button onClick={() => this.toggle(0)} color="primary" style={{ width: "250px", fontSize: "16px", fontWeight: 'bold' }}>Thông báo đã gửi</Button> :
                                                        <Button onClick={() => this.toggle(0)} outline color="primary" style={{ width: "250px", fontSize: "16px" }}>Thông báo đã gửi</Button>
                                                    }
                                                </Col>
                                                <Col style={{ textAlign: 'left', paddingLeft: "0px" }}>
                                                    {activeTab === 1 ?
                                                        <Button onClick={() => this.toggle(1)} color="primary" style={{ width: "250px", fontSize: "16px", fontWeight: 'bold' }}>Thông báo đã nhận</Button> :
                                                        <Button onClick={() => this.toggle(1)} outline color="primary" style={{ width: "250px", fontSize: "16px" }}>Thông báo đã nhận</Button>
                                                    }
                                                </Col>
                                            </FormGroup>
                                            : <></>
                                        }
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                                {viewSent === false ?
                                                    <div style={{ marginRight: "4px" }}>
                                                        <Input style={{ width: '150px' }} onChange={e => { this.handleInputSelect(e) }} type="select" name="typeEvent">
                                                            {typesOfEvent && typesOfEvent.map((typeEvent, i) => {
                                                                return (
                                                                    <option value={i} selected={i === this.state.typeSelected}>{typeEvent}</option>
                                                                )
                                                            })}
                                                        </Input>
                                                    </div> : <></>
                                                }
                                            </nav>
                                            <TabContent activeTab={this.state.activeTab} style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                                <TabPane tabId={0}>
                                                    <ListGroup>
                                                        {filteredListInforms && filteredListInforms.map((inform, index) => {
                                                            return (
                                                                this.state.role === "ROLE_ADMIN" ?
                                                                    <ListGroupItem style={{ cursor: 'pointer' }} tag="a" action onClick={() => this.handleDirect(`/admin/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                        <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                        <ListGroupItemText>
                                                                            &emsp;&emsp;Gửi: {this.handleShowSent(inform.studentList)}<br />
                                                                            &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                        </ListGroupItemText>
                                                                    </ListGroupItem>
                                                                    :
                                                                    <ListGroupItem style={{ cursor: 'pointer' }} tag="a" action onClick={() => this.handleDirect(`/hr/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                        <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                        <ListGroupItemText>
                                                                            &emsp;&emsp;Gửi: {this.handleShowSent(inform.studentList)}<br />
                                                                            &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                        </ListGroupItemText>
                                                                    </ListGroupItem>
                                                            )
                                                        })}
                                                    </ListGroup>
                                                </TabPane>
                                                <TabPane tabId={1}>
                                                    <ListGroup>
                                                        {filteredListInforms && filteredListInforms.map((inform, index) => {
                                                            return (
                                                                inform.event.read === false ?
                                                                    (this.state.role === "ROLE_ADMIN" ?
                                                                        <ListGroupItem tag="a" style={{ cursor: 'pointer' }} action onClick={() => this.handleDirect(`/admin/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                            <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                            <ListGroupItemText>
                                                                                &emsp;&emsp;Người gửi: {inform.studentList && inform.studentList.map((student, index) => student.email)}<br />
                                                                                &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                            </ListGroupItemText>
                                                                        </ListGroupItem> :
                                                                        <ListGroupItem tag="a" style={{ cursor: 'pointer' }} action onClick={() => this.handleDirect(`/hr/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                            <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                            <ListGroupItemText>
                                                                                &emsp;&emsp;Người gửi: {inform.studentList && inform.studentList.map((student, index) => student.email)}<br />
                                                                                &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                            </ListGroupItemText>
                                                                        </ListGroupItem>
                                                                    )
                                                                    :
                                                                    (this.state.role === "ROLE_ADMIN" ?
                                                                        <ListGroupItem tag="a" action style={{ backgroundColor: '#F0F3F5', cursor: 'pointer' }} onClick={() => this.handleDirect(`/admin/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                            <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                            <ListGroupItemText>
                                                                                &emsp;&emsp;Người gửi: {inform.studentList && inform.studentList.map((student, index) => student.email)}<br />
                                                                                &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                            </ListGroupItemText>
                                                                        </ListGroupItem> :
                                                                        (this.state.role === "ROLE_HR" ?
                                                                            <ListGroupItem tag="a" action style={{ backgroundColor: '#F0F3F5', cursor: 'pointer' }} onClick={() => this.handleDirect(`/hr/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                                <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                                <ListGroupItemText>
                                                                                    &emsp;&emsp;Người gửi: {inform.studentList && inform.studentList.map((student, index) => student.email)}<br />
                                                                                    &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                                </ListGroupItemText>
                                                                            </ListGroupItem> :
                                                                            <ListGroupItem tag="a" action style={{ backgroundColor: '#F0F3F5', cursor: 'pointer' }} onClick={() => this.handleDirect(`/supervisor/InformMessage/InformMessage_Detail/${inform.event.id}`)}>
                                                                                <ListGroupItemHeading style={{ fontWeight: 'bold' }}>Tiêu đề: {this.handleShowString(inform.event.title)}</ListGroupItemHeading>
                                                                                <ListGroupItemText>
                                                                                    &emsp;&emsp;Người gửi: {inform.studentList && inform.studentList.map((student, index) => student.email)}<br />
                                                                                    &emsp;Nội dung: {this.handleShowString(inform.event.description)}
                                                                                </ListGroupItemText>
                                                                            </ListGroupItem>
                                                                        )
                                                                    )
                                                            )
                                                        })}
                                                    </ListGroup>
                                                </TabPane>
                                            </TabContent>
                                        </div>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default InformMessage;
