import React from 'react';

const Exam = () => {
    const token = localStorage.getItem('token');

    const addBank = async (inputValueTitle,inputValueDes,divValues) => {

        const data = {
            "title": inputValueTitle,
            "description": inputValueDes,
            "body": divValues,
        }

        try {
         const response=  await fetch(`${process.env.REACT_APP_API_URL}exam/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error( 'Failed to delete course.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteBank = async (id) => {
        try {
       const response= await fetch(`${process.env.REACT_APP_API_URL}exam/delete/${id}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error( 'Failed to delete course.');
        }
        return true
      }   catch (error) {
        console.error('Error:', error);
      }

    }

    const allExam = async () => {
       try{
        const  response=await fetch(`${process.env.REACT_APP_API_URL}exam/index`, {
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

    const detailsBank = async (id) => {
        try{
        const  response= await fetch(`${process.env.REACT_APP_API_URL}exam/show/${id}`,{
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

    const deleteQuestionExam = async (id) => {
        const d={
            "ids":[id],
        }
        try {
            const response= await fetch(`${process.env.REACT_APP_API_URL}exam/deleteQusetions`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(d)
             });
             if (!response.ok) {
                throw new Error( 'Failed to delete course.');
              }

             return true
           }catch (error) {
            console.error('Error:', error);
          }
    }

    const addQuestionExam = async (id1,questions) => {

        const data = {
            "id_exame":id1,
            "body":questions,
        }

        try {
            const response= await fetch(`${process.env.REACT_APP_API_URL}exam/addQuestions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(data)

            });
            if (!response.ok) {
                throw new Error( 'Failed to delete course.');
            }

        } catch (error) {
            console.error('Error:', error);
          }

    };

    return {addBank,deleteBank,allExam,detailsBank,deleteQuestionExam,addQuestionExam}
};

export default Exam;