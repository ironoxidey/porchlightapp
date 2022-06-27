import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
//import { EventHostDialog } from '../../common/components';

const ProfileAvatar = ({
    firstName,
    lastName,
    city,
    state,
    profileImg,
    tooltip,
    url,
    hostOffer,
    thisEvent,
}) => {
    //console.log('hostOffer', hostOffer);
    return (
        <>
            {/* <EventHostDialog hostOffer={hostOffer} thisEvent={thisEvent} /> */}
            {tooltip ? (
                <Tooltip arrow={true} placement="bottom" title={tooltip}>
                    <Avatar
                        src={profileImg}
                        sx={{
                            margin: '0 4px',
                            width: '30px',
                            height: '30px',
                            outline: `${
                                hostOffer && !hostOffer.artistViewedOn
                                    ? '1px solid var(--primary-color)'
                                    : hostOffer &&
                                      hostOffer.status === 'ACCEPTED'
                                    ? '1px solid var(--link-color)'
                                    : '1px solid transparent'
                            }`,
                            outlineOffset: '2px',
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
