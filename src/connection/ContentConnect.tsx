import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Radio,
  Layout,
  Tabs,
} from "antd";
import AppHeader from "../AppHeader";
import { ConnectInfo } from "./ConnectionInfo";
import "./ContentConnect.css";
import { useAppContext } from "../App";
import UploadRaw from "./UploadRaw";

const PanelConnect: React.FC<{}> = () => {
  const [form] = Form.useForm<ConnectInfo>();
  const { setConnected } = useAppContext();
  const { TabPane } = Tabs;

  useEffect(() => {
    const item = window.localStorage.getItem("mqttconnect");
    if (item) {
      form.setFieldsValue(JSON.parse(item));
    } else {
      form.setFieldsValue({
        url: "ws://localhost:9001",
        username: "",
        password: "",
        clientId:
          "myhelloiot_" + Math.random().toString(16).substr(2).padEnd(13, "0"),
        keepalive: 60,
        connectTimeout: 30000,
        reconnectPeriod: 1000,
        onlinetopic: "",
        onlineqos: 0,
        dashboard: { name: "dashboard.jsx", type: "text/jsx", data: "" },
        dashboardcss: { name: "dashboard.css", type: "text/css", data: "" },
      });
    }
    window.scrollTo(0, 0);
  });

  const handleConnect = (connectinfo: ConnectInfo) => {
    window.localStorage.setItem("mqttconnect", JSON.stringify(connectinfo));
    setConnected("connected");
  };

  return (
    <Form
      form={form}
      name="connection"
      onFinish={handleConnect}
      className="myhConnectionForm"
    >
      <Layout>
        <AppHeader>
          <div className="myhMenuDisplayButton"></div>
          <Button type="primary" htmlType="submit">
            Connect
          </Button>
        </AppHeader>
        <Layout.Content className="myhMainLayout">
          <div className="myhAppContent-panel">
            <Tabs defaultActiveKey="1">
              <TabPane tab="MQTT connection" key="1" forceRender>
                <Row gutter={[8, { xs: 2, sm: 2, md: 8, lg: 8 }]}>
                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label
                      htmlFor="url"
                      className="ant-form-item-required"
                      title="URL"
                    >
                      URL
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={18} lg={12}>
                    <Form.Item
                      name="url"
                      rules={[
                        {
                          required: true,
                          message: "Please input the url of the MQTT broker.",
                        },
                      ]}
                    >
                      <Input autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />

                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label htmlFor="username" title="User">
                      User
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item name="username">
                      <Input autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label htmlFor="password" title="Password">
                      Password
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item name="password">
                      <Input.Password />
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />

                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label
                      htmlFor="clientId"
                      className="ant-form-item-required"
                      title="Client ID"
                    >
                      Client ID
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item
                      name="clientId"
                      rules={[
                        {
                          required: true,
                          message: "Please define a Client ID.",
                        },
                      ]}
                    >
                      <Input autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label
                      htmlFor="keepalive"
                      className="ant-form-item-required"
                      title="Keep alive"
                    >
                      Keep alive
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item
                      name="keepalive"
                      rules={[
                        {
                          required: true,
                          message: "Please define a Keep alive value.",
                        },
                      ]}
                    >
                      <InputNumber autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />

                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label
                      htmlFor="connectTimeout"
                      className="ant-form-item-required"
                      title="Connection timeout"
                    >
                      Connection timeout
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item
                      name="connectTimeout"
                      rules={[
                        {
                          required: true,
                          message: "Please define a Connection timeout value.",
                        },
                      ]}
                    >
                      <InputNumber autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label
                      htmlFor="reconnectPeriod"
                      className="ant-form-item-required"
                      title="Reconnect period"
                    >
                      Reconnect period
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item
                      name="reconnectPeriod"
                      rules={[
                        {
                          required: true,
                          message: "Please define a Reconnect period value.",
                        },
                      ]}
                    >
                      <InputNumber autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />

                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col
                    xs={24}
                    sm={6}
                    md={6}
                    lg={4}
                    className="ant-form-item-label"
                  >
                    <label htmlFor="onlinetopic" title="Online topic">
                      Online topic
                    </label>
                  </Col>
                  <Col xs={24} sm={18} md={6} lg={4}>
                    <Form.Item name="onlinetopic">
                      <Input autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={{ offset: 0, span: 24 }}
                    sm={{ offset: 6, span: 18 }}
                    md={{ offset: 0, span: 12 }}
                    lg={{ offset: 0, span: 8 }}
                  >
                    <Form.Item name="onlineqos">
                      <Radio.Group>
                        <Radio value={0}>QoS 0</Radio>
                        <Radio value={1}>QoS 1</Radio>
                        <Radio value={2}>QoS 2</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />
                </Row>
              </TabPane>
              <TabPane tab="Dashboard" key="2" forceRender>
                <Row gutter={[8, { xs: 2, sm: 2, md: 8, lg: 8 }]}>
                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col xs={24} sm={24} md={24} lg={16}>
                    <Form.Item
                      name="dashboard"
                      rules={[
                        {
                          validator: (_, value) =>
                            value?.data?.trim()
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(
                                    "Please upload a dashboard definition file."
                                  )
                                ),
                        },
                      ]}
                    >
                      <UploadRaw accept=".jsx" />
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />
                </Row>
              </TabPane>
              <TabPane tab="Stylesheet" key="3" forceRender>
                <Row gutter={[8, { xs: 2, sm: 2, md: 8, lg: 8 }]}>
                  <Col xs={0} sm={0} md={0} lg={4} />
                  <Col xs={24} sm={24} md={24} lg={16}>
                    <Form.Item name="dashboardcss">
                      <UploadRaw accept=".css" />
                    </Form.Item>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={4} />
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Layout.Content>
      </Layout>
    </Form>
  );
};
export default PanelConnect;
