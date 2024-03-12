import { Form, Input, Modal, Radio, Select, message } from "antd";
import React, { useState } from "react";
import { getAntdInputValidation } from "../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { AddInventory } from "../../../apicalls/inventory";

const InventoryForm = ({ open, setOpen, reloadData }) => {
  const [inventoryType, setInventoryType] = useState();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
        organization: currentUser._id,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        reloadData();
        message.success("Inventory Added Successfully");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };
  return (
    <Modal
      title="ADD INVENTORY"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-3"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Inventory Type">
          <Radio.Group
            value={inventoryType}
            onChange={(e) => setInventoryType(e.target.value)}
          >
            <Radio value="in">In</Radio>
            <Radio value="out">Out</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Blood Group"
          name="bloodGroup"
          rules={getAntdInputValidation()}
        >
          <Select name="id">
            <option value="a+">A+</option>
            <option value="a-">A-</option>
            <option value="b+">B+</option>
            <option value="b-">B-</option>
            <option value="ab+">AB+</option>
            <option value="ab-">AB-</option>
            <option value="o+">O+</option>
            <option value="o-">O-</option>
          </Select>
        </Form.Item>
        <Form.Item
          label={inventoryType === "out" ? "Hospital Email" : "Donar Email"}
          rules={getAntdInputValidation()}
          name="email"
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          rules={getAntdInputValidation()}
          label="Quantity (ML)"
          name="quantity"
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InventoryForm;
