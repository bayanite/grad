import './model.scss'
import '../courses/view courses/courses.scss'
import React, {useState} from "react";
import Form from "./form/form";
import Questionnaire from "./questionnaire/questionnaire";

const Model = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    //  Functions to handle Tab Switching
    const handleTab1 = () => {
        // update the state to tab1
        setActiveTab("tab1");
    };
    const handleTab2 = () => {
        // update the state to tab2
        setActiveTab("tab2");
    };

    return (

        <div className="sub-con">
            <ul className="nav">
                <li id={"tab1"}
                    className={activeTab === "tab1" ? "active" : ""}
                    onClick={handleTab1}
                >
                    الاستمارات
                </li>
                <li id={"tab2"}
                    className={activeTab === "tab2" ? "active" : ""}
                    onClick={handleTab2}
                >
                    الاستبيانات
                </li>
            </ul>

            <div className="outlet">
                {activeTab === "tab1" ? <Form TypeName={"استمارة"}/> : <Questionnaire TypeName={"استبيان"}/>}
            </div>
        </div>

    );
};
export default Model;