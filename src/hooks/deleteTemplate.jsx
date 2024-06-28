const deleteCourse = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}course/delete/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,

                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to delete course.');
        }
        return true; // Return true to indicate successful deletion
    } catch (error) {
        console.error(error);
        return false; // Return false to indicate failure
    }
};

export default deleteCourse;
