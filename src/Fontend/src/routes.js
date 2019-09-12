import React from 'react';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Test = React.lazy(() => import('./views/Test/Test'));
const Excels = React.lazy(() => import('./views/Excels/Excels.js'));
const ScheduleParameters = React.lazy(() => import('./views/ScheduleParameters/ScheduleParameters.js'));
const Company = React.lazy(() => import('./views/Company/Company.js'));
const Account_Detail = React.lazy(() => import('./views/Account/Account_Detail.js'));
const Account_Update = React.lazy(() => import('./views/Account/Account_Update.js'));
const Company_Update = React.lazy(() => import('./views/Company/Company_Update.js'));
const ChangePassword = React.lazy(() => import('./views/Account/ChangePassword.js'));
const Invitation = React.lazy(() => import('./views/Invitation/Invitation.js'));
const Invitation_Detail = React.lazy(() => import('./views/Invitation/Invitation_Detail.js'));
const Invitation_Create = React.lazy(() => import('./views/Invitation/Invitation_Create.js'));
const Ojt_Registration = React.lazy(() => import('./views/Ojt_Registration/Ojt_Registration.js'));
const Profile = React.lazy(() => import('./views/Student/Student.js'));
const student_list = React.lazy(() => import('./views/list_management/student_list.js'));
const business_list = React.lazy(() => import('./views/list_management/business_list.js'));
const Official_List = React.lazy(() => import('./views/Official_List/Official_List.js'));
const Student_Detail = React.lazy(() => import('./views/Official_List/Student_Detail.js'));
const Details_Task = React.lazy(() => import('./views/Details_Task/Details_Task.js'));
const Job_Post = React.lazy(() => import('./views/Job_Post/Job_Post.js'));
const Update_Job = React.lazy(() => import('./views/Job_Post/Update_Job.js'));
const Add_Job = React.lazy(() => import('./views/Job_Post/Add_Job.js'));
const Specialized = React.lazy(() => import('./views/Specialized/Specialized.js'));
const Specialized_Create = React.lazy(() => import('./views/Specialized/Specialized_Create.js'));
const Specialized_Update = React.lazy(() => import('./views/Specialized/Specialized_Update.js'));
const Skill = React.lazy(() => import('./views/Skill/Skill.js'));
const Skill_Create = React.lazy(() => import('./views/Skill/Skill_Create.js'));
const Skill_Update = React.lazy(() => import('./views/Skill/Skill_Update.js'));
const ManageAccount = React.lazy(() => import('./views/Account/ManageAccount.js'));
const Account_Create = React.lazy(() => import('./views/Account/Account_Create.js'));
const User_Student = React.lazy(() => import('./views/Account_Admin/User_Student.js'));
const User_Student_Create = React.lazy(() => import('./views/Account_Admin/User_Student_Create.js'));
const User_Business = React.lazy(() => import('./views/Account_Admin/User_Business.js'));
const User_Business_Create = React.lazy(() => import('./views/Account_Admin/User_Business_Create.js'));
const Job_Post_List = React.lazy(() => import('./views/Job_Post/Job_Post_List.js'));
const Job_Post_List_HR = React.lazy(() => import('./views/Job_Post/Job_Post_List_HR.js'));
const InformMessage = React.lazy(() => import('./views/InformMessage/InformMessage.js'));
const InformMessage_Detail = React.lazy(() => import('./views/InformMessage/InformMessage_Detail.js'));
const Create_InformMessage = React.lazy(() => import('./views/InformMessage/Create_InformMessage.js'));
const Report = React.lazy(() => import('./views/Report/Report.js'));
const Report_Detail = React.lazy(() => import('./views/Report/Report_Detail.js'));
const Create_Report = React.lazy(() => import('./views/Report/Create_Report.js'));
const Update_Report = React.lazy(() => import('./views/Report/Update_Report.js'));
const Hr_Students = React.lazy(() => import('./views/Hr_Students/Hr_Students.js'));
const Hr_Student_Detail = React.lazy(() => import('./views/Hr_Students/Hr_Student_Detail.js'));
const Hr_Task = React.lazy(() => import('./views/Hr_Task/Hr_Task.js'));
const Hr_Task_Create = React.lazy(() => import('./views/Hr_Task/Hr_Task_Create.js'));
const Hr_Task_Detail = React.lazy(() => import('./views/Hr_Task/Hr_Task_Detail.js'));
const Hr_Task_Update = React.lazy(() => import('./views/Hr_Task/Hr_Task_Update.js'));
const Business_Detail = React.lazy(() => import('./views/Company/Business_Detail.js'));
// const Feedback = React.lazy(() => import('./views/Feedback/Feedback.js'));
// const Feedback_Detail = React.lazy(() => import('./views/Feedback/Feedback_Detail.js'));
const BusinessProposed = React.lazy(() => import('./views/BusinessProposed/BusinessProposed.js'));
const BusinessProposed_Detail = React.lazy(() => import('./views/BusinessProposed/BusinessProposed_Detail.js'));
const BusinessProposed_Update = React.lazy(() => import('./views/BusinessProposed/BusinessProposed_Update.js'));
const SiteAdmin = React.lazy(() => import('./views/Dashboard/SiteAdmin.js'));
const SiteHr = React.lazy(() => import('./views/Dashboard/SiteHr.js'));
const AnswerStatistics = React.lazy(() => import('./views/AnswerStatistics/AnswerStatistics.js'));
const SiteSupervisor = React.lazy(() => import('./views/Dashboard/SiteSupervisor.js'));
const Question = React.lazy(() => import('./views/Question/Question.js'));
const Add_Question = React.lazy(() => import('./views/Question/Add_Question.js'));
const Update_Question = React.lazy(() => import('./views/Question/Update_Question.js'));
const Log = React.lazy(() => import('./views/Log/Log.js'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/test', exact: true, name: 'Tests', component: Test },
  { path: '/admin/importfiles', exact: true, name: 'Nhập tập tin', component: Excels },
  { path: '/admin/scheduleparameters', exact: true, name: 'Thông số lịch trình', component: ScheduleParameters },
  { path: '/company', exact: true, name: 'Chỉnh sửa thông tin tài khoản', component: Company },
  { path: '/account_detail', exact: true, name: 'Thông tin tài khoản', component: Account_Detail },
  { path: '/account_detail/account_update', exact: true, name: 'Chỉnh sửa thông tin tài khoản', component: Account_Update },
  { path: '/company/update', exact: true, name: 'Chỉnh sửa', component: Company_Update },
  { path: '/account/changepassword', exact: true, name: 'Đổi mật khẩu', component: ChangePassword },
  { path: '/hr/invitation', exact: true, name: 'Lời mời', component: Invitation },
  { path: '/hr/invitation/detail', exact: true, name: 'Chi tiết lời mời', component: Invitation_Detail },
  { path: '/hr/invitation/new', exact: true, name: 'Gửi lời mời cho sinh viên', component: Invitation_Create },
  { path: '/hr/ojt_registration', exact: true, name: 'DSSV đăng kí thực tập', component: Ojt_Registration },
  { path: '/student/:email', exact: true, name: 'Chi tiết', component: Profile },
  { path: '/admin/list_management/student_list', exact: true, name: 'Danh sách sinh viên', component: student_list },
  { path: '/admin/list_management/business_list', exact: true, name: 'Danh sách doanh nghiệp', component: business_list },
  { path: '/hr/official_list', exact: true, name: 'Danh sách sinh viên', component: Official_List },
  { path: '/student-detail/:email', exact: true, name: 'Thông tin chi tiết sinh viên', component: Student_Detail },
  { path: '/details_task/:email', exact: true, name: 'Nhiệm vụ', component: Details_Task },
  { path: '/job-post/:id', exact: true, name: 'Thông tin tuyển dụng', component: Job_Post },
  { path: '/job_post/update_job/:id', exact: true, name: 'Chi tiết bài đăng tuyển dụng', component: Update_Job },
  { path: '/hr/job_post_list_hr/add_job_post', exact: true, name: 'Tạo bài đăng tuyển dụng mới', component: Add_Job },
  { path: '/admin', exact: true, name: 'Trang chủ', component: SiteAdmin },
  { path: '/hr', exact: true, name: 'Trang chủ', component: SiteHr },
  // { path: '/hr', exact: true, name: 'Hr', component: Dashboard },
  { path: '/supervisor', exact: true, name: 'Trang chủ', component: SiteSupervisor },
  { path: '/admin/specialized', exact: true, name: 'Danh sách ngành', component: Specialized },
  { path: '/admin/specialized/create', exact: true, name: 'Tạo chuyên ngành mới', component: Specialized_Create },
  { path: '/admin/specialized/update/:id', exact: true, name: 'Cập nhật chuyên ngành', component: Specialized_Update },
  { path: '/admin/skill', exact: true, name: 'Danh sách kỹ năng', component: Skill },
  { path: '/admin/skill/create', exact: true, name: 'Tạo kỹ năng mới', component: Skill_Create },
  { path: '/admin/skill/update/:id', exact: true, name: 'Cập nhật kỹ năng mới', component: Skill_Update },
  { path: '/hr/manage_account', exact: true, name: 'Danh sách tài khoản Supervisor', component: ManageAccount },
  { path: '/account/create', exact: true, name: 'Tạo tài khoản Supervisor', component: Account_Create },
  { path: '/admin/admin_account/studentList', exact: true, name: 'Danh sách tài khoản học sinh', component: User_Student },
  { path: '/admin/admin_account/studentList/create', exact: true, name: 'Tạo tài khoản học sinh mới', component: User_Student_Create },
  { path: '/admin/admin_account/businessList', exact: true, name: 'Danh sách tài khoản doanh nghiệp', component: User_Business },
  { path: '/admin/admin_account/businessList/create', exact: true, name: 'Tạo tài khoản doanh nghiệp mới', component: User_Business_Create },
  { path: '/admin/job_post_list', exact: true, name: 'Danh sách thông tin tuyển dụng', component: Job_Post_List },
  { path: '/hr/job_post_list_hr', exact: true, name: 'Danh sách bài đăng tuyển dụng', component: Job_Post_List_HR },
  { path: '/admin/informmessage', exact: true, name: 'Thông báo', component: InformMessage },
  { path: '/hr/informmessage', exact: true, name: 'Thông báo', component: InformMessage },
  { path: '/supervisor/informmessage', exact: true, name: 'Thông báo', component: InformMessage },
  { path: '/admin/informmessage/informmessage_detail/:id', exact: true, name: 'Chi tiết thông báo', component: InformMessage_Detail },
  { path: '/hr/informmessage/informmessage_detail/:id', exact: true, name: 'Chi tiết thông báo', component: InformMessage_Detail },
  { path: '/supervisor/informmessage/informmessage_detail/:id', exact: true, name: 'Chi tiết thông báo', component: InformMessage_Detail },
  { path: '/admin/informmessage/create_informmessage', exact: true, name: 'Soạn thông báo', component: Create_InformMessage },
  { path: '/hr/informmessage/create_informmessage', exact: true, name: 'Soạn thông báo', component: Create_InformMessage },
  { path: '/supervisor/report', exact: true, name: 'Đánh giá', component: Report },
  { path: '/hr/report', exact: true, name: 'Đánh giá', component: Report },
  { path: '/admin/report', exact: true, name: 'Đánh giá', component: Report },
  { path: '/supervisor/report/report_detail/:id', exact: true, name: 'Chi tiết Đánh giá', component: Report_Detail },
  { path: '/hr/report/report_detail/:id', exact: true, name: 'Chi tiết Đánh giá', component: Report_Detail },
  { path: '/admin/report/report_detail/:id', exact: true, name: 'Chi tiết Đánh giá', component: Report_Detail },
  { path: '/hr/report/create_report/:id', exact: true, name: 'Tạo Đánh giá', component: Create_Report },
  { path: '/supervisor/report/create_report/:id', exact: true, name: 'Tạo Đánh giá', component: Create_Report },
  { path: '/hr/report/update_report/:id', exact: true, name: 'Chỉnh sửa Đánh giá', component: Update_Report },
  { path: '/supervisor/report/update_report/:id', exact: true, name: 'Chỉnh sửa Đánh giá', component: Update_Report },
  { path: '/supervisor/hr-student-list', exact: true, name: 'Danh sách sinh viên', component: Hr_Students },
  { path: '/supervisor/hr-student-list/details/:email', exact: true, name: 'Chi tiết sinh viên', component: Hr_Student_Detail },
  { path: '/supervisor/hr-task', exact: true, name: 'Danh sách nhiệm vụ', component: Hr_Task },
  { path: '/supervisor/hr-task/create', exact: true, name: 'Tạo nhiệm vụ mới', component: Hr_Task_Create },
  { path: '/supervisor/hr-task/details/:id', exact: true, name: 'Chi tiết nhiệm vụ', component: Hr_Task_Detail },
  { path: '/supervisor/hr-task/update/:id', exact: true, name: 'Chỉnh sửa nhiệm vụ', component: Hr_Task_Update },
  { path: '/hr/hr-task', exact: true, name: 'Danh sách nhiệm vụ', component: Hr_Task },
  { path: '/hr/hr-task/create', exact: true, name: 'Tạo nhiệm vụ mới', component: Hr_Task_Create },
  { path: '/hr/hr-task/details/:id', exact: true, name: 'Chi tiết nhiệm vụ', component: Hr_Task_Detail },
  { path: '/hr/hr-task/update/:id', exact: true, name: 'Chỉnh sửa nhiệm vụ', component: Hr_Task_Update },
  { path: '/admin/list_management/business_list/Business_Detail/:email', exact: true, name: 'Chi tiết doanh nghiệp', component: Business_Detail },
  { path: '/Business_Detail/:email', exact: true, name: 'Thông tin tài khoản', component: Business_Detail },
  // { path: '/feedback/feedback', exact: true, name: 'Phản hồi', component: Feedback },
  // { path: '/feedback/feedback_detail/:id', exact: true, name: 'Chi tiết phản hồi', component: Feedback_Detail },
  { path: '/admin/business-proposed', exact: true, name: 'Doanh nghiệp đề xuất', component: BusinessProposed },
  { path: '/admin/business-proposed/:id', exact: true, name: 'Chi tiết doanh nghiệp đề xuất', component: BusinessProposed_Detail },
  { path: '/admin/business-proposed/update/:id', exact: true, name: 'Chỉnh sửa chi tiết doanh nghiệp đề xuất', component: BusinessProposed_Update },
  { path: '/admin/answer-statistics', exact: true, name: 'Thống kê kết quả khảo sát', component: AnswerStatistics },
  { path: '/admin/question', exact: true, name: 'Quản lí câu hỏi', component: Question },
  { path: '/admin/question/new', exact: true, name: 'Tạo mới câu hỏi', component: Add_Question },
  { path: '/admin/question/update/:id', exact: true, name: 'Chỉnh sửa câu hỏi', component: Update_Question },
  { path: '/admin/log', exact: true, name: 'Lịch sử log của hệ thống', component: Log }
];

export default routes;
