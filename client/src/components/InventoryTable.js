import React, { useEffect } from "react";
import { GetInventoryWithFilters } from "../apicalls/inventory";
import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
import { SetLoading } from "../redux/loadersSlice";
import { Table, message } from "antd";

const InventoryTable = ({ filters, userType }) => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + " ML",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) => record.organization.organizationName,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetInventoryWithFilters( filters );
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        dispatch(SetLoading(false));
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>{<Table columns={columns} className="mt-3" dataSource={data} />}</div>
  );
};

export default InventoryTable;