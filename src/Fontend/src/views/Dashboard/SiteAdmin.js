import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import React, { Component } from 'react';
import { Bar, Doughnut, Line, Polar, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

class SiteAdmin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      line: {},
      bar: {},
      radar: {},
      polar: {},
      pie: {},
      doughnut: {},
      semesters: [],
      semesterItem: {},
      semesterItemResult: {}
    };
  }

  async componentDidMount() {
    const semesters = await ApiServices.Get('/admin/getAllSemester');
    const studentOptionPerBusiness = await ApiServices.Get('/admin/studentOptionPerBusiness');
    const studentInternPerBusiness = await ApiServices.Get('/admin/business-students');
    const statisticalEvaluations = await ApiServices.Get('/admin/statisticalEvaluations');
    const statisticalStudentIsAnswer = await ApiServices.Get('/admin/statisticalStudentIsAnswer');

    if (semesters !== null) {
      this.setState({
        semesters: semesters,
        semesterItem: semesters[semesters.length - 1],
        semesterItemResult: semesters[semesters.length - 1]
      })

      var defaultSemeter = semesters[semesters.length - 1].name;
      const statisticalStudentInSemester = await ApiServices.Get(`/admin/statisticalStudentInSemester?semesterName=${defaultSemeter}`);

      if (statisticalStudentInSemester !== null) {
        var polar = {
          datasets: [
            {
              data: statisticalStudentInSemester.countStudentByType,
              backgroundColor: [
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#E7E9ED',
                '#36A2EB',
              ],
              label: 'My dataset'
            }],
          labels: [
            'Xuất sắc',
            'Tốt',
            'Khá',
            'Trung Bình',
            'Yếu',
          ],
        }

        var pie = {
          labels: [
            'Pass',
            'Fail',
          ],
          datasets: [
            {
              data: statisticalStudentInSemester.countStudentByStatus,
              backgroundColor: [
                '#FF6384',
                '#36A2EB'
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
              ],
            }],
        }
        this.setState({
          polar: polar,
          pie: pie
        })
      }

    }

    if (studentOptionPerBusiness !== null) {
      var line = {
        labels: studentOptionPerBusiness.businessListEngName,
        datasets: [
          {
            label: 'Số lượng sinh viên',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: studentOptionPerBusiness.countStudentRegisterBusiness,
          },
        ],
      }
      this.setState({
        line: line
      });
    }

    if (studentInternPerBusiness !== null) {
      var bar = {
        labels: studentInternPerBusiness.businessListEngName,
        datasets: [
          {
            label: 'Số lượng sinh viên',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: studentInternPerBusiness.numberOfStudentInternAtBusiness
          },
        ],
      }
      this.setState({
        bar: bar
      });
    }

    if (statisticalEvaluations !== null) {
      var datasets = [];
      if (statisticalEvaluations.length > 0) {
        if (statisticalEvaluations[0] !== null) {
          console.log(statisticalEvaluations[0])
          let data1 = {
            label: 'Tháng 1',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: statisticalEvaluations[0].statisticalTypeEvaluation,
          }
          datasets.push(data1);
        }
      }
      if (statisticalEvaluations.length > 1) {
        if (statisticalEvaluations[1] !== null) {
          let data2 = {
            label: 'Tháng 2',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: statisticalEvaluations[1].statisticalTypeEvaluation,
          }
          datasets.push(data2);
        }


      }
      if (statisticalEvaluations.length > 2) {
        if (statisticalEvaluations[2] !== null) {
          let data3 = {
            label: 'Tháng 3',
            backgroundColor: '#CCFFFF',
            borderColor: '#00FFFF',
            pointBackgroundColor: '#00FFFF',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00FFFF',
            data: statisticalEvaluations[2].statisticalTypeEvaluation,
          }
          datasets.push(data3);
        }

      }
      if (statisticalEvaluations.length > 3) {
        if (statisticalEvaluations[3] !== null) {
          let data4 = {
            label: 'Tháng 4',
            backgroundColor: '#FFF68F',
            borderColor: '#CDAD00',
            pointBackgroundColor: '#CDAD00',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#CDAD00',
            data: statisticalEvaluations[3].statisticalTypeEvaluation,
          }
          datasets.push(data4);
        }
      }

      var radar = {
        labels: ['Xuất sắc', 'Tốt', 'Khá', 'Trung Bình', 'Yếu'],
        datasets: datasets
      }
      this.setState({
        radar: radar,
      });
    }

    if (statisticalStudentIsAnswer !== null) {
      var doughnut = {
        labels: [
          'Đã trả lời',
          'Chưa trả lời',
        ],
        datasets: [
          {
            data: statisticalStudentIsAnswer,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
            ],
          }],
      }
      this.setState({
        doughnut: doughnut
      });
    }

    this.setState({
      loading: false,
    });

  }

  handleInput = async (event) => {
    const { value, name } = event.target;
    const { semesters } = this.state;

    if (name.includes('statisticalStudentInSemester')) {
      await this.setState({
        semesterItem: semesters[value]
      })
      var semesterName = this.state.semesterItem.name;

      const statisticalStudentInSemester = await ApiServices.Get(`/admin/statisticalStudentInSemester?semesterName=${semesterName}`);

      if (statisticalStudentInSemester !== null) {
        var polar = {
          datasets: [
            {
              data: statisticalStudentInSemester.countStudentByType,
              backgroundColor: [
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#E7E9ED',
                '#36A2EB',
              ],
              label: 'My dataset'
            }],
          labels: [
            'Xuất sắc',
            'Tốt',
            'Khá',
            'Trung Bình',
            'Yếu',
          ],
        }

        this.setState({
          polar: polar
        })
      } else {
        var polar = {
          datasets: [
            {
              data: ['', '', '', '', ''],
              backgroundColor: [
                '#FF6384',
                '#4BC0C0',
                '#FFCE56',
                '#E7E9ED',
                '#36A2EB',
              ],
              label: 'My dataset'
            }],
          labels: [
            'Xuất sắc',
            'Tốt',
            'Khá',
            'Trung Bình',
            'Yếu',
          ],
        }

        this.setState({
          polar: polar
        })
      }
    } else if (name.includes('result')) {
      await this.setState({
        semesterItemResult: semesters[value]
      })
      var semesterName = this.state.semesterItemResult.name;

      const statisticalStudentInSemester = await ApiServices.Get(`/admin/statisticalStudentInSemester?semesterName=${semesterName}`);

      if (statisticalStudentInSemester !== null) {
        var pie = {
          labels: [
            'Pass',
            'Fail',
          ],
          datasets: [
            {
              data: statisticalStudentInSemester.countStudentByStatus,
              backgroundColor: [
                '#FF6384',
                '#36A2EB'
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
              ],
            }],
        }

        this.setState({
          pie: pie
        })
      } else {
        var pie = {
          labels: [
            'Pass',
            'Fail',
          ],
          datasets: [
            {
              data: ['', ''],
              backgroundColor: [
                '#FF6384',
                '#36A2EB'
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB'
              ],
            }],
        }

        this.setState({
          pie: pie
        })
      }
    }
  }

  render() {
    const { loading, line, bar, radar, doughnut, polar, pie, semesters, semesterItem, semesterItemResult } = this.state;
    return (
      loading.toString() === 'true' ? (
        SpinnerLoading.showHashLoader(loading)
      ) : (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <h6>Thống kê kết quả các đánh giá hàng tháng</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Radar data={radar} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <h6>Tỉ lệ sinh viên trả lời khảo sát</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Doughnut data={doughnut} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <h6>Số lượng sinh viên đăng kí nguyện vọng vào doanh nghiệp</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Line data={line} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <h6>Số lượng sinh viên đang thực tập tại doanh nghiệp</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Bar data={bar} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <FormGroup row>
                      <Col md="8">
                        <h6>Thống kê kết quả đánh giá của sinh viên qua các kì</h6>
                      </Col>
                      <Col md="3" style={{ width: "150px", marginLeft: "1%" }}>
                        <Input onChange={this.handleInput} type="select" name="statisticalStudentInSemester" style={{ width: "140px" }}>
                          {semesters && semesters.map((semester, i) => {
                            return (
                              <option value={i} selected={semesterItem.id === semester.id}>{semester.name}</option>
                            )
                          })}
                        </Input>
                      </Col>
                    </FormGroup>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Polar data={polar} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <FormGroup row>
                      <Col md="8">
                        <h6>Thống kê kết quả thực tập của sinh viên qua các kì</h6>
                      </Col>
                      <Col md="3" style={{ width: "150px", marginLeft: "1%" }}>
                        <Input onChange={this.handleInput} type="select" name="result" style={{ width: "140px" }}>
                          {semesters && semesters.map((semester, i) => {
                            return (
                              <option value={i} selected={semesterItemResult.id === semester.id}>{semester.name}</option>
                            )
                          })}
                        </Input>
                      </Col>
                    </FormGroup>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Polar data={pie} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        )
    );
  }
}

export default SiteAdmin;
