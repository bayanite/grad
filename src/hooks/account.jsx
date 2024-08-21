import React from 'react';

const Account = (toggle, onSave) => {
    const token = localStorage.getItem('token');

    const addAccount = async (nameEmp, passwordEm, selectedRole) => {
        const data = {
            'name': nameEmp,
            'password': passwordEm,
            'role': selectedRole
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                toggle(); // Call toggle function when the request is successful
                onSave();
            } else {
                // Handle error case if needed
                console.error('Error:', result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const getAllAccount = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/indexAll`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const updatePassword = async (id, oldPassword, newPassword) => {
        const data = {
            'id': id,
            'oldPassword': oldPassword,
            'newPassword': newPassword,
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/resetpass`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.status === 'success') {
                return {ok: true, result};
            } else
                return {ok: false, result};
        } catch (error) {
            console.error('Error:', error);
            return {ok: false, result: error};
        }
    }

    const deleteAccount = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}employee/delete/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }
            return true
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return {addAccount, getAllAccount, updatePassword, deleteAccount}
};

export default Account;