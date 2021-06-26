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

import React from "react";
import { useDispatch } from "react-redux";
import {
  ApiFilled,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Row, Col, Typography, Button, Divider, Popover, Space } from "antd";
import { useMQTTContext } from "../mqtt/MQTTProvider";
import { AppStoreDispatch } from "../AppStoreProvider";

const { Text } = Typography;

type ConnectionInfoProps = {
  disconnectDisabled?: boolean;
};

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({
  disconnectDisabled = false,
}) => {
  const [{ options, status }] = useMQTTContext();
  const dispatch = useDispatch<AppStoreDispatch>();

  const {
    protocol,
    hostname,
    port,
    path,
    protocolId,
    protocolVersion,
    username,
    clientId,
  } = options;

  let toolbar;
  if (status === "Connected") {
    toolbar = (
      <Space>
        <span className="myhConnectionStatus-label">{options.hostname}</span>
        <span className="myhConnectionStatus-icon">
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        </span>
      </Space>
    );
  } else {
    toolbar = (
      <Space>
        <span className="myhConnectionStatus-label">{status}</span>
        <span className="myhConnectionStatus-icon">
          <LoadingOutlined style={{ color: "white" }} />
        </span>
      </Space>
    );
  }
  const popover = (
    <>
      <div style={{ width: 320 }}>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>Protocol:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {protocol}
            </Text>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>Host name:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {hostname}
            </Text>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>Port:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {port}
            </Text>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>Path:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {path}
            </Text>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>MQTT protocol:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {protocolId} {protocolVersion}
            </Text>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>User name:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {username}
            </Text>
          </Col>
        </Row>
        <Row wrap={false}>
          <Col flex="120px">
            <Text>Client Id:</Text>
          </Col>
          <Col flex="auto">
            <Text type="secondary" strong>
              {clientId}
            </Text>
          </Col>
        </Row>
      </div>
      {!disconnectDisabled && (
        <>
          <Divider />
          <Button
            type="primary"
            icon={<ApiFilled />}
            onClick={() => {
              dispatch({ type: "set", newState: { connected: "" } });
            }}
          >
            Disconnect
          </Button>
        </>
      )}
    </>
  );

  return (
    <Popover placement="bottomRight" content={popover} trigger="click">
      <Button type="text">{toolbar}</Button>
    </Popover>
  );
};

export default ConnectionInfo;