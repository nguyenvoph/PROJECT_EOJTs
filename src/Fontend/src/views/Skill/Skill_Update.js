import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';

class Skill_Update extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            id: '',
            name: '',
            status: '',
            specializeds: [],
            specializedItem: {},
        }
    }

    async componentDidMount() {
        const updatedId = window.location.href.split("/").pop();
        const skill = await ApiServices.Get(`/skill/id?id=${updatedId}`);
        const specializeds = await ApiServices.Get('/specialized');
        if (specializeds !== null) {
            this.setState({
                id: skill.id,
                name: skill.name,
                status: skill.status,
                specializeds,
                specializedItem: skill.specialized,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { specializeds } = this.state;
        if (name.includes('name')) {
            await this.setState({
                name: value
            })
        } else if (name.includes('specialized')) {
            await this.setState({
                specializedItem: specializeds[value]
            })
        }
    }


    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            name: '',
            specializedItem: this.state.specializeds[0],
        })
    }

    handleConfirm = () => {
        const { name, specializedItem } = this.state;
        console.log(name, specializedItem);

        if (this.validator.allValid()) {
            confirmAlert({
                title: 'Xác nhận',
                message: `Bạn chắc chắn muốn cập nhật kỹ năng '${name}' thuộc ngành '${specializedItem.name}' ?`,
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

    handleSubmit = async () => {
        const { id, name, status, specializedItem } = this.state;
        const specialized = {
            id: specializedItem.id
        }
        const skill = {
            id,
            name,
            status,
            specialized
        }
        console.log(skill);
        const result = await ApiServices.Put('/skill', skill);
        if (result.status === 200) {
            Toastify.actionSuccess("Cập nhật kỹ năng thành công!");
          setTimeout(
            function () {
              this.props.history.push('/admin/skill');
            }
              .bind(this),
            2000
          );
        } else {
            Toastify.actionFail("Cập nhật kỹ năng thất bại!");
        }
    }


    render() {
        const { specializeds, specializedItem } = this.state;
        console.log(specializedItem);
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Cập nhật kỹ năng</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="name">Tên kỹ năng</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.name} onChange={this.handleInput} type="text" id="name" name="name" placeholder="Nhập tên kỹ năng" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Tên kỹ năng', this.state.name, 'required|max:20')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="specialized">Ngành</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input onChange={this.handleInput} type="select" name="specialized">
                                                {specializeds && specializeds.map((specialized, i) => {
                                                    return (
                                                        <option key={i} value={i} selected={specialized.id === specializedItem.id}>{specialized.name}</option>
                                                    )
                                                })}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="4" sm="4">
                                        <Button color="secondary" block onClick={() => this.handleDirect('/admin/skill')}>Trở về</Button>
                                    </Col>
                                    <Col xs="4" sm="4">
                                        <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    <Col xs="4" sm="4">
                                        <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Cập nhật</Button>
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

export default Skill_Update;
