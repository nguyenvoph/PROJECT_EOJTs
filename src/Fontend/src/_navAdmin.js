export default {
  items: [
    {
      name: 'Dashboard',
      url: '/admin',
      icon: 'icon-screen-desktop',
    },
    {
      name: 'Thông số lịch trình',
      url: '/admin/scheduleparameters',
      icon: 'icon-calendar',
    },
    {
      name: 'Chuyên ngành',
      url: '/admin/specialized',
      icon: 'icon-compass',
    },
    {
      name: 'Kỹ năng',
      url: '/admin/skill',
      icon: 'icon-puzzle',
    },
    {
      name: 'Nhập tập tin',
      url: '/admin/importfiles',
      icon: 'icon-folder',
    },
    {
      name: 'Doanh nghiệp đề xuất',
      url: '/admin/business-proposed',
      icon: 'icon-note',
    },
    {
      name: 'Quản lý tài khoản',
      url: '/admin/admin_account',
      icon: 'icon-user',
      children: [
        {
          name: 'Tài khoản sinh viên',
          url: '/admin/admin_account/studentList',
          icon: 'icon-graduation',
        },
        {
          name: 'Tài khoản doanh nghiệp',
          url: '/admin/admin_account/businessList',
          icon: 'icon-briefcase',
        },
      ]
    },
    {
      name: 'Quản lý danh sách',
      url: '/admin/list_management',
      icon: 'icon-list',
      children: [
        {
          name: 'Danh sách sinh viên',
          url: '/admin/list_management/student_list',
          icon: 'icon-graduation',
        },
        {
          name: 'Danh sách doanh nghiệp',
          url: '/admin/list_management/business_list',
          icon: 'icon-briefcase',
        },
      ]
    },
    {
      name: 'Tuyển dụng',
      url: '/admin/Job_Post_List',
      icon: 'icon-directions',
    },
    {
      name: 'Thông báo',
      url: '/admin/informmessage',
      icon: 'icon-envelope-letter',
    },
    {
      name: 'Đánh giá',
      url: '/admin/report',
      icon: 'icon-docs',
    },
    {
      name: 'Quản lí câu hỏi',
      url: '/admin/question',
      icon: 'icon-question',
    },
    {
      name: 'Thống kê khảo sát',
      url: '/admin/answer-statistics',
      icon: 'icon-book-open',
    },
    {
      name: 'Nhật ký hoạt động',
      url: '/admin/log',
      icon: 'icon-speedometer',
    }
  ]
};
