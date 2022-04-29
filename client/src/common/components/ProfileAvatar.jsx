import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

const ProfileAvatar = ({
    firstName,
    lastName,
    city,
    state,
    profileImg,
    tooltip,
    url,
}) => {
    return (
        <>
            {tooltip ? (
                <Tooltip arrow={true} placement="bottom" title={tooltip}>
                    <Avatar
                        src={profileImg}
                        sx={{
                            margin: '0 4px',
                            width: '30px',
                            height: '30px',
                        }}
                    />
                </Tooltip>
            ) : (
                <Avatar
                    src={profileImg}
                    sx={{
                        margin: '0 4px',
                        width: '30px',
                        height: '30px',
                    }}
                />
            )}
        </>
    );
};

export default ProfileAvatar;
