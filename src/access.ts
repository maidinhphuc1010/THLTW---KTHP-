import type { IInitialState } from './services/base/typing';
// import { currentRole } from './utils/ip';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
	const scopes = initialState.authorizedPermissions?.map((item) => item.scopes).flat();

	const role = localStorage.getItem('isLoggedIn'); // 'admin' hoặc 'student'

	return {
		isAdmin: role === 'admin',
		isStudent: role === 'student',
		accessFilter: (route: any) => scopes?.includes(route?.maChucNang) || false,
		manyAccessFilter: (route: any) => route?.listChucNang?.some((role: string) => scopes?.includes(role)) || false,
	};
}
