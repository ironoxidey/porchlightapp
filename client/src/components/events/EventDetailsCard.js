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
                        cursor: !isMe ? 'auto' : `pointer`,
                        color: isBlank ? 'var(--link-color)' : 'inherit',
                        backgroundImage: isBlank
                            ? 'repeating-linear-gradient(45deg,     rgba(255,255,255,0.05) 5px,    rgba(255,255,255,.05) 15px,    transparent 15px,    transparent 30px)'
                            : 'none',
                        padding: '8px 16px!important',
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
