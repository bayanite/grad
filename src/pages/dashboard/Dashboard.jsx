import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    LineChart,
    Line,
    YAxis,
    XAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from 'recharts';
import CountUp from 'react-countup';
import './Dashboard.scss';
import DashboardApi from "../../hooks/dashboardApi";
import Spinner from 'react-spinner-material';

const AnimatedLineChart = ({ data = [] }) => {
    const years = [...new Set(data.map(entry => entry.year))];
    const [selectedYear, setSelectedYear] = useState(years[0]);

    const handleChangeYear = (event) => {
        setSelectedYear(Number(event.target.value));
    };

    const filteredData = data.filter(entry => entry.year === selectedYear);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
                <label htmlFor="yearSelect">Select Year: </label>
                <select id="yearSelect" value={selectedYear} onChange={handleChangeYear}>
                    {years.map((year,index) => (
                        <option key={index} value={year}>{2024}</option>
                    ))}
                </select>
            </div>
            <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'center' }}>
                <LineChart width={700} height={220} data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line key="bookings" type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line key="certificate" type="monotone" dataKey="certificate" stroke="#84d8b6" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
        </div>
    );
};

const CustomPieChart = ({ data }) => {
    let totalRegistrants = 0;
    let certificatePercentage = 0;

    if (data && data.length > 0) {
        totalRegistrants = data.reduce((acc, curr) => acc + curr.value, 0);
        certificatePercentage = (data[0].value / totalRegistrants) * 100;
    }

    const pieData = [
        { name: data && data[0] && data[0].name, value: certificatePercentage },
        { name: data && data[0] && data[0].name, value: 100 - certificatePercentage },
    ];

    const COLORS = ['#00C49F', '#FFBB28'];
    const legendContent = (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
            {pieData.map((entry, index) => (
                <li key={`legend-${index}`} style={{ marginBottom: '5px' }}>
                    <span style={{
                        backgroundColor: COLORS[index],
                        width: '10px',
                        height: '10px',
                        display: 'inline-block',
                        marginRight: '5px'
                    }} />
                    {entry.name}
                </li>
            ))}
        </ul>
    );

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'center' }}>
                <PieChart width={200} height={200}>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {
                            pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)
                        }
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{
                        fontSize: '14px',
                        fontFamily: 'Tajawal',
                        padding: '5px',
                        display: 'flex',
                        flexDirection: 'column'
                    }} />
                </PieChart>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [countData, setCountData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const [statisticsData, setStatisticsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { count, PieChart, appointments, statistics } = DashboardApi();
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };

    const fetchData = async () => {
        try {
            const [countData, pieChartData, appointmentData, statisticsData] = await Promise.all([
                count(),
                PieChart(),
                appointments(),
                statistics(new Date().getFullYear())
            ]);

            setCountData(countData);
            setPieChartData(pieChartData);
            setAppointmentData(appointmentData.data);
            setStatisticsData(statisticsData.data);
            console.log("ppppppppppppppppppp",statisticsData)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

    return (
        <div className="chart-container">
            {loading ? (
                <div className="spinner-container">
                    <Spinner size={120}  visible={true} />
                </div>
            ) : (
                <>
                    <div className="right_column">
                        <div className="row_top">
                            <div className="row-container">
                                {countData && (
                                    <>
                                        <div className="column1">
                                            <p>المسجلين في المركز</p>
                                            <CountUp start={0} end={countData.centerCount} duration={2} separator=","
                                                     prefix="+" />
                                        </div>
                                        <div className="column3">
                                            <p>المسجلين اون لاين</p>
                                            <CountUp start={0} end={countData.onlineCount} duration={2} separator=","
                                                     prefix="+" />
                                        </div>
                                        <div className="column2">
                                            <p>عدد الزائرين</p>
                                            <CountUp start={0} end={countData.visitorCount} duration={2} separator=","
                                                     prefix="+" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={"CustomPieChart_container"}>
                                <CustomPieChart data={pieChartData.data1} />
                                <CustomPieChart data={pieChartData.data2} />
                            </div>
                        </div>
                        <div className={"row_bottom"}>
                            {statisticsData && statisticsData.length > 0 && <AnimatedLineChart data={statisticsData} />}
                        </div>
                    </div>
                    <div className="left_column">
                        <div className={"date_now"}>{formattedDate}</div>
                        {appointmentData && appointmentData.length > 0 ? (
                            <ul>
                                {appointmentData.map((appointment, index) => (
                                    <li key={index} className="appointment-item">
                                        <div className="info">
                                            <div className="name">{appointment.name_user} {appointment.lastName}</div>
                                            <div className="type">{appointment.type}</div>
                                        </div>
                                        <div className="time-app">{formatTime(appointment.from)} - {formatTime(appointment.to)}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="no-appointment">
                                <p>لايوجد مواعيد متاحة</p>
                            </div>                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
