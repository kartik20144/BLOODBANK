import React, { useEffect } from "react";
import { SetLoading } from "../../../redux/loadersSlice";
import { Modal, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllOrganizationsOfADonar,
  GetAllOrganizationsOfAHospital,
} from "../../../apicalls/users";
import { getDateFormat } from "../../../utils/helpers";
import InventoryTable from "../../../components/InventoryTable";

const Organizations = ({ userType }) => {
  const [showHistoryModal, setShowHistoryModel] = React.useState(false);
  const { currentUser } = useSelector((state) => state.users);
  const [data, setData] = React.useState([]);
  const [selectedOrganization, setSelectedOrganization] = React.useState(null);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (userType === "hospital") {
        response = await GetAllOrganizationsOfAHospital();
      } else {
        response = await GetAllOrganizationsOfADonar();
      }
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

  const columns = [
    {
      title: "Name",
      dataIndex: "organizationName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <span
          className="underline text-md cursor-pointer"
          onClick={() => {
            setSelectedOrganization(record);
            setShowHistoryModel(true);
          }}
        >
          History
        </span>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} />

     {showHistoryModal && (
       <Modal
       title= {
        `${
          userType === "donar" ? "Donation History" : "Consumption History"
        } In ${selectedOrganization.organizationName}`
       }
       centered
       open={showHistoryModal}
       onClose={() => setShowHistoryModel(false)}
       width={1000}
       onCancel={() => setShowHistoryModel(false)}
     >
       <InventoryTable
         filters={{
           organization: selectedOrganization._id,
           [userType]: currentUser._id,
         }}
       />
     </Modal>
     )}
    </div>
  );
};

export default Organizations;
