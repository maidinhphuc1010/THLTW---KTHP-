export default [
	{
		path: '/simple-login',
		layout: false,
		component: './Auth/SimpleLogin',
	},
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu/Dashboard',
		icon: 'HomeOutlined',
		access: (ctx: any) => ctx.isAdmin || ctx.isStudent, // Cả admin và user đều xem được
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/admin-admin',
		name: 'Quản lý nhân viên ',
		component: './Admin/AdminAdmin',
		icon: 'TeamOutlined',
		access: 'isAdmin', // Chỉ admin xem được
	},
	{
		path: '/student-admin',
		name: 'Quản lý sinh viên ',
		component: './Student/StudentAdmin',
		icon: 'UserOutlined',
		access: 'isAdmin', // Chỉ admin xem được
	},
	{
		path: '/device-admin',
		name: 'Quản lý thiết bị ',
		component: './Device/DeviceAdmin',
		icon: 'AppstoreOutlined',
		access: 'isAdmin', // Chỉ admin xem được
	},
	{
		path: '/borrow-manager-tabs',
		name: 'Quản lý mượn trả  ',
		component: './BorrowManager/BorrowManagerTabs',
		icon: 'AppstoreAddOutlined',
		access: 'isAdmin', // Chỉ admin xem được
	},
	{
		path: '/borrow-stats',
		name: 'Thống kê mượn thiết bị',
		component: './Stastis/BorrowStatsPage',
		icon: 'BarChartOutlined',
		access: 'isAdmin', // Chỉ admin xem được
	},
	{
		path: '/borrow-device',
		name: 'Mượn thiết bị',
		component: './Borrow/BorrowDevice',
		icon: 'ShoppingCartOutlined',
		access: 'isStudent', // Chỉ user/sinh viên xem được
	},
	{
		path: '/student-borrow-history',
		name: 'Lịch sử mượn thiết bị',
		component: './Borrow/StudentBorrowHistory',
		icon: 'HistoryOutlined',
		access: 'isStudent', // Chỉ user/sinh viên xem được
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
