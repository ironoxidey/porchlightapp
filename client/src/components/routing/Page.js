import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PAGE_LOAD } from '../../actions/types';

const Page = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (props.title) {
			dispatch({
				type: PAGE_LOAD,
				payload: { pageTitle: props.title },
			});
		} else {
			dispatch({
				type: PAGE_LOAD,
				payload: { pageTitle: '' },
			});
		}
	}, []);
	//console.log(props.children);
	return props.children;
};

export default Page;
