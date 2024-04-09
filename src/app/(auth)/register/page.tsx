'use client';
import React from 'react';
import { gql, useMutation } from '@apollo/client';

const REGISTER = gql`
	mutation CreateAuthUser($email: String!, $password: String!) {
		createAuthUser(email: $email, password: $password, role: USUARIO_REGULAR) {
			id
			email
			verified
			role
		}
	}
`;
const Register = () => {
	const [createAuthUser, { data, loading, error }] = useMutation(REGISTER);
	console.log("Data: ",data);
	if (loading) console.log("Loading");
	if (error) return <p>Error: {error.message}</p>;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		createAuthUser({ variables: { email: email, password: password } });
	};

	return (
		<div className='flex justify-center items-center h-screen bg-gray-100'>
			<div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full mx-4'>
				<h2 className='text-center text-2xl font-bold mb-6'>Registrate</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							htmlFor='email'
							className='block text-gray-700 text-sm font-bold mb-2'
						>
							Correo electrónico:
						</label>
						<input
							type='email'
							id='email'
							name='email'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							required
						/>
					</div>
					<div className='mb-6'>
						<label
							htmlFor='password'
							className='block text-gray-700 text-sm font-bold mb-2'
						>
							Contraseña:
						</label>
						<input
							type='password'
							id='password'
							name='password'
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							required
						/>
					</div>
					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					>
						Crear cuenta
					</button>
				</form>
			</div>
		</div>
	);
};

export default Register;
