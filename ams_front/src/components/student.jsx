import axios from "axios";
import { Card, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import base from "../baseURL";

const Student = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${base}/getAttendance/?id=${localStorage.getItem("id")}`,
    })
      .then(res => {
        setData(res.data);
        setColumns([
          {
            title: "Date",
            dataIndex: "date",
            key: "date",
          },
          {
            title: "Course ID",
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
  }, []);

  return (
    <Card>
      <Table dataSource={data} columns={columns} />
    </Card>
  );
};

export default Student;
