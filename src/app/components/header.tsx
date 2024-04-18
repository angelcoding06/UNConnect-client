'use client';
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
const cookies = new Cookies(null, { path: '/' });

export default function Header() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isGroupsOpen, setIsGroupsOpen] = useState(false);
	const handleLogout = () => {
		cookies.remove('token');
		router.push('/login');
	};

	return (
			<header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
				<div>
					<a href='/' className='text-lg font-bold'>
						Inicio
					</a>
				</div>
				<div className='relative'>
					<button
						className='text-lg font-bold focus:outline-none'
						onClick={() => setIsGroupsOpen(!isGroupsOpen)}
					>
						Grupos
					</button>
					{isGroupsOpen && (
						<div className='absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg'>
							<button
								className='text-black block w-full text-left px-4 py-2 hover:bg-gray-100'
								onClick={() => router.push('/profile')}
							>
								Mis Grupos
							</button>
							<button
								className='text-black block w-full text-left px-4 py-2 hover:bg-gray-100'
								onClick={() => router.push('/allgroups')}
							>
								Buscar Grupos
							</button>
							<button
								className='text-black block w-full text-left px-4 py-2 hover:bg-gray-100'
								onClick={() => router.push('/creategroup')}
							>
								Crear Grupo
							</button>		
						</div>
					)}
				</div>
				<div className='relative'>
					<button
						className='text-lg font-bold focus:outline-none'
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						Menú
					</button>
					{isMenuOpen && (
						<div className='absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg'>
							<button
								className='text-black block w-full text-left px-4 py-2 hover:bg-gray-100'
								onClick={() => router.push('/profile')}
							>
								Mi perfil
							</button>
							<button
								className='text-black block w-full text-left px-4 py-2 hover:bg-gray-100'
								onClick={handleLogout}
							>
								Cerrar sesión
							</button>
						</div>
					)}
				</div>
			</header>
	)
}
