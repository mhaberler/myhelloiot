export const samplejsx = `
<Dashboard disconnectMenu>
  <DashboardMenu  icon={<BulbFilled />} name="Application example">
    <PanelGrid>
      <CCard title="Testing topic pub and sub">
        <InputUnit
          pubtopic="myhelloiot/testingtopic"
          subtopic="myhelloiot/testingtopic"
        />
      </CCard>
      <CCard title="Testing topic only sub">
        <InputUnit subtopic="myhelloiot/testingtopic" />
      </CCard>
      <CCard title="Testing topic only pub">
        <InputUnit pubtopic="myhelloiot/testingtopic" />
      </CCard>
      <CCard title="Testing topic Hexadecimal">
        <InputUnit
          pubtopic="myhelloiot/testingtopic"
          subtopic="myhelloiot/testingtopic"
          format={HEXValueFormat()}
        />
      </CCard>
      <CCard title="Testing topic Base64">
        <InputUnit
          pubtopic="myhelloiot/testingtopic"
          subtopic="myhelloiot/testingtopic"
          format={Base64ValueFormat()}
        />
      </CCard>
      <CCard>
        <ButtonUnit
          pubtopic="myhelloiot/testingtopic"
          format={LiteralIconValueFormat("Sends 123", Buffer.from("123"))}
        />
      </CCard>
      <CCard>
        <ButtonUnit
          pubtopic="myhelloiot/testingtopic"
          format={ImageIconValueFormat(Themes, Buffer.from("ABC"))}
        />
      </CCard>
      <CCard>
        <ButtonUnit
          pubtopic="myhelloiot/testingtopic"
          format={TitleIconValueFormat(Themes, "Sends XYZ", Buffer.from("XYZ"))}
        />
      </CCard>
      <CCard title="Light switch">
        <div
          className="myh-value myh-value-padding"
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#e1e1e1",
            borderRadius: "15px",
          }}
        >
          <ViewUnit
            subtopic="myhelloiot/testswitch"
            format={BulbIconFormat()}
          />
        </div>
        <div
          className="myh-value myh-value-padding"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <SwitchUnit
            pubtopic="myhelloiot/testswitch"
            puboptions={{ retain: true }}
            subtopic="myhelloiot/testswitch"
          />
        </div>
      </CCard>    
      <CCard title="Switch button">
        <ButtonUnit
          pubtopic="myhelloiot/testswitch"
          puboptions={{ retain: true }}
          subtopic="myhelloiot/testswitch"
        />
      </CCard>
      <CCard title="Switch bolt">
        <ButtonUnit
          pubtopic="myhelloiot/testswitch"
          puboptions={{ retain: true }}
          subtopic="myhelloiot/testswitch"
          format={SwitchIconValueFormat(ThuderboltIconFormat())}
        />
      </CCard>
      <CCard title="Switch on and off">
        <Row gutter={8}>
          <Col span={12}>
            <ButtonUnit
              pubtopic="myhelloiot/testswitch"
              puboptions={{ retain: true }}
              format={LiteralIconValueFormat("ON", Buffer.from("1"))}
            />
          </Col>
          <Col span={12}>
            <ButtonUnit
              pubtopic="myhelloiot/testswitch"
              puboptions={{ retain: true }}
              format={LiteralIconValueFormat("OFF", Buffer.from("0"))}
            />
          </Col>
        </Row>
      </CCard>  
    </PanelGrid>
  </DashboardMenu>
  <DashboardMenu icon={<DashboardFilled />} name="Test Gauges">
    <PanelTestNumbers />
  </DashboardMenu>
</Dashboard>
`;