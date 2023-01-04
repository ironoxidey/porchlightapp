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
                        cursor: isMe ? 'pointer' : 'auto',
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
