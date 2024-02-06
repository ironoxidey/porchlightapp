import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PAGE_LOAD } from '../../actions/types';

const Page = (props) => {
    const getURL = useLocation();
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.title) {
            dispatch({
                type: PAGE_LOAD,
                payload: { pageTitle: props.title, pageURL: getURL.pathname },
            });
        } else {
            dispatch({
                type: PAGE_LOAD,
                payload: { pageTitle: '', pageURL: '' },
            });
        }
    }, []);
    //console.log(props.children);
    return props.children;
};

export default Page;
