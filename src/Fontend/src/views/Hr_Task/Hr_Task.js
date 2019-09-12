import React, { Component } from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    // CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    // Input,
    Label,
    Row,
    Pagination,
    Table,
    Input,
    CardFooter,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
// import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
// import PaginationComponent from '../Paginations/pagination';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import PaginationComponent from '../Paginations/pagination';
import decode from 'jwt-decode';

class Hr_Task extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            tasks: null,
            loading: true,

            id: '',
            title: '',
            description: '',
            time_created: '',
            time_end: '',
            level_task: '',
            priority: '',
            status: '',
            supervisorName: '',
            studentName: '',
            emailStudent: '',
            modal: false,
            comment: false,
            contentComment: '',
            contentCommentNew: '',
            statusUpdate: '',
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,
            searchValue: "",
            dropdownStateOpen: false,
            dropdownApprovedOpen: false,
            dropdownState: ["Tổng", "Chưa hoàn thành", "Cần chỉnh sửa", "Hoàn thành"],
            dropdownApproved: ["Tổng", "Đang chờ duyệt", "Từ chối", "Duyệt"],
            //Tổng = 0, Chưa hoàn thành(NOTSTART) = 1, Cần chỉnh sửa - Từ chối(PENDING) = 2, HOÀN THÀNH(DONE, APPROVED) = 3, Đang chờ duyệt(NOTSTART, DONE) = 4, Duyệt(APPROVED) = 5
            // statusFilter: 0,
            taskStatus: 0,

            isSearching: false,
            searchingTaskList: null,
            numOfTask: 0,
            role: '',
        }
    }


    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const token = localStorage.getItem('id_token');
        let studentsNosupervisor = [];
        let role = '';
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }

        const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=${this.state.taskStatus}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const numOfTask = await ApiServices.Get("/supervisor/getNumTask");
        if (numOfTask === null) {
            numOfTask = 0;
        }
        if (tasks !== null) {
            this.setState({
                tasks: tasks.listData,
                pageNumber: tasks.pageNumber,
                loading: false,
                numOfTask: numOfTask,
                role: role,
            });
        }

        if (role === 'ROLE_HR') {
            studentsNosupervisor = await ApiServices.Get('/business/getStudentsByBusinessWithNoSupervisor');
            if (studentsNosupervisor.length == 0) {
                document.getElementById('btnHrCreateTask').setAttribute('disabled', 'disabled');
            }
        }
    }

    toggleModal = async (taskId) => {
        let task = null;
        if (this.state.modal === false) {
            const task = await ApiServices.Get(`/supervisor/task?id=${taskId}`);
            if (task !== null) {
                this.setState({
                    modal: !this.state.modal,
                    id: task.task.id,
                    title: task.task.title,
                    description: task.task.description,
                    time_created: task.task.time_created,
                    time_end: task.task.time_end,
                    level_task: task.task.level_task,
                    priority: task.task.priority,
                    status: task.task.status,
                    supervisorName: task.task.supervisor.name,
                    studentName: task.nameStudent,
                    emailStudent: task.emailStudent,
                    contentComment: task.task.comment
                });
            }
            // alert(task.task.comment);
        } else {
            this.setState({
                modal: !this.state.modal,
            });
        }
    }

    handleSelectTaskStatus = async (taskStatus) => {
        console.log(this.state.tasks);
        console.log(taskStatus);
        //Tổng = 0, Chưa hoàn thành(NOTSTART) = 1, Cần chỉnh sửa - Từ chối(PENDING) = 2, Hoàn thành(DONE, APPROVED) = 3, Đang chờ duyệt(NOTSTART, DONE) = 4, Duyệt(APPROVED) = 5
        if (taskStatus === "Tổng") {
            const { rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=0&currentPage=0&rowsPerPage=${rowsPerPage}`);
            console.log(tasks);
            if (tasks !== null) {
                await this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                    taskStatus: 0,
                    currentPage: 0,
                });
                console.log(this.state.tasks);
            }
        } else if (taskStatus === "Chưa hoàn thành") {
            const { rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=1&currentPage=0&rowsPerPage=${rowsPerPage}`);
            console.log(tasks);
            if (tasks !== null) {
                await this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                    taskStatus: 1,
                    currentPage: 0,
                });
                console.log(this.state.tasks);
            }
        } else if (taskStatus === "Cần chỉnh sửa" || taskStatus === "Từ chối") {
            const { rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=2&currentPage=0&rowsPerPage=${rowsPerPage}`);
            console.log(tasks);
            if (tasks !== null) {
                await this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                    taskStatus: 2,
                    currentPage: 0,
                });
                console.log(this.state.tasks);
            }
        } else if (taskStatus === "Hoàn thành") {
            const { rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=3&currentPage=0&rowsPerPage=${rowsPerPage}`);
            console.log(tasks);
            if (tasks !== null) {
                await this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                    taskStatus: 3,
                    currentPage: 0,
                });
                console.log(this.state.tasks);
            }
        } else if (taskStatus === "Đang chờ duyệt") {
            const { rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=4&currentPage=0&rowsPerPage=${rowsPerPage}`);
            console.log(tasks);
            if (tasks !== null) {
                await this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                    taskStatus: 4,
                    currentPage: 0,
                });
                console.log(this.state.tasks);
            }
        } else if (taskStatus === "Duyệt") {
            console.log(taskStatus === "Duyệt");
            const { rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=5&currentPage=0&rowsPerPage=${rowsPerPage}`);
            console.log(tasks);
            if (tasks !== null) {
                await this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                    taskStatus: 5,
                    currentPage: 0,
                });
                console.log(this.state.tasks);
            }
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleDelete = async (deletedId) => {
        this.setState({
            loading: true
        })
        const result = await ApiServices.Delete(`/supervisor/task?id=${deletedId}`);

        if (result.status === 200) {
            const { currentPage, rowsPerPage } = this.state;
            const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=${this.state.taskStatus}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            if (tasks !== null) {
                this.setState({
                    tasks: tasks.listData,
                    pageNumber: tasks.pageNumber,
                    loading: false,
                });
            }
            Toastify.actionSuccess("Xóa nhiệm vụ thành công!");
        } else {
            Toastify.actionFail("Xóa nhiệm vụ thất bại!");
            this.setState({
                loading: false
            })
        }
    }

    showTaskState(taskStatus) {
        if (taskStatus === 'NOTSTART') {
            return (
                <Badge color="danger">CHƯA HOÀN THÀNH</Badge>
            )
        } else if (taskStatus === 'PENDING') {
            return (
                <Badge color="warning">CẦN CHỈNH SỬA</Badge>
            )
        } else if (taskStatus === 'DONE' || taskStatus === 'APPROVED') {
            return (
                <Badge color="success">HOÀN THÀNH</Badge>
            )
        }
    }

    showTaskLevel(taskLevel) {
        if (taskLevel === 'DIFFICULT') {
            return (
                <Badge color="danger">KHÓ</Badge>
            )
        } else if (taskLevel === 'EASY') {
            return (
                <Badge color="primary">DỄ</Badge>
            )
        } else if (taskLevel === 'NORMAL') {
            return (
                <Badge color="warning">TRUNG BÌNH</Badge>
            )
        }
    }

    formatDate(inputDate, flag) {
        var date = inputDate.split('-');
        let formattedDate = date[2] + "/" + date[1] + "/" + date[0];
        if (flag === true) {
            return (
                <Badge color="primary" style={{ fontSize: '12px' }}>{formattedDate}</Badge>
            )
        } else if (flag === false) {
            return (
                <Badge color="danger" style={{ fontSize: '12px' }}>{formattedDate}</Badge>
            )
        }
    }

    showButtonChangeStatus(taskStatus, id) {
        if (taskStatus === 'APPROVED') {
            return (
                <>
                    <Button style={{ marginLeft: "3px" }} type="submit" color="danger" onClick={() => this.handleConfirmSetState(id, 2)}><i className="fa fa-close"></i></Button>
                    &nbsp;&nbsp;
                    <Button disabled type="submit" color="primary" onClick={() => this.handleConfirmSetState(id, 4)}><i className="fa fa-check"></i></Button>
                </>
            )
        } else
            if (taskStatus !== 'APPROVED' && taskStatus != 'PENDING') {
                return (
                    <>
                        <Button style={{ marginLeft: "3px" }} type="submit" color="danger" onClick={() => this.handleConfirmSetState(id, 2)}><i className="fa fa-close"></i></Button>
                        &nbsp;&nbsp;
                        <Button type="submit" color="primary" onClick={() => this.handleConfirmSetState(id, 4)}><i className="fa fa-check"></i></Button>
                        {/* <Button type="submit" color="primary" onClick={() => this.handleDirect(`/supervisor/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button> */}
                    </>
                )
            }
            else if (taskStatus === 'PENDING') {
                return (
                    <>
                        <Button disabled style={{ marginLeft: "3px" }} type="submit" color="danger" onClick={() => this.handleConfirmSetState(id, 2)}><i className="fa fa-close"></i></Button>
                        &nbsp;&nbsp;
                        <Button type="submit" color="primary" onClick={() => this.handleConfirmSetState(id, 4)}><i className="fa fa-check"></i></Button>
                    </>
                )
            }
    }


    handleConfirm = (task) => {
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn chắc chắn muốn xóa nhiệm vụ '${task.title}' của sinh viên ${task.nameStudent}?`,
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => this.handleDelete(task.id)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    toggleComment = () => {
        this.setState({
            comment: !this.state.comment,
            modal: !this.state.modal
        });
    }

    toggleDropdownState = () => {
        this.setState({
            dropdownStateOpen: !this.state.dropdownStateOpen,
        });
    }

    toggleDropdownApproved = () => {
        this.setState({
            dropdownApprovedOpen: !this.state.dropdownApprovedOpen,
        });
    }

    handleConfirmSetState = (id, status) => {
        this.setState({
            statusUpdate: status,
            modal: false,
            comment: true
        })
        // var messageStatus = '';
        // this.setState({
        //     modal: false,
        // })
        // if (status === 4) {
        //     messageStatus = ' đã hoàn thành';
        // }
        // // else {
        // //     messageStatus = ' ';
        // // }
        // confirmAlert({
        //     title: 'Xác nhận',
        //     message: `Bạn có chắc chắn muốn xác nhận nhiệm vụ '${this.state.title}' '${messageStatus}' ?`,
        //     buttons: [
        //         {
        //             label: 'Đồng ý',
        //             onClick: () => this.handleUpdateStatus(id, status)
        //         },
        //         {
        //             label: 'Hủy bỏ',
        //             onClick: () => this.setState({ modal: true, })
        //         }
        //     ]
        // });
    };

    handleInputComment = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleUpdateStatus = async () => {
        const { id, statusUpdate, contentCommentNew } = this.state;
        // alert(id + ' - ' + statusUpdate + ' - ' + contentCommentNew);

        if (this.validator.allValid() || statusUpdate === 4) {
            this.setState({
                loading: true
            })

            const result = await ApiServices.Put(`/supervisor/stateTask?id=${id}&typeTask=${statusUpdate}&comment=${contentCommentNew}`);

            if (result.status === 200) {
                Toastify.actionSuccess("Cập nhật trạng thái thành công!");

                this.setState({
                    loading: false,
                    modal: false,
                    comment: false,
                    contentCommentNew: ''
                })

                const { currentPage, rowsPerPage } = this.state;
                const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=${this.state.taskStatus}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
                if (tasks !== null) {
                    this.setState({
                        tasks: tasks.listData,
                        pageNumber: tasks.pageNumber,
                        loading: false,
                        contentCommentNew: ''
                    });
                }

                const student = await ApiServices.Get(`/student/student/${this.state.emailStudent}`);

                if (student.token != null) {
                    let body = '';
                    if (statusUpdate === 4) {
                        body = 'Nhiệm vụ' + '[ ' + this.state.title + '] đã được kiểm duyệt'
                    } else {
                        body = 'Trạng thái nhiệm vụ' + '[' + this.state.title + '] đã chuyển thành CẦN CHỈNH SỬA'
                    }
                    const notificationDTO = {
                        data: {
                            title: 'Trạng thái task thay đổi',
                            body: body,
                            click_action: "http://localhost:3000/#/hr/invitation/new",
                            icon: "http://url-to-an-icon/icon.png"
                        },
                        to: `${student.token}`
                    }

                    const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
                }
            } else {
                Toastify.actionFail("Cập nhật trạng thái thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=${this.state.taskStatus}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (tasks !== null) {
            this.setState({
                tasks: tasks.listData,
                currentPage,
                pageNumber: tasks.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=${this.state.taskStatus}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (tasks !== null) {
            this.setState({
                tasks: tasks.listData,
                currentPage,
                pageNumber: tasks.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=${this.state.taskStatus}&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (tasks !== null) {
            this.setState({
                tasks: tasks.listData,
                currentPage,
                pageNumber: tasks.pageNumber
            })
        }
    }

    handleInputPagingAll = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const tasks = await ApiServices.Get(`/supervisor/tasks?taskStatus=0&currentPage=0&rowsPerPage=${rowsPerPage}`);
        if (tasks !== null) {
            this.setState({
                tasks: tasks.listData,
                pageNumber: tasks.pageNumber,
                currentPage: 0,
                taskStatus: 0,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const searchingTaskList = await ApiServices.Get(`/supervisor/searchingTaskAllFields?valueSearch=${value.substr(0, 20)}`);
            console.log(searchingTaskList);
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: true,
                searchingTaskList: searchingTaskList,
            })
        }
    }

    render() {
        const { tasks, loading, searchValue } = this.state;
        const { id, title, description, time_created, time_end, level_task, priority, status, supervisorName,
            studentName, contentComment, contentCommentNew, statusUpdate } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { dropdownState, dropdownApproved, isSearching, searchingTaskList, numOfTask, role } = this.state;

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
                                        {
                                            role === "ROLE_SUPERVISOR" ?
                                                <Button color="primary" onClick={() => this.handleDirect('/supervisor/hr-task/create')}>Tạo nhiệm vụ mới</Button> :
                                                <Button id="btnHrCreateTask" color="primary" onClick={() => this.handleDirect('/hr/hr-task/create')}>Tạo nhiệm vụ mới</Button>
                                        }
                                        <br /><br /><br />
                                        <ToastContainer />
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Nhiệm vụ</th>
                                                        {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Ưu tiên</th> */}
                                                        {/* <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Hạn cuối</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Mức độ</th> */}
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Người giao</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Sinh viên</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                            <Dropdown isOpen={this.state.dropdownStateOpen} toggle={() => this.toggleDropdownState()}>
                                                                <DropdownToggle nav caret style={{ color: "black" }}>
                                                                    Trạng thái
                                                            </DropdownToggle>
                                                                <DropdownMenu style={{ textAlign: 'center', right: 'auto' }}>
                                                                    {dropdownState && dropdownState.map((stateTask, index) => {
                                                                        return (
                                                                            <DropdownItem onClick={() => this.handleSelectTaskStatus(stateTask)}>{stateTask}</DropdownItem>
                                                                        )
                                                                    })
                                                                    }
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                            <Dropdown isOpen={this.state.dropdownApprovedOpen} toggle={() => this.toggleDropdownApproved()}>
                                                                <DropdownToggle nav caret style={{ color: "black" }}>
                                                                    Đã kiểm duyệt
                                                            </DropdownToggle>
                                                                <DropdownMenu style={{ textAlign: 'center', right: 'auto' }}>
                                                                    {dropdownApproved && dropdownApproved.map((approvedTask, index) => {
                                                                        return (
                                                                            <DropdownItem onClick={() => this.handleSelectTaskStatus(approvedTask)}>{approvedTask}</DropdownItem>
                                                                        )
                                                                    })
                                                                    }
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isSearching === false ?
                                                        (
                                                            tasks && tasks.map((task, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                task.task.title.length > 30 ? (task.task.title.replace(task.task.title.substr(31, task.task.title.length), "...")) : (task.task.title)
                                                                            }
                                                                        </td>
                                                                        {/* <td style={{ textAlign: "center" }}>{task.priority}</td> */}
                                                                        {/* <td style={{ textAlign: "center" }}>{task.time_end}</td>
                                                                <td style={{ textAlign: "center" }}>{task.level_task}</td> */}
                                                                        <td style={{ textAlign: "center" }}>{task.task.supervisor.name}</td>
                                                                        <td style={{ textAlign: "center" }}>{task.nameStudent}</td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                this.showTaskState(task.task.status)
                                                                            }
                                                                        </td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                task.task.status === 'APPROVED' ? (
                                                                                    <i style={{ color: "#4dbd74" }} className="fa fa-check"></i>
                                                                                ) : (
                                                                                        task.task.status === 'PENDING' ? (
                                                                                            <i style={{ color: "#f86c6b" }} className="fa fa-close"></i>
                                                                                        ) : (
                                                                                                <i style={{ color: "#003322" }} className="fa fa-circle-o-notch fa-spin"></i>
                                                                                            )
                                                                                    )
                                                                            }
                                                                        </td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.toggleModal(task.task.id)}><i className="fa fa-eye"></i></Button>
                                                                            {
                                                                                task.status === 'DONE' ? (
                                                                                    <Button disabled style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task.task)}><i className="fa cui-trash"></i></Button>
                                                                                ) : (
                                                                                        <Button style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task.task)}><i className="fa cui-trash"></i></Button>
                                                                                    )
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        ) :
                                                        (
                                                            searchingTaskList && searchingTaskList.map((task, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                        <td style={{ textAlign: "center" }}>{task.task.title}</td>
                                                                        {/* <td style={{ textAlign: "center" }}>{task.priority}</td> */}
                                                                        {/* <td style={{ textAlign: "center" }}>{task.time_end}</td>
                                                                    <td style={{ textAlign: "center" }}>{task.level_task}</td> */}
                                                                        <td style={{ textAlign: "center" }}>{task.task.supervisor.name}</td>
                                                                        <td style={{ textAlign: "center" }}>{task.nameStudent}</td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                this.showTaskState(task.task.status)
                                                                            }
                                                                        </td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            {
                                                                                task.task.status === 'APPROVED' ? (
                                                                                    <i style={{ color: "#4dbd74" }} className="fa fa-check"></i>
                                                                                ) : (
                                                                                        task.task.status === 'PENDING' ? (
                                                                                            <i style={{ color: "#f86c6b" }} className="fa fa-close"></i>
                                                                                        ) : (
                                                                                                <i style={{ color: "#003322" }} className="fa fa-circle-o-notch fa-spin"></i>
                                                                                            )
                                                                                    )
                                                                            }
                                                                        </td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.toggleModal(task.task.id)}><i className="fa fa-eye"></i></Button>
                                                                            {
                                                                                task.status === 'DONE' ? (
                                                                                    <Button disabled style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task.task)}><i className="fa cui-trash"></i></Button>
                                                                                ) : (
                                                                                        <Button style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task.task)}><i className="fa cui-trash"></i></Button>
                                                                                    )
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        )

                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        {tasks && tasks !== null ?
                                            (isSearching === false ?
                                                <Row>
                                                    <Col>
                                                        <Row>
                                                            <Pagination>
                                                                <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                            </Pagination>
                                                            &emsp;
                                                        <h6 style={{ marginTop: '7px' }}>Số dòng trên trang: </h6>
                                                            &nbsp;&nbsp;
                                                        <Input onChange={this.handleInputPagingAll} type="select" name="rowsPerPage" style={{ width: "70px" }} >
                                                                <option value={10} selected={rowsPerPage === 10}>10</option>
                                                                <option value={20}>20</option>
                                                                <option value={50}>50</option>
                                                            </Input>
                                                        </Row>

                                                    </Col>
                                                    <Col>
                                                        <Row className="float-right">
                                                            <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + tasks.length} trên tổng số {numOfTask} kết quả</Label>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                :
                                                <></>) : <></>
                                        }
                                        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-primary ' + this.props.className}>
                                            <ModalHeader toggle={this.toggleModal}>
                                                {/* <FormGroup row> */}
                                                Chi tiết nhiệm vụ &nbsp;&nbsp;
                                                    {status !== "APPROVED" ?
                                                    (role === "ROLE_SUPERVISOR" ?
                                                        <Button type="submit" style={{ color: "#20A8D8", backgroundColor: "white" }} onClick={() => this.handleDirect(`/supervisor/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button> :
                                                        <Button type="submit" style={{ color: "#20A8D8", backgroundColor: "white" }} onClick={() => this.handleDirect(`/hr/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button>) :
                                                    <></>
                                                }
                                                {/* </FormGroup> */}
                                            </ModalHeader>
                                            <ModalBody>
                                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">

                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Tên nhiệm vụ</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="title" name="title">{title}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Người giao</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="supervisorName" name="supervisorName">{supervisorName}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Sinh viên</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="studentName" name="studentName">{studentName}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Mức độ</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            {
                                                                this.showTaskLevel(level_task)
                                                            }
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Ngày tạo</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="time_created" name="time_created">{this.formatDate(time_created, true)}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Ngày hết hạn</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="time_end" name="time_end">{this.formatDate(time_end, false)}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Trạng thái</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            {
                                                                this.showTaskState(status)
                                                            }
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Đã kiểm duyệt</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            {
                                                                status === 'APPROVED' ? (
                                                                    <i style={{ color: "#4dbd74" }} className="fa fa-check"></i>
                                                                ) : (
                                                                        status === 'PENDING' ? (
                                                                            <i style={{ color: "#f86c6b" }} className="fa fa-close"></i>
                                                                        ) : (
                                                                                <i style={{ color: "#003322" }} className="fa fa-circle-o-notch fa-spin"></i>
                                                                            )
                                                                    )
                                                            }
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Mô tả</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <label dangerouslySetInnerHTML={{ __html: description }} id="description" name="description" />
                                                        </Col>
                                                    </FormGroup>
                                                    {
                                                        (status === 'APPROVED' || status === 'PENDING') ? (
                                                            <FormGroup row>
                                                                <Col md="4">
                                                                    <h6>Nhận xét</h6>
                                                                </Col>
                                                                <Col xs="12" md="8">
                                                                    {
                                                                        (contentComment !== null && contentComment !== '') ? (
                                                                            <Label>{contentComment}</Label>
                                                                        ) : (
                                                                                <Label>N/A</Label>
                                                                            )
                                                                    }

                                                                </Col>
                                                            </FormGroup>
                                                        ) : (
                                                                <></>
                                                            )
                                                    }
                                                </Form>
                                            </ModalBody>
                                            <ModalFooter>
                                                <FormGroup row style={{ marginRight: "185px" }}>
                                                    <>
                                                        {
                                                            this.showButtonChangeStatus(status, id)
                                                        }
                                                    </>
                                                </FormGroup>
                                            </ModalFooter>
                                        </Modal>
                                        <Modal isOpen={this.state.comment} toggle={this.toggleComment}
                                            className={'modal-primary ' + this.props.className}>
                                            <ModalHeader toggle={this.toggleComment}>Nhận xét - đánh giá về nhiệm vụ</ModalHeader>
                                            <ModalBody>
                                                {
                                                    statusUpdate === 4 ? (
                                                        <FormGroup row>
                                                            <Col xs="12" md="12">
                                                                <Input value={this.state.contentCommentNew} type="textarea" rows="5" placeholder="Nhập nhận xét..." onChange={this.handleInputComment} id="contentCommentNew" name="contentCommentNew" />
                                                            </Col>
                                                        </FormGroup>
                                                    ) : (
                                                            <FormGroup row>
                                                                <Col xs="12" md="12">
                                                                    <Input value={this.state.contentCommentNew} type="textarea" rows="5" placeholder="Nhập nhận xét..." onChange={this.handleInputComment} id="contentCommentNew" name="contentCommentNew" />
                                                                </Col>
                                                                <span style={{ marginLeft: "3%" }} className="form-error is-visible text-danger">
                                                                    {this.validator.message('Nhận xét - đánh giá', this.state.contentCommentNew, 'required|max:255')}
                                                                </span>
                                                            </FormGroup>
                                                        )
                                                }
                                            </ModalBody>
                                            <ModalFooter className="p-3">
                                                <Row>
                                                    <Col>
                                                        <Button block color="secondary" onClick={this.toggleComment} style={{ width: "90px" }}>Hủy bỏ</Button>
                                                    </Col>
                                                    <Col>
                                                        <Button onClick={() => this.handleUpdateStatus()} type="submit" color="primary" style={{ width: "90px" }}>Xác nhận</Button>
                                                    </Col>
                                                </Row>
                                            </ModalFooter>
                                        </Modal>
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/supervisor/hr-student-list")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter> */}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Hr_Task;
