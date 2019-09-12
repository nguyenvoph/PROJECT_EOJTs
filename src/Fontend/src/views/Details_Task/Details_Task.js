import firebase from 'firebase/app';
import 'firebase/storage';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


const storage = firebase.storage();

class Details_Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listStudentTask: [],
      loading: true
    }
  }


  async componentDidMount() {
    const email = window.location.href.split("/").pop();
    const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${email}`);

    if (listStudentTask !== null) {
      this.setState({
        listStudentTask: listStudentTask,
        loading: false
      });
    }
  }

  handleDirect = (uri) => {
    this.props.history.push(uri);
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
        <Badge color="warning">Bình thường</Badge>
      )
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

  render() {
    const { loading } = this.state;

    return (
      loading.toString() === 'true' ? (
        SpinnerLoading.showHashLoader(loading)
      ) : (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" lg="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Danh sách nhiệm vụ
                  </CardHeader>
                  <CardBody>
                    <ToastContainer />
                    <br />
                    <div style={{ marginLeft: "42%" }}>
                      <strong style={{ fontSize: "20px" }}>Danh sách nhiệm vụ</strong>
                    </div>
                    <br />
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nhiệm vụ</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Người giao</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ngày tạo</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Hạn cuối</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Mức độ</th>
                          <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ưu tiên</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.listStudentTask && this.state.listStudentTask.map((task, index) => {
                            return (
                              <tr>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>{task.title}</td>
                                <td style={{ textAlign: "center" }}>
                                  {
                                    this.showTaskState(task.status)
                                  }
                                </td>
                                <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                                <td style={{ textAlign: "center" }}>{task.time_created}</td>
                                <td style={{ textAlign: "center" }}>{task.time_end}</td>
                                <td style={{ textAlign: "center" }}>
                                  {
                                    this.showTaskLevel(task.level_task)
                                  }
                                </td>
                                <td style={{ textAlign: "center" }}>{task.priority}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                    <Pagination>
                      {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                    </Pagination>
                  </CardBody>
                  <CardFooter className="p-4">
                    <Row>
                      <Col xs="3" sm="3">
                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr/official_list")} type="submit" color="secondary" block>Trở về</Button>
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

export default Details_Task;
