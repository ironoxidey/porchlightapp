import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';

import { getAllUsers } from '../../actions/auth';

import { Avatar, Autocomplete, Chip, TextField } from '@mui/material';

const UserDataGrid = ({ getAllUsers, users }) => {
    const changesMade = useRef(false);
    const [editRowsModel, setEditRowsModel] = React.useState({});

    const handleEditRowsModelChange = React.useCallback((model) => {
        console.log('model', model);
        setEditRowsModel(model);
    }, []);

    AutocompleteEditInputCell.propTypes = {
        /**
         * GridApi that let you manipulate the grid.
         * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
         */
        api: PropTypes.any.isRequired,
        /**
         * The column field of the cell that triggered the event.
         */
        field: PropTypes.string.isRequired,
        /**
         * The grid row id.
         */
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        /**
         * The cell value, but if the column has valueGetter, use getValue.
         */
        value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
            .isRequired,
    };

    function AutocompleteEditInputCell(props) {
        console.log('AutocompleteEditInputCell props', props);
        const { id, value, api, field } = props;

        const handleChange = async (event) => {
            api.setEditCellValue(
                { id, field, value: event.target.value },
                event
            );
            // Check if the event is not from the keyboard
            // https://github.com/facebook/react/issues/7407
            if (
                event.nativeEvent.clientX !== 0 &&
                event.nativeEvent.clientY !== 0
            ) {
                // Wait for the validation to run
                const isValid = await api.commitCellChange({ id, field });
                if (isValid) {
                    api.setCellMode(id, field, 'view');
                }
            }
        };
        const handleRef = (element) => {
            console.log('handleRef element:', element);
            if (element) {
                element.querySelector(`input[value="${value}"]`).focus();
            }
        };

        return (
            <Autocomplete
                ref={handleRef}
                //id="role"
                name="role"
                multiple
                disableCloseOnSelect
                disableClearable
                value={value}
                options={['ADMIN', 'ARTIST', 'ATTENDER', 'BOOKING', 'HOST']}
                // onChange={(event, value) => {
                //     console.log(params);
                //     onAutocompleteTagChange(event, 'role', value);
                // }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            variant="outlined"
                            name="role"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        error={params.length > 0}
                        sx={{ width: '100%' }}
                        variant="standard"
                        //label={`Role`}
                        name="role"
                    />
                )}
            />
        );
    }

    function renderAutoCompleteEditInputCell(params) {
        console.log('renderAutoCompleteEditInputCell params', params);
        return <AutocompleteEditInputCell {...params} />;
    }

    const onAutocompleteTagChange = (e, theFieldName, val) => {
        //console.log(theFieldName);
        //console.log(Object.keys(formGroups).length);
        changesMade.current = true;
        let targetValue = val;
        //setFormData({ ...formData, [theFieldName]: targetValue });
    };

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const userColumns = [
        //https://codesandbox.io/s/e9o2j?file=/demo.js
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 75,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Avatar alt={`${params.value}`} src={`${params.value}`} />
            ),
        },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: false,
        },
        {
            field: 'role',
            headerName: 'Role(s)',
            width: 300,
            editable: true,
            renderCell: renderAutoCompleteEditInputCell,
            //renderEditCell: renderAutoCompleteEditInputCell(),
        },
        {
            field: 'profile',
            headerName: 'Profile',
            width: 150,
            sortable: false,
        },
    ];

    useEffect(() => {
        if (users) {
            setUserRows(
                users.map((user) => {
                    const userRow = {
                        id: user._id,
                        avatar: user.avatar,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        profile: '',
                    };

                    return userRow;
                })
            );
            console.log(userRows);
        }
    }, [users]);

    const [userRows, setUserRows] = useState([]);

    return (
        <DataGrid
            rows={userRows}
            columns={userColumns}
            pageSize={100}
            rowsPerPageOptions={[]}
            editRowsModel={editRowsModel}
            onEditRowsModelChange={handleEditRowsModelChange}
        />
    );
};

UserDataGrid.propTypes = {
    users: PropTypes.array.isRequired,
    getAllUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    users: state.auth.users,
});

export default connect(mapStateToProps, { getAllUsers })(UserDataGrid);
