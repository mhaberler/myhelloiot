/*
MYHELLOIOT
Copyright (C) 2021 Adrián Romero
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Drawer, Button, Layout, Menu } from "antd";
import { MenuUnfoldOutlined, PictureFilled } from "@ant-design/icons";
import { AppStoreValue, useDispatchProperties } from "../AppStoreProvider";
import AppHeader from "../AppHeader";
import {
  MQTTMessage,
  useMQTTContext,
  useMQTTSubscribe,
} from "../mqtt/MQTTProvider";
import DashboardContent, { DashboardContentProps } from "./DashboardContent";
import ConnectionInfo from "./ConnectionInfo";

export type DashboardProps = {
  title?: string;
  topic?: string;
  disconnectDisabled?: boolean;
  className?: string;
  children: React.ReactElement<DashboardContentProps, any>[];
};

const Dashboard: React.FC<DashboardProps> = ({
  title,
  topic = "",
  disconnectDisabled = false,
  className,
  children,
}) => {
  const panelkey: string = useSelector<AppStoreValue, string>(
    (s) => s.properties.panelkey ?? "menu-0"
  );
  const dashboardhash: string = useSelector<AppStoreValue, string>(
    (s) => s.connectInfo.dashboard.hash
  );
  const dispatchProperties = useDispatchProperties();
  const setPanelkey = (panelkey: string) => dispatchProperties({ panelkey });

  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [, { publish }] = useMQTTContext();
  useMQTTSubscribe(topic, (mqttmessage: MQTTMessage) => {
    const key = mqttmessage.message.toString();
    if (key !== panelkey) {
      hideDrawer();
      setPanelkey(key);
    }
  });
  useEffect(() => window.scrollTo(0, 0), [panelkey]);

  function handleSelect({ key }: { key: string }) {
    hideDrawer();
    setPanelkey(key);
    publish(topic, Buffer.from(key), {
      retain: true,
    });
  }

  function showDrawer() {
    setVisibleDrawer(true);
  }

  function hideDrawer() {
    setVisibleDrawer(false);
  }

  const menus: React.ReactElement<any, any>[] = [];
  const allchildren: React.ReactElement<DashboardContentProps, any>[] = [];
  let cvisible: React.ReactElement<DashboardContentProps, any> | undefined;
  let menDisabled: boolean = false;
  let disDisabled: boolean = false;
  let index = 0;

  React.Children.forEach(children, (c) => {
    if (React.isValidElement(c) && c.type === DashboardContent) {
      const key: string = "menu-" + dashboardhash + index++;
      if (c.props.name) {
        menus.push(
          <Menu.Item key={key} icon={c.props.icon ?? <PictureFilled />}>
            {c.props.name}
          </Menu.Item>
        );
      }
      if (key === panelkey || !cvisible) {
        cvisible = c;
        menDisabled = c.props.menuDisabled ?? false;
        disDisabled = c.props.disconnectDisabled ?? false;
      }
      allchildren.push(c);
    }
  });

  return (
    <Layout className={className}>
      <AppHeader title={title}>
        {menus.length > 0 && (
          <div className="myhMenuDisplayButton">
            <Button onClick={showDrawer} ghost hidden={menDisabled}>
              <MenuUnfoldOutlined />
            </Button>
          </div>
        )}
        <ConnectionInfo
          disconnectDisabled={disconnectDisabled || disDisabled}
        />
      </AppHeader>
      <Layout.Content className="myhMainLayout">
        {menus.length > 0 && (
          <Drawer
            className="myhDrawerMenu"
            placement="left"
            closable={false}
            onClose={hideDrawer}
            visible={visibleDrawer}
          >
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[panelkey.toString()]}
              onSelect={handleSelect}
            >
              {menus}
            </Menu>
          </Drawer>
        )}
        {allchildren.map((c) => (
          <div key={c.key} style={c === cvisible ? {} : { display: "none" }}>
            {c}
          </div>
        ))}
      </Layout.Content>
    </Layout>
  );
};

export default Dashboard;
