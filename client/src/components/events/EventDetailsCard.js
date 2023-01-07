import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Divider } from '@mui/material';

const EventDetailsCard = ({
    fieldName,
    icon,
    isMe,
    isBlank,
    jumpTo,
    children,
}) => {
    return (
        <>
            {(!isBlank || isMe) && ( //if the field is not blank OR if it's me
                <Grid
                    item
                    sx={{
                        marginTop: '0',
                        cursor: !isMe
                            ? 'auto'
                            : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 24 24"><path d="M5 18.08V19h.92l9.06-9.06-.92-.92z" opacity=".3"></path><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"></path></svg>") 0 24, auto`,
                        color: isBlank ? 'var(--link-color)' : 'inherit',
                    }}
                    onClick={() => {
                        if (isMe) {
                            jumpTo(fieldName);
                        }
                    }}
                    xs={12}
                    md={6}
                    className={fieldName}
                >
                    {React.cloneElement(icon, {
                        // onClick: () => {
                        //     if (isMe) {
                        //         jumpTo(fieldName);
                        //     }
                        // },
                        style: {
                            cursor: isMe ? 'pointer' : 'auto',
                            color: isBlank
                                ? 'var(--link-color)'
                                : 'var(--light-color)',
                        },
                    })}
                    <div>{children}</div>
                    <Divider />
                </Grid>
            )}
        </>
    );
};

EventDetailsCard.propTypes = {
    fieldName: PropTypes.string,
    isMe: PropTypes.bool,
    isBlank: PropTypes.bool,
    jumpTo: PropTypes.func,
    icon: PropTypes.element,
};

export default EventDetailsCard;
