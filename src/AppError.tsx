import React from "react";
import { Button, Layout } from "antd";
import AppHeader from "./AppHeader";
import { useAppContext } from "./App";
import "./assets/main.css";

const AppError: React.FC<{ title: string; error: string; jsx?: string }> = ({
  title,
  error,
  jsx,
}) => {
  const { setConnected } = useAppContext();
  return (
    <Layout>
      <AppHeader>
        <div className="myhMenuDisplayButton"></div>
        <Button type="primary" onClick={() => setConnected(null)}>
          Disconnect
        </Button>
      </AppHeader>
      <Layout.Content className="myhMainLayout">
        <div className="myhAppContent-panel">
          <div className="myhJSXErrorTitle">{title}</div>
          <div className="myhJSXErrorMessage">{error}</div>
          {jsx && <div className="myhJSXErrorJSX">{jsx}</div>}
        </div>
      </Layout.Content>
    </Layout>
  );
};
export default AppError;