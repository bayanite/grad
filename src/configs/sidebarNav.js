import {FaBook, FaClipboardList, FaUserCog} from 'react-icons/fa';
import {IoHome} from "react-icons/io5";
import {SiGoogleforms} from "react-icons/si";
import {RiQuestionAnswerFill} from "react-icons/ri";
import {PiCertificateFill} from "react-icons/pi";
import {FaUsersGear} from "react-icons/fa6";

const sidebarNav = (userRole) => {
    const baseNav = [
    {
        path: '/',
        name: 'الصفحة الرئيسية',
        icon: <IoHome/>

    },
    {
        path: '/courses',
        name: 'إدارة الدورات',
        icon: <FaBook/>

    },
    {
        path: '/model',
        name: 'إدارة النماذج',
        icon: <SiGoogleforms/>

    },
    {
        path: '/adviser',
        name: 'إدارة الاستشارات',
        icon: <RiQuestionAnswerFill/>

    },
    {
        path: '/users',
        name: 'إدارة المستخدمين',
        icon: <FaUsersGear />
    },
    {
        path: '/certificate',
        name: 'إدارة الشهادات',
        icon: <PiCertificateFill/>

    },
    {
        path: '/questionBank',
        name: 'إدارة بنك الاسئلة',
        icon: <FaClipboardList/>

    }
];
if (userRole === 0 ) {
    baseNav.push({
        path: '/stats',
        name: 'إدارة الحسابات',
        icon: <FaUserCog />
    });
}

return baseNav;
};

export default sidebarNav