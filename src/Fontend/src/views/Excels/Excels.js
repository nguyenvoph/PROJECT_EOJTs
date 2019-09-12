import firebase from 'firebase';
import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ExcelRenderer } from 'react-excel-renderer';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, Input, CardFooter, CardHeader, Col, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { getPaginationCurrentPageNumber, getPaginationNextPageNumber, getPaginationPageNumber } from '../../service/common-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';


class Excels extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            files_Students: null,
            cols_Students: [],
            rows_Students: [],
            files_Businesses: null,
            cols_Businesses: [],
            rows_Businesses: [],
            pageNumber: 1,
            currentPage: 0,
            studentsPagination: null,
            pageNumberBus: 1,
            currentPageBus: 0,
            businessesPagination: null,
            open: false,
            business: null,
            large: false,
            listBusinessesForSave: [],
            modal: false,
            listIndexNotFound: [],
            specializeds: [],
            specializedItem: {},
            listSkillForSave: [],
            diffDays: 0
        };
        this.toggleLarge = this.toggleLarge.bind(this);
    }

    async componentDidMount() {

        const dateButtonStudent = localStorage.getItem("dateButtonStudent");
        const dateButtonBusiness = localStorage.getItem("dateButtonBusiness");

        if (dateButtonStudent.toString() === "true") {
            document.getElementById("submitStudents").setAttribute("disabled", "disabled");
        }

        if (dateButtonBusiness.toString() === "true") {
            document.getElementById("submitBusinesses").setAttribute("disabled", "disabled");
        }

        // const semesterNext = await ApiServices.Get('/admin/semester');
        // if (semesterNext.status != 417) {
        //     var start_choose_option_time = new Date(semesterNext[0].start_choose_option_time);
        //     var currentDate = new Date();

        //     var oneDay = 24 * 60 * 60 * 1000;
        //     var diffDays = (Math.round(Math.abs((start_choose_option_time.getTime() - currentDate.getTime()) / (oneDay)))) + 1;
        //     console.log(diffDays);
        //     if (diffDays <= 7) {
        //         localStorage.setItem("dateButtonStudent", false);
        //         localStorage.setItem("dateButtonBusiness", false);
        //         document.getElementById("submitStudents").removeAttribute("disabled", "disabled");
        //         document.getElementById("submitBusinesses").removeAttribute("disabled", "disabled");
        //     }
        // }
    }

    toggleLarge = (business) => {
        this.setState({
            large: !this.state.large,
            business: business
        });
    }

    showModal = () => {
        const { business } = this.state;
        if (business !== null) {
            return (
                <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                    className={'modal-lg ' + this.props.className}>
                    <ModalHeader style={{ backgroundColor: "#20a8d8", color: "#f0f8ff" }} toggle={this.toggleLarge}>Chi tiết doanh nghiệp</ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Tên doanh nghiệp:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[1]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Tên tiếng anh:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[2]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Email:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[3]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Số điện thoại:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[4]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Địa chỉ công ty:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[5]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Website:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[6]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Địa chỉ SV sẽ thực tập:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[7]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Kỹ năng - Số lượng:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[8]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Quy trình tuyển:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[9]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Liên hệ:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[10]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Mô tả:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[11]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Giới thiệu công ty:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[12]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Chính sách ưu đãi:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[13]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Logo:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[14]}</label>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <h6>Kì:</h6>
                            </Col>
                            <Col xs="12" md="9">
                                <label>{business[15]}</label>
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button style={{ marginRight: "42%", width: "100px" }} color="primary" onClick={this.toggleLarge}>Xác nhận</Button>
                    </ModalFooter> */}
                </Modal>
            )
        }
    }



    handlePageNumber = (currentPage) => {
        const { rows_Students } = this.state;
        if (rows_Students !== null) {
            const studentsPagination = rows_Students.slice(getPaginationCurrentPageNumber(currentPage, 5), getPaginationNextPageNumber(currentPage, 5));
            this.setState({
                studentsPagination,
                currentPage,
            })
        }
    }

    handlePagePrevious = (currentPage) => {
        const { rows_Students } = this.state;
        if (rows_Students !== null) {
            const studentsPagination = rows_Students.slice(getPaginationCurrentPageNumber(currentPage, 5), getPaginationNextPageNumber(currentPage, 5));
            this.setState({
                studentsPagination,
                currentPage,
            })
        }
    }

    handlePageNext = (currentPage) => {
        const { rows_Students } = this.state;
        if (rows_Students !== null) {
            const studentsPagination = rows_Students.slice(getPaginationCurrentPageNumber(currentPage, 5), getPaginationNextPageNumber(currentPage, 5));
            this.setState({
                studentsPagination,
                currentPage,
            })
        }
    }

    handlePageNumberBus = (currentPageBus) => {
        const { rows_Businesses } = this.state;
        if (rows_Businesses !== null) {
            const businessesPagination = rows_Businesses.slice(getPaginationCurrentPageNumber(currentPageBus, 5), getPaginationNextPageNumber(currentPageBus, 5));
            this.setState({
                businessesPagination,
                currentPageBus,
            })
        }
    }

    handlePagePreviousBus = (currentPageBus) => {
        const { rows_Businesses } = this.state;
        if (rows_Businesses !== null) {
            const businessesPagination = rows_Businesses.slice(getPaginationCurrentPageNumber(currentPageBus, 5), getPaginationNextPageNumber(currentPageBus, 5));
            this.setState({
                businessesPagination,
                currentPageBus,
            })
        }
    }

    handlePageNextBus = (currentPageBus) => {
        const { rows_Businesses } = this.state;
        if (rows_Businesses !== null) {
            const businessesPagination = rows_Businesses.slice(getPaginationCurrentPageNumber(currentPageBus, 5), getPaginationNextPageNumber(currentPageBus, 5));
            this.setState({
                businessesPagination,
                currentPageBus,
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSubmit = async (buttonName) => {
        const { rows_Students, rows_Businesses } = this.state;
        const listStudents = [];
        const listBusinesses = [];
        const listNameSkill = [], listIndexNotFound = [];

        if (rows_Students.length !== 0) {
            this.setState({
                loading: true
            })
            if (buttonName === 'Students') {
                rows_Students && rows_Students.map((student, index) => {
                    var tmp = student[4];
                    let gender;
                    if (tmp.toLowerCase() === 'nam') {
                        gender = 1
                    } else if (tmp.toLowerCase() === 'nữ') {
                        gender = 0
                    }
                    var student = {
                        code: student[1],
                        name: student[2],
                        dob: student[3],
                        gender: gender,
                        phone: student[5],
                        email: student[6],
                        address: student[7],
                        specialized: {
                            name: student[8]
                        },
                        gpa: student[9],
                        semesterName: student[10],
                    };
                    listStudents.push(student);
                })

                console.log("LIST STUDENTS", listStudents);

                const resultStudents = await ApiServices.Post('/student', listStudents);
                // const resultStudents = 201;
                if (resultStudents.status === 201) {
                    this.setState({
                        loading: false
                    })
                    Toastify.actionSuccess("Thêm tệp thành công!");

                    var currentTime = new Date();

                    var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
                    var date = month + '-' + currentTime.getDate() + '-' + currentTime.getFullYear();
                    var time = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();

                    var database = firebase.database();
                    var ref = database.ref('Users');

                    for (let i = 0; i < listStudents.length; i++) {
                        var usersRef = ref.child(`${listStudents[i].code}`);
                        usersRef.set({
                            userState: {
                                date: date,
                                time: time,
                                type: 'offline'
                            }
                        });
                    }

                    localStorage.setItem('dateButtonStudent', true);
                    document.getElementById("submitStudents").setAttribute("disabled", "disabled");

                    const dateButtonBusiness = localStorage.getItem("dateButtonBusiness");
                    if (dateButtonBusiness.toString() === "true") {
                        document.getElementById("submitBusinesses").setAttribute("disabled", "disabled");
                    }
                } else if (resultStudents.status === 417) {
                    this.setState({
                        loading: false
                    })
                    confirmAlert({
                        title: 'Xác nhận',
                        message: `Có lỗi mail xảy ra. Vui lòng thử lại!`,
                        buttons: [
                            {
                                label: 'Xác nhận'
                            }
                        ]
                    });
                }
                else {
                    this.setState({
                        loading: false
                    })
                    Toastify.actionFail("Thêm tệp thất bại!");
                }
            }
        } else if (buttonName === 'Students') {
            Toastify.actionFail("Không tệp nào được chọn!");
        }

        if (rows_Businesses.length !== 0) {
            if (buttonName === 'Businesses') {
                rows_Businesses && rows_Businesses.map((business, index) => {
                    let data = business[8];
                    let skillsAndNumber = [];
                    let skills_number = [];
                    const result = [];
                    var obj = {};

                    skillsAndNumber = data.split("+");
                    skillsAndNumber && skillsAndNumber.map(async (element, index) => {
                        if (index > 0) {
                            skills_number = element.split(":");
                            var name = skills_number[0].trim();
                            var number = skills_number[1].trim();

                            if (listNameSkill.indexOf(name) === -1) {
                                listNameSkill.push(name);
                            }
                            obj = {
                                skill: {
                                    id: 0,
                                },
                                name: name,
                                number: number
                            }
                            result.push(obj);
                        }
                    })

                    var business = {
                        email: business[3],
                        business_address: business[5],
                        business_overview: business[12],
                        business_eng_name: business[2],
                        business_name: business[1],
                        business_website: business[6],
                        business_phone: business[4],
                        logo: business[14],
                        contact: business[10],
                        description: business[11],
                        interest: business[13],
                        interview_process: business[9],
                        time_post: '',
                        views: 0,
                        nameSemester: business[15],
                        skillDTOList: result
                    };
                    listBusinesses.push(business);

                })

                console.log('listNameSkill', listNameSkill);
                const skillsNotExisted = await ApiServices.Post('/skill/isExisted', listNameSkill);
                if (skillsNotExisted.status === 200) {
                    const data = await skillsNotExisted.json();
                    for (let k = 0; k < data.length; k++) {
                        if (data[k].name !== '') {
                            listIndexNotFound.push(data[k].name);
                        }
                    }
                }

                console.log("listIndexNotFound", listIndexNotFound);

                if (listIndexNotFound.length !== 0) {
                    let listSkillForSave = this.state.listSkillForSave;
                    const specializeds = await ApiServices.Get('/specialized');

                    if (specializeds !== null) {
                        for (let i = 0; i < listIndexNotFound.length; i++) {
                            var specialized = {
                                id: specializeds[0].id
                            }
                            var skill = {
                                name: listIndexNotFound[i],
                                status: true,
                                specialized
                            }
                            listSkillForSave.push(skill);
                            console.log(listSkillForSave);
                        }

                        this.setState({
                            loading: false,
                            listBusinessesForSave: listBusinesses,
                            modal: true,
                            listIndexNotFound,
                            specializeds,
                            specializedItem: specializeds[0],
                            listSkillForSave
                        })
                    }
                    // this.handleConfirm(listIndexNotFound);
                } else {
                    this.setState({
                        loading: true
                    })
                    console.log("LIST BUSINESSES", listBusinesses);

                    const result = await ApiServices.Post('/business', listBusinesses);
                    // const result = 201;
                    if (result.status === 201) {
                        this.setState({
                            loading: false
                        })
                        Toastify.actionSuccess("Thêm tệp thành công!");

                        localStorage.setItem('dateButtonBusiness', true);
                        document.getElementById("submitBusinesses").setAttribute("disabled", "disabled");

                        const dateButtonStudent = localStorage.getItem("dateButtonStudent");
                        if (dateButtonStudent.toString() === "true") {
                            document.getElementById("submitStudents").setAttribute("disabled", "disabled");
                        }

                    } else if (result.status === 417) {
                        this.setState({
                            loading: false
                        })
                        confirmAlert({
                            title: 'Xác nhận',
                            message: `Có lỗi mail xảy ra. Vui lòng thử lại!`,
                            buttons: [
                                {
                                    label: 'Xác nhận'
                                }
                            ]
                        });
                    } else {
                        this.setState({
                            loading: false
                        })
                        Toastify.actionFail("Thêm tệp thất bại!");
                    }
                }

                // setTimeout(
                //     function () {
                //         this.setState({
                //             loading: false
                //         })
                //         Toastify.actionSuccess("Thêm tệp thành công!");
                //     }
                //         .bind(this),
                //     5000
                // );
            }
        } else if (buttonName === 'Businesses') {
            Toastify.actionFail("Không tệp nào được chọn!");
        }

    }

    toggleModalDetail = async () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    addListSkill = async () => {
        const listSkillForSave = this.state.listSkillForSave;
        console.log(listSkillForSave);

        this.setState({
            loading: true
        })

        const result = await ApiServices.Post('/skill/listSkill', listSkillForSave);
        if (result.status === 200) {
            listSkillForSave.splice(0, listSkillForSave.length);
            this.setState({
                loading: false,
                modal: !this.state.modal,
                listSkillForSave
            })
            Toastify.actionSuccess("Tạo kỹ năng mới thành công!");
        } else {
            this.setState({
                loading: false
            })
            Toastify.actionFail("Tạo kỹ năng mới thất bại!");
        }
    }

    handleInput = async (event, index) => {
        const { name, value } = event.target;
        const { specializeds, listSkillForSave } = this.state;
        if (name.includes('specialized')) {
            listSkillForSave[index].specialized.id = specializeds[value].id;
            await this.setState({
                listSkillForSave
            })
        }
    }

    importListBusiness = async (listBusinesses, listSkill) => {
        console.log(listBusinesses);
        console.log(listSkill);
        this.setState({
            loading: true
        })
        //const resultAddListSkill = await ApiServices.Post('/skill/listSkill', listSkill);

        // if (resultAddListSkill.status === 200) {
        const result = await ApiServices.Post('/business', listBusinesses);
        if (result.status === 201) {
            this.setState({
                loading: false
            })
            Toastify.actionSuccess("Thêm tệp thành công!");

        } else {
            this.setState({
                loading: false
            })
            Toastify.actionFail("Thêm tệp thất bại!");
        }
        //}
    }

    removeFileStudents = (event) => {
        event.preventDefault();

        this.setState({
            files_Students: null,
            cols_Students: [],
            rows_Students: [],
        });
        document.getElementById("file_excel_students").value = ""
    }

    removeFileBusinesses = (event) => {
        event.preventDefault();

        this.setState({
            files_Businesses: null,
            cols_Businesses: [],
            rows_Businesses: [],
        });
        document.getElementById("file_excel_businesses").value = ""
    }

    fileStudentHandler = (event) => {
        let fileObj = event.target.files[0];
        // if (fileObj !== null) {
        //     var fileType = fileObj.type.toString();
        // }

        let flag = true;
        var titles = ["STT", "MSSV", "Họ Tên", "Ngày sinh", "Giới tính", "SĐT", "Email", "Địa chỉ", "Ngành học", "GPA", "Kì"];

        // if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {

        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                let titlesExcel = resp.rows[0];

                if (titlesExcel.length !== 11) {
                    flag = false;
                } else {
                    for (let i = 0; i < titles.length; i++) {
                        var areEqual = titles[i].toUpperCase() === titlesExcel[i].toUpperCase();
                        if (!areEqual) {
                            flag = false;
                            break;
                        }
                    }
                }

                if (!flag) {
                    document.getElementById("file_excel_students").value = "";
                    Toastify.actionWarning("Cấu trúc file không hợp lệ!");
                } else {
                    const { currentPage } = this.state;
                    const pageNumber = getPaginationPageNumber(resp.rows.length - 1, 5);
                    resp.rows.splice(0, 1);
                    const studentsPagination = resp.rows.slice(getPaginationCurrentPageNumber(currentPage, 5), getPaginationNextPageNumber(currentPage, 5));
                    this.setState({
                        files_Students: fileObj,
                        cols_Students: resp.cols,
                        rows_Students: resp.rows,
                        pageNumber,
                        studentsPagination,
                    });
                }
            }
        });

        // } else {
        //     Toastify.actionWarning("Xin hãy nhập file excel!");
        //     document.getElementById("file_excel_students").value = "";
        // }
    }

    fileBusinessHandler = (event) => {
        let fileObj = event.target.files[0];
        console.log(fileObj);
        // if (fileObj !== null) {
        //     var fileType = fileObj.type.toString();
        // }

        let flag = true;
        var titles = ["STT", "Doanh Nghiệp", "Tên Tiếng Anh", "Email", "SĐT", "Địa chỉ Công ty", "Website", "Địa chỉ nơi SV sẽ thực tập", "Vị trí - Số lượng",
            "Quy trình tuyển", "Liên hệ", "Mô tả", "Giới thiệu công ty", "Chính sách ưu đãi", "Logo", "Kì"];

        // if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {

        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                let titlesExcel = resp.rows[0];

                if (titlesExcel.length !== 16) {
                    flag = false;
                } else {
                    for (let i = 0; i < titles.length; i++) {
                        var areEqual = titles[i].toUpperCase() === titlesExcel[i].toUpperCase();
                        if (!areEqual) {
                            flag = false;
                            break;
                        }
                    }
                }

                if (!flag) {
                    document.getElementById("file_excel_businesses").value = "";
                    Toastify.actionWarning("Cấu trúc file không hợp lệ!");
                } else {
                    const { currentPageBus } = this.state;
                    const pageNumberBus = getPaginationPageNumber(resp.rows.length - 1, 5);
                    resp.rows.splice(0, 1);
                    const businessesPagination = resp.rows.slice(getPaginationCurrentPageNumber(currentPageBus, 5), getPaginationNextPageNumber(currentPageBus, 5));
                    this.setState({
                        files_Businesses: fileObj,
                        cols_Businesses: resp.cols,
                        rows_Businesses: resp.rows,
                        pageNumberBus,
                        businessesPagination,
                    });
                }
            }
        });

        // } else {
        //     Toastify.actionWarning("Xin hãy nhập file excel");
        //     document.getElementById("file_excel_businesses").value = "";
        // }
    }



    // rowStudentEdited = async (event) => {
    //     let rowId = event.target.id;
    //     let tmp = event.target.id.split("-");
    //     let dataChanged = await document.getElementById(rowId).innerHTML;
    //     let rowNumber = tmp[1];
    //     let colNumber = tmp[2];

    //     var { rows_Students } = this.state;

    //     rows_Students[rowNumber][colNumber] = dataChanged;
    // }

    // rowBusinessEdited = async (event) => {
    //     let rowId = event.target.id;
    //     let tmp = event.target.id.split("-");
    //     let dataChanged = await document.getElementById(rowId).innerHTML;
    //     let rowNumber = tmp[1];
    //     let colNumber = tmp[2];

    //     var { rows_Businesses } = this.state;

    //     rows_Businesses[rowNumber][colNumber] = dataChanged;

    // }

    render() {
        const { files_Students, rows_Students, files_Businesses, rows_Businesses, loading, business, listIndexNotFound } = this.state;
        const { studentsPagination, pageNumber, currentPage } = this.state;
        const { businessesPagination, pageNumberBus, currentPageBus, specializeds, specializedItem } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    // return (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Thêm danh sách sinh viên</strong>
                                        <a className="float-right" href="https://docs.google.com/spreadsheets/d/1KHfCbg-Rr6Qii8gtJSLNWwBR3VWGN6OY/export?format=xlsx" download>Tải bản mẫu danh sách sinh viên</a>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col xs="10" md="10">
                                                    <form encType="multipart/form-data" method="post" action="">
                                                        <input type="file" multiple id="file_excel_students" name="fileName" onChange={this.fileStudentHandler.bind(this)}></input>
                                                        {files_Students && (
                                                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                                                <button onClick={this.removeFileStudents}>Xóa file</button>
                                                                <br />
                                                            </div>
                                                        )}
                                                    </form>
                                                </Col>
                                                {files_Students && (

                                                    <table class="table table-bordered table-hover" style={{ textAlign: "center" }}>
                                                        <thead>
                                                            <th>STT</th>
                                                            <th>MSSV</th>
                                                            <th>Họ Tên</th>
                                                            <th>Ngày sinh</th>
                                                            <th>Giới tính</th>
                                                            <th>SĐT</th>
                                                            <th>Email</th>
                                                            <th>Địa chỉ</th>
                                                            <th>Ngành học</th>
                                                            <th>GPA</th>
                                                            <th>Kì</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                studentsPagination && studentsPagination.map((student, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{student[0]}</td>
                                                                            <td id={"s-" + index + "-1"} onKeyUp={this.rowStudentEdited}>{student[1]}</td>
                                                                            <td id={"s-" + index + "-2"} onKeyUp={this.rowStudentEdited}>{student[2]}</td>
                                                                            <td id={"s-" + index + "-3"} onKeyUp={this.rowStudentEdited}>{student[3]}</td>
                                                                            <td id={"s-" + index + "-4"} onKeyUp={this.rowStudentEdited}>{student[4]}</td>
                                                                            <td id={"s-" + index + "-5"} onKeyUp={this.rowStudentEdited}>{student[5]}</td>
                                                                            <td id={"s-" + index + "-6"} onKeyUp={this.rowStudentEdited}>{student[6]}</td>
                                                                            <td id={"s-" + index + "-7"} onKeyUp={this.rowStudentEdited}>{student[7]}</td>
                                                                            <td id={"s-" + index + "-8"} onKeyUp={this.rowStudentEdited}>{student[8]}</td>
                                                                            <td id={"s-" + index + "-9"} onKeyUp={this.rowStudentEdited}>{student[9]}</td>
                                                                            <td id={"s-" + index + "-10"} onKeyUp={this.rowStudentEdited}>{student[10]}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                )}
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                        <Pagination>
                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button id="submitStudents" onClick={() => this.handleSubmit('Students')} type="submit" color="primary" block>Xác nhận</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Thêm danh sách doanh nghiệp</strong>
                                        <a className="float-right" href="https://docs.google.com/spreadsheets/d/174pKjfX-eboXL_78sGueXhOyYYjkN5oH/export?format=xlsx" download>Tải bản mẫu danh sách doanh nghiệp</a>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col xs="10" md="10">
                                                    <form encType="multipart/form-data" method="post" action="">
                                                        <input type="file" multiple id="file_excel_businesses" name="fileName" onChange={this.fileBusinessHandler.bind(this)}></input>
                                                        {files_Businesses && (
                                                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                                                <button onClick={this.removeFileBusinesses}>Xóa file</button>
                                                            </div>
                                                        )}
                                                    </form>
                                                </Col>

                                                {files_Businesses && (
                                                    <table class="table table-bordered table-hover" style={{ textAlign: "center" }}>
                                                        <thead>
                                                            <th >STT</th>
                                                            <th >Doanh nghiệp</th>
                                                            {/* <th >Tên tiếng Anh</th> */}
                                                            <th >Email</th>
                                                            <th >SĐT</th>
                                                            <th >Địa chỉ công ty</th>
                                                            <th >Website</th>
                                                            {/* <th >Địa chỉ SV sẽ thực tập</th>
                                                                <th >Vị trí - Số lượng</th>
                                                                <th >Quy trình tuyển</th>
                                                                <th >Liên hệ</th>
                                                                <th >Mô tả</th>
                                                                <th >Giới thiệu công ty</th>
                                                                <th >Chính sách ưu đãi</th>
                                                                <th >Logo</th>
                                                                <th >Kì</th> */}
                                                            <th ></th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                businessesPagination && businessesPagination.map((business, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td >{business[0]}</td>
                                                                            <td id={"b-" + index + "-1"} onKeyUp={this.rowBusinessEdited}>{business[1]}</td>
                                                                            {/* <td  id={"b-" + index + "-2"} onKeyUp={this.rowBusinessEdited}>{business[2]}</td> */}
                                                                            <td id={"b-" + index + "-3"} onKeyUp={this.rowBusinessEdited}>{business[3]}</td>
                                                                            <td id={"b-" + index + "-4"} onKeyUp={this.rowBusinessEdited}>{business[4]}</td>
                                                                            <td id={"b-" + index + "-5"} onKeyUp={this.rowBusinessEdited}>{business[5]}</td>
                                                                            <td id={"b-" + index + "-6"} onKeyUp={this.rowBusinessEdited}>{business[6]}</td>
                                                                            {/* <td  id={"b-" + index + "-7"} onKeyUp={this.rowBusinessEdited}>{business[7]}</td>
                                                                                <td  id={"b-" + index + "-8"} onKeyUp={this.rowBusinessEdited}>{business[8]}</td>
                                                                                <td  id={"b-" + index + "-9"} onKeyUp={this.rowBusinessEdited}>{business[9]}</td>
                                                                                <td  id={"b-" + index + "-10"} onKeyUp={this.rowBusinessEdited}>{business[10]}</td>
                                                                                <td  id={"b-" + index + "-11"} onKeyUp={this.rowBusinessEdited}>{business[11]}</td>
                                                                                <td  id={"b-" + index + "-12"} onKeyUp={this.rowBusinessEdited}>{business[12]}</td>
                                                                                <td  id={"b-" + index + "-13"} onKeyUp={this.rowBusinessEdited}>{business[13]}</td>
                                                                                <td  id={"b-" + index + "-14"} onKeyUp={this.rowBusinessEdited}>{business[14]}</td>
                                                                                <td  id={"b-" + index + "-15"} onKeyUp={this.rowBusinessEdited}>{business[15]}</td> */}
                                                                            <td style={{ textAlign: "center" }}>
                                                                                <Button style={{ width: "100px" }} color="primary" onClick={() => this.toggleLarge(business)} className="mr-1"><i className="fa fa-eye"></i></Button>
                                                                                {
                                                                                    this.showModal()
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            <Modal isOpen={this.state.modal} toggle={this.toggleModalDetail}
                                                                className={'modal-primary ' + this.props.className}>
                                                                <ModalHeader toggle={this.toggleModalDetail}>Những kỹ năng chưa có trong hệ thống</ModalHeader>
                                                                <ModalBody>
                                                                    <div>
                                                                        {
                                                                            listIndexNotFound && listIndexNotFound.map((skill, index) => {
                                                                                return (
                                                                                    <FormGroup row>
                                                                                        <Col md="4">
                                                                                            <label>{index + 1}/ {skill}</label>
                                                                                        </Col>
                                                                                        <Col xs="12" md="8">

                                                                                            <Input onChange={e => { this.handleInput(e, index) }} type="select" name="specialized">
                                                                                                {specializeds && specializeds.map((specialized, i) => {
                                                                                                    return (
                                                                                                        <option value={i}>{specialized.name}</option>
                                                                                                    )
                                                                                                })}
                                                                                            </Input>
                                                                                        </Col>
                                                                                    </FormGroup>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <hr />
                                                                    <h6>Vui lòng thêm những kỹ năng mới này vào hệ thống và thử lại</h6>
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                    <Button color="primary" onClick={this.addListSkill}>Xác nhận</Button>
                                                                    <Button color="secondary" onClick={this.toggleModalDetail}>Hủy bỏ</Button>
                                                                </ModalFooter>
                                                            </Modal>
                                                        </tbody>
                                                    </table>
                                                )}
                                            </FormGroup>
                                        </Form>
                                        <Pagination>
                                            <PaginationComponent pageNumber={pageNumberBus} handlePageNumber={this.handlePageNumberBus} handlePageNext={this.handlePageNextBus} handlePagePrevious={this.handlePagePreviousBus} currentPage={currentPageBus} />
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button id="submitBusinesses" onClick={() => this.handleSubmit('Businesses')} type="submit" color="primary" block>Xác nhận</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
            // )
        )
    }
}

export default Excels;
