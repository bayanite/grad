import React, {useState} from 'react';

const Model = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');

    const fetchForm = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/indexname/${type}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data
            setData(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error); // Log the error
            setError(error.message || 'An error occurred while fetching the data.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const displayUser = async (id_user, id_online_center) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/displayUser/${id_user}/${id_online_center}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteForm = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/delete/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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

    const allForm = async (type) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/index/${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    const detailsForm = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/show/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response.json())
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteQuestion = async (id) => {
        const d = {
            "ids": [id],
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/deleteQusetions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(d)
            });
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }
            console.log("response.ok", response.ok)
            return true
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const addQuestion = async (id1, questions) => {

        const data = {
            "id_paper": id1,
            "body": questions,
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/addQuestions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(data)

            });
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const createModel = async (TypeName, inputValueTitle, inputValueDes, divValues) => {
        const data = {
            "type": TypeName,
            "title": inputValueTitle,
            "description": inputValueDes,
            "body": divValues,
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}paper/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(data)

            });
            if (!response.ok) {
                throw new Error('Failed to delete course.');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const showReview =async (id_online_center) => {
        try {
            const response= await fetch(`${process.env.REACT_APP_API_URL}paper/displayPaper/${id_online_center}`, {
            method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
            },
        });
               return await response.json();
           } catch (error) {
           console.error(error);
          }
           }

        return {
    error,
    loading,
    data,
    fetchForm,
    displayUser,
    deleteForm,
    allForm,
    detailsForm,
    deleteQuestion,
    addQuestion,
    createModel,
    showReview
};
}
;

export default Model;
