import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import React, { Component } from 'react';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

const pie = {
  labels: [
    'Red',
    'Green',
    'Yellow',
  ],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
    }],
};

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

class SiteHr extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      line: {},
      bar: {},
      radar: {},
      doughnut: {},
      countStatusTaskInMonth: [],
      countStatusTaskInMonthItem: {},
      month: []
    };
  }

  async componentDidMount() {
    const businessOptionsBySemester = await ApiServices.Get('/admin/businessOptionsBySemester');
    const studentInternAtBusiness = await ApiServices.Get('/admin/studentInternAtBusiness');
    const statisticalEvaluationsBusiness = await ApiServices.Get('/admin/statisticalEvaluationsBusiness');
    const numberStatusTaskStudent = await ApiServices.Get('/admin/numberStatusTaskStudent');

    if (businessOptionsBySemester !== null) {
      var line = {
        labels: businessOptionsBySemester.semester,
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
            data: businessOptionsBySemester.countStudentRegisterBusiness,
          },
        ],
      }
      this.setState({
        line: line
      });
    }

    if (statisticalEvaluationsBusiness !== null) {
      var datasets = [];

      if (statisticalEvaluationsBusiness.length > 0) {
        if (statisticalEvaluationsBusiness[0] !== null) {
          let data1 = {
            label: 'Tháng 1',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: statisticalEvaluationsBusiness[0].statisticalTypeEvaluation,
          }
          datasets.push(data1);
        }
      }
      if (statisticalEvaluationsBusiness.length > 1) {
        if (statisticalEvaluationsBusiness[1] !== null) {
          let data2 = {
            label: 'Tháng 2',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: statisticalEvaluationsBusiness[1].statisticalTypeEvaluation,
          }
          datasets.push(data2);
        }


      }
      if (statisticalEvaluationsBusiness.length > 2) {
        if (statisticalEvaluationsBusiness[2] !== null) {
          let data3 = {
            label: 'Tháng 3',
            backgroundColor: '#CCFFFF',
            borderColor: '#00FFFF',
            pointBackgroundColor: '#00FFFF',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00FFFF',
            data: statisticalEvaluationsBusiness[2].statisticalTypeEvaluation,
          }
          datasets.push(data3);
        }

      }
      if (statisticalEvaluationsBusiness.length > 3) {
        if (statisticalEvaluationsBusiness[3] !== null) {
          let data4 = {
            label: 'Tháng 4',
            backgroundColor: '#FFF68F',
            borderColor: '#CDAD00',
            pointBackgroundColor: '#CDAD00',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#CDAD00',
            data: statisticalEvaluationsBusiness[3].statisticalTypeEvaluation,
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

    if (studentInternAtBusiness !== null) {
      var bar = {
        labels: studentInternAtBusiness.semester,
        datasets: [
          {
            label: 'Số lượng sinh viên',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: studentInternAtBusiness.countStudentRegisterBusiness
          },
        ],
      }
      this.setState({
        bar: bar
      });
    }

    if (numberStatusTaskStudent !== null) {
      var month = [];
      var countStatusTaskInMonth = [];
      var countStatusTaskInMonthItem = {};
      var doughnut = {};
      numberStatusTaskStudent && numberStatusTaskStudent.map((data, index) => {
        if (index === 0) {
          countStatusTaskInMonthItem = data.countStatusTaskInMonth;
        }
        month.push(data.month);
        countStatusTaskInMonth.push(data.countStatusTaskInMonth);
      })
      this.setState({
        countStatusTaskInMonth: countStatusTaskInMonth,
        countStatusTaskInMonthItem: countStatusTaskInMonthItem,
        month: month,
        loading: false,
      });

      var doughnut = {
        labels: [
          'Hoàn thành',
          'Chưa hoàn thành',
          'Chưa bắt đầu'
        ],
        datasets: [
          {
            data: countStatusTaskInMonthItem,
            backgroundColor: [
              '#36A2EB',
              '#FFF68F',
              '#FF6384'
            ],
            hoverBackgroundColor: [
              '#36A2EB',
              '#FFF68F',
              '#FF6384'
            ],
          }],
      }

      this.setState({
        doughnut: doughnut
      });
      console.log("AAAAAAAAAAA", this.state.countStatusTaskInMonth);
    }
  }

  handleInput = async (event) => {
    const { value } = event.target;
    const { countStatusTaskInMonth } = this.state;
    console.log("countStatusTaskInMonth", countStatusTaskInMonth);
    console.log("countStatusTaskInMonth[value]", countStatusTaskInMonth[value]);

    if (countStatusTaskInMonth !== null) {
      await this.setState({
        countStatusTaskInMonthItem: countStatusTaskInMonth[value]
      })
    }

    console.log(this.state.countStatusTaskInMonthItem);

    var doughnut = {
      labels: [
        'Hoàn thành',
        'Chưa hoàn thành',
        'Chưa bắt đầu'
      ],
      datasets: [
        {
          data: this.state.countStatusTaskInMonthItem,
          backgroundColor: [
            '#36A2EB',
            '#FFF68F',
            '#FF6384'
          ],
          hoverBackgroundColor: [
            '#36A2EB',
            '#FFF68F',
            '#FF6384'
          ],
        }],
    }

    console.log("doughnut", doughnut.datasets[0].data);
    // console.log(countStatusTaskInMonth);
    // console.log("doughnut", this.state.doughnut.datasets[0].data);

    await this.setState({
      // countStatusTaskInMonth: countStatusTaskInMonth,
      doughnut: doughnut,
    });

    console.log("countStatusTaskInMonth", countStatusTaskInMonth);
  }


  render() {
    const { loading, line, bar, radar, doughnut, month } = this.state;
    return (
      loading.toString() === 'true' ? (
        SpinnerLoading.showHashLoader(loading)
      ) : (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <FormGroup row>
                      <Col md="8">
                        <h6>Thống kê tỉ lệ về trạng thái task của sinh viên</h6>
                      </Col>
                      <Col md="3" style={{ width: "150px", marginLeft: "1%" }}>
                        <Input onChange={this.handleInput} type="select" name="month" style={{ width: "110px" }}>
                          {month && month.map((mth, i) => {
                            return (
                              <option value={i}>{'Tháng ' + `${mth}`}</option>
                            )
                          })}
                        </Input>
                      </Col>
                    </FormGroup>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Doughnut data={doughnut} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" sm="6">
                <Card>
                  <CardHeader>
                    <h6>Thống kê các đánh giá của sinh viên thực tập tại doanh nghiệp</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Radar data={radar} options={options} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <h6>Thống kê số lượng sinh viên set nguyện vọng vào công ty qua các kì</h6>
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
                    <h6>Thống kê số lượng sinh viên được nhận thực tập tại doanh nghiệp qua các kì</h6>
                    {/* <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div> */}
                  </CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Bar data={bar} options={options} />
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

export default SiteHr;
