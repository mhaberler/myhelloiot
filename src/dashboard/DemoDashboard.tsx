import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { DashboardFilled, PictureFilled, ApiFilled } from "@ant-design/icons";
import { useMQTTContext } from "../mqtt/MQTTProvider";
import PanelTests from "./PanelTests";
import PanelTestNumbers from "./PanelTestNumbers";

const DemoDashboard: React.FC<{}> = () => {
  const [, { disconnect }] = useMQTTContext();
  const [panelkey, setPanelkey] = useState<React.Key>("menu-1");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleSelect = ({ key }: { key: string | number }) => {
    if ((key as string).startsWith("menu-")) {
      setPanelkey(key);
    }
  };

  const handleClick = ({ key }: { key: string | number }) => {
    if ((key as string) === "action-disconnect") {
      disconnect();
    }
  };

  return (
    <>
      <Layout.Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[panelkey.toString()]}
          onSelect={handleSelect}
          onClick={handleClick}
        >
          <Menu.Item key="menu-1" icon={<PictureFilled />}>
            Gallery
          </Menu.Item>
          <Menu.Item key="menu-2" icon={<DashboardFilled />}>
            Temperature
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="action-disconnect" icon={<ApiFilled />}>
            Disconnect
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content>
        {panelkey === "menu-1" && <PanelTests />}
        {panelkey === "menu-2" && <PanelTestNumbers />}
      </Layout.Content>
    </>
  );
};

export default DemoDashboard;