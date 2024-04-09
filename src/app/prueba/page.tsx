'use client';
import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });
const CREATE_POST = gql`
	mutation createPost($token: String!, $Content: String!, $Media: [String!]!) {
		createPost(token: $token, Content: $Content, Media: $Media) {
			Id
			Content
			Media
			GroupId
			UserId
		}
	}
`;

const CreatePost = () => {
	const Token = cookies.get('token');
	const [createPostMutation, { data, loading, error }] =
		useMutation(CREATE_POST);

	const [content, setContent] = useState('');
	const [mediaFiles, setMediaFiles] = useState<string[]>([]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		for (let i = 0; i < mediaFiles.length; i++) {
			formData.append('files', mediaFiles[i]);
		}

		try {
			const response = await fetch(
				'http://localhost:8000/upload-file/?UserId=123123124',
				{
					method: 'POST',
					body: formData,
				}
			);
			const data = await response.json();
			console.log('Response:', data);

			if (response.ok) {
				const ids = data.ids;
				await createPostMutation({
					variables: { token: Token, Content: content, Media: ids },
				});

				// Limpiar formulario y estado después de la creación exitosa del post
				setContent('');
				setMediaFiles([]);
			} else {
				console.error('Error uploading file:', data.message);
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const handleFileChange = (e:any) => {
		const files = e.target.files;
		setMediaFiles([...mediaFiles, ...files]);
	};

	return (
		<div className='max-w-lg mx-auto mt-8'>
			<h2 className='text-xl font-semibold mb-4'>Create Post</h2>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label htmlFor='content' className='block font-medium mb-1'>
						Content:
					</label>
					<textarea
						id='content'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
					/>
				</div>
				<div className='mb-4'>
					<label htmlFor='file' className='block font-medium mb-1'>
						Select Files:
					</label>
					<input
						type='file'
						multiple
						id='file'
						onChange={handleFileChange}
						className='w-full'
					/>
				</div>
				<button
					type='submit'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
				>
					Create Post
				</button>
			</form>
		</div>
	);
};

export default CreatePost;
