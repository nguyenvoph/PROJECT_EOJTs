import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../../views/Toastify/Toastify';

class Specialized_Update extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            id: '',
            name: '',
            status: '',
        }
    }



    async componentDidMount() {
        const updatedId = window.location.href.split("/").pop();
        const specialized = await ApiServices.Get(`/specialized/id?id=${updatedId}`);

        this.setState({
            id: specialized.id,
            name: specialized.name,
            status: specialized.status,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        if (name.includes('name')) {
            await this.setState({
                name: value,
            })
        }
    }


    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            name: '',
        })
    }

    handleConfirm = () => {
        const { name } = this.state;
        if (this.validator.allValid()) {
            confirmAlert({
                title: 'Xác nhận',
                message: `Bạn chắc chắn muốn cập nhật chuyên ngành '${name}' ?`,
                buttons: [
                    {
                        label: 'Xác nhận',
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
        const { id, name, status } = this.state;
        const specialized = {
            id,
            name,
            status,
        }
        const result = await ApiServices.Put('/specialized', specialized);
        if (result) {
          Toastify.actionSuccess("Cập nhật chuyên ngành thành công");
          setTimeout(
            function () {
              this.props.history.push('/admin/specialized');
            }
              .bind(this),
            2000
          );
        } else {
            Toastify.actionFail("Cập nhật chuyên ngành thất bại!");
        }

    }
    render() {

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Cập nhật chuyên ngành</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="name">Tên chuyên ngành</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.name} onChange={this.handleInput} type="text" id="name" name="name" placeholder="Nhập tên chuyên ngành" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Tên chuyên ngành', this.state.name, 'required|max:20')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="4" sm="4">
                                        <Button color="secondary" block onClick={() => this.handleDirect('/admin/specialized')}>Trở về</Button>
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

export default Specialized_Update;
