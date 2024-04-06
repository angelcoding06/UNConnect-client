import {type UserRegisterData} from './UserRegisterSchema';
import {type LoginDataType} from './UserLoginSchema';

export type AuthContextType = {
	login: (user: LoginDataType) => Promise<any>;
	signup: (user: UserRegisterData) => Promise<any>;
	logout: () => void;
};
