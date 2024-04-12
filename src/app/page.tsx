'use client';
import Image from 'next/image'
import Header from './components/header'
import { gql } from '@apollo/client';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';
import LikesComponent from './components/likescomponent';
import CommentsComponent from './components/commentscomponent';
const cookies = new Cookies(null, { path: '/' });

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


const UPDATE_COMMENT = gql`
	mutation UpdateComment($token: String!, $postId: String!, $Content: String!) {
		updateLike(token: $token, PostId: $postId, Content: $Content) {
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
		$commentId: String!
	) {
		deletecomment(token: $token, PostId: $postId, commentId: $commentId)
	}
`;

const GET_FEED = gql`
	query GetFeed($token: String!, $page: Int!) {
		getFeed(token: $token, page: $page) {
			currentPage
			totalPages
			totalCount
			items {
				Id
				Content
				Media
				UserId
			}
		}
	}
`;
const FeedPage = () => {
	const token = cookies.get('token');

	const { loading, error, data } = useQuery(GET_FEED, {
		variables: { token, page: 1 },
	});
	console.log(data)

	// const { data: commentsData, error: commentsError } = useQuery(
	// 	GET_COMMENTS_BY_POST,
	// 	{
	// 		variables: { postId: selectedPost?.Id, page: 1 },
	// 		skip: !selectedPost,
	// 	}
	// );

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<main>
			<Header />
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 px-16 py-8'>
				{data.getFeed.items.map((post: any) => (
					<div key={post.Id} className='bg-white p-4 rounded-lg shadow'>
						<h3 className='text-lg font-sans'>{post.Content}</h3>
						<LikesComponent postId={post.Id} token={token} />
						<CommentsComponent postId={post.Id} token={token}/>
					</div>
				))}
			</div>
		</main>
	);
};

export default FeedPage;
