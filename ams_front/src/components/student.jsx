import axios from "axios";
import { Card, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import base from "../baseURL";
import { useNavigate } from "react-router-dom";

const Student = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("type") !== "student") {
      message.error("You are not a student!");
      navigate("/");
    } else {
      axios({
        method: "get",
        url: `${base}/getAttendance/?id=${localStorage.getItem("id")}`,
      })
        .then(res => {
          setData(
            res.data.map((e, i) => ({
              key: i,
              date: e.Date.slice(0, 10),
              course: e.Name,
              course_id: e.Course_ID,
              status: e.Status,
            }))
          );

          setColumns([
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
            },
            {
              title: "CID",
              dataIndex: "course_id",
              key: "course_id",
            },
            {
              title: "Course",
              dataIndex: "course",
              key: "course",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
            },
          ]);
        })
        .catch(err => message.error(err.message));
    }
  }, []);

  return (
    <Card
      bordered={false}
      title={
        <div style={{ color: "red", fontWeight: 700, fontSize: 18 }}>
          Student Portal
        </div>
      }
    >
      <Table
        caption={
          <div style={{ textAlign: "left", fontWeight: 700 }}>
            Weekly Attendance Report
          </div>
        }
        dataSource={data}
        columns={columns}
      />
    </Card>
  );
};

export default Student;
