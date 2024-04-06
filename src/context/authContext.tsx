'use client';
import { createContext, useContext } from 'react';
// import { loginRequest, registerRequest } from '../api/auth';
import { type AuthProviderProps } from '../types/AuthProviderProps';
import { type AuthContextType } from '../types/AuthContextType';
import { type LoginDataType } from '../types/UserLoginSchema';
import { type UserRegisterData } from '../types/UserRegisterSchema';

// import Cookies from 'js-cookie';

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe estar dentro del proveedor AuthContext');
	}

	return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const signup = async (
		user: UserRegisterData
	): Promise<any> => {
		try {
			// const response = await registerRequest(user);
			// return response;
		} catch (error) {
			console.error('Error en el registro', error);
			return undefined;
		}
	};

	const login = async (
		user: LoginDataType
	): Promise<any> => {
		try {
			// const response = await loginRequest(user);
			// return response;
		} catch (error) {
			console.error('Error en el registro', error);
			return undefined;
		}
	};

	const logout = () => {
		console.log('Realizando logout');
		// Cookies.remove('authToken');
		// Cookies.remove('refreshToken');
	};

	return (
		<AuthContext.Provider
			value={{
				login,
				signup,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
