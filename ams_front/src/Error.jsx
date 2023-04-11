import { Card, Empty } from "antd";
import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Card bordered={false} style={{ width: 300 }}>
      <Empty
        description={
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: "red",
            }}
          >
            {error.statusText || error.message}
          </div>
        }
      />
    </Card>
  );
};

export default Error;
