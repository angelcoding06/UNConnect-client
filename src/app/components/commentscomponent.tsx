import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

const GET_COMMENTS_BY_POST = gql`
	query GetCommentsByPost($postId: String!, $page: Int!) {
		getcommentbyPost(PostId: $postId, page: $page) {
			currentPage
			totalPages
			totalCount
			items {
				Id
				Content
				UserId
				PostId
			}
		}
	}
`;

const CREATE_COMMENT = gql`
	mutation CreateComment($token: String!, $postId: String!, $content: String!) {
		createcomment(token: $token, PostId: $postId, Content: $content) {
			Id
			Content
			UserId
			PostId
		}
	}
`;

const DELETE_COMMENT = gql`
	mutation DeleteComment(
		$token: String!
		$postId: String!
		$CommentId: String!
	) {
		deletecomment(token: $token, PostId: $postId, CommentId: $CommentId)
	}
`;

const CommentsComponent = ({
	postId,
	token,
}: {
	token: string;
	postId: string;
}) => {
	const { data, loading, error } = useQuery(GET_COMMENTS_BY_POST, {
		variables: { postId, page: 1 },
	});

	const [showModal, setShowModal] = useState<boolean>(false);
	const [newComment, setNewComment] = useState<string>('');

	const [createCommentMutation] = useMutation(CREATE_COMMENT);
	const [deleteCommentMutation] = useMutation(DELETE_COMMENT);

	const handleCreateComment = async () => {
		try {
			await createCommentMutation({
				variables: { token, postId, content: newComment },
			});
			setNewComment('');
		} catch (error) {
			console.error('Error creating comment:', error);
		}
	};

	const handleDeleteComment = async (CommentId: string) => {
		try {
			await deleteCommentMutation({ variables: { token, postId, CommentId } });
		} catch (error) {
			alert('Error deleting comment:' + error);
		}
	};

	const handleShowModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			handleCloseModal();
		}
	};

	if (loading) return <p>Loading comments...</p>;

	return (
		<div className='border border-gray-300 p-4 rounded-lg'>
			<p className='mb-2'>
				Comments: {data?.getcommentbyPost?.totalCount || 0}
			</p>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded'
				onClick={handleShowModal}
			>
				Ver comentarios
			</button>
			{showModal && (
				<div
					className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50'
					onClick={handleModalClick}
				>
					<div className='bg-white p-6 rounded-lg w-96'>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-lg font-bold'>Comentarios</h2>
							<button className='text-gray-600' onClick={handleCloseModal}>
								X
							</button>
						</div>
						{data?.getcommentbyPost?.items.map((comment: any) => (
							<div
								key={comment.Id}
								className='border-b border-gray-200 mb-4 pb-4'
							>
								<p>{comment.Content}</p>
								<button
									className='text-sm text-red-500'
									onClick={() => handleDeleteComment(comment.Id)}
								>
									Eliminar
								</button>
							</div>
						))}
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className='w-full border border-gray-200 rounded-lg p-2 mt-4'
							placeholder='Escribe tu comentario...'
						></textarea>
						<button
							onClick={handleCreateComment}
							className='bg-blue-500 text-white px-4 py-2 rounded-lg mt-4'
						>
							Comentar
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CommentsComponent;
