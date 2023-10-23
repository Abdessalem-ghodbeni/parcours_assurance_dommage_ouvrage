import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  Col,
  Form,
  InputNumber,
  message,
  Progress,
  Switch,
  Spin,
  Skeleton,
  Button,
  Space,
} from "antd";
import React, { useContext, useEffect } from "react";
import classes from "./GarantieOption.module.css";
import { red } from "@ant-design/colors";
import GlobalContext from "../../contexts/GlobalContext";

function GarantieOption(props) {
  const {
    garantieOptions,
    desc,
    title,
    fieldName,
    value,
    loadersArray,
    classe_risque,
    form,
    offre,
    idx,
    setLoadersArray,
  } = props;

  const { globalData, setGlobalData } = useContext(GlobalContext);

  const GarantiesRelated = [
    { "Marchandises en Frigo": "capitaux_frigo" },
    { "Dommages électriques": "capitaux_dommage" },
    { "Garantie Bris de Machines": "capitaux_machine" },
    { "Garantie Vol": "capitaux_vol" },
    { "Extension extérieurs": "capitaux_extension" },
    { "Marchandises matériels transportés": "capitaux_transport" },
  ];
  var InputDisplay = false;
  var InputName = "";
  GarantiesRelated.map((name) => {
    if (Object.keys(name)[0] == title) {
      InputDisplay = true;
      InputName = name[Object.keys(name)[0]];
    }
  });

  const GarantieCapitalInterval = {
    "Dommages électriques": {
      min: 500,
      max: 100000,
    },
    "Marchandises en Frigo": {
      min: 500,
      max: 15000,
    },
    "Garantie Bris de Machines": {
      min: 500,
      max: Math.min(
        globalData?.capital_protege * 0.5,
        globalData["contenu_pro"]
      ),
    },
    "Garantie Vol": {
      min: 500,
      max: Math.min(globalData?.capital_protege * 0.5, 150000),
    },
    "Extension extérieurs": {
      min: 500,
      max: 10000,
    },
    "Marchandises matériels transportés": {
      min: 500,
      max: 100000,
    },
  };

  const VerifyValue = (value, title) => {
    if (
      GarantieCapitalInterval[title].min <= value &&
      value <= GarantieCapitalInterval[title].max
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Col
      xl={7}
      lg={7}
      md={11}
      sm={24}
      className={
        garantieOptions[fieldName]
          ? classes.warantyCard
          : classes.warantyCardDisabled
      }
    >
      <div className={classes.cardTexts}>
        <h3 className={classes.warantyTitle}>{title}</h3>
        <p className={classes.warantyText}>{desc}</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {value && (
          <>
            {" "}
            {!loadersArray[idx] === true ? (
              <p
                className={
                  garantieOptions[fieldName]
                    ? classes.price
                    : classes.priceDisabled
                }
              >
                +{value} €/
                {offre === "prime_commerciale_ttc_mensuel" ? "mois" : "année"}
              </p>
            ) : (
              <div style={{ padding: "10px" }}>
                <Skeleton.Input active={true} size={"default"} block={false} />
              </div>
            )}
          </>
        )}

        {classe_risque != undefined ? (
          classe_risque !== 0 && classe_risque !== null ? (
            <>
              <Progress
                type="circle"
                width={50}
                percent={(Number(classe_risque) / 7) * 100}
                format={() =>
                  Number(classe_risque) !== 12 ? Number(classe_risque) : "X"
                }
                status={Number(classe_risque) == 12 ? "exception" : ""}
                strokeColor={[red[4]]}
              />
              <Form.Item name={fieldName}>
                <Switch
                  checked={garantieOptions[fieldName]}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={(e) => {
                    if (e == false) {
                      let newGaranties = { ...globalData.garanties };
                      newGaranties[title] = e;
                      let reset = {};
                      reset[InputName] = 0;
                      /* form.setFieldsValue({
                        ...form.getFieldsValue(),
                        [InputName]: 0,
                      }); */
                      setGlobalData({
                        ...globalData,
                        garanties: { ...newGaranties },
                        ...reset,
                      });
                      let temp = loadersArray;
                      temp[idx] = true;
                      setLoadersArray(temp);
                    } else {
                      let garantiesWithoutCapital = [
                        "PE suite à incendie ou DDE",
                        "PE suite à Vol ou Vandalisme",
                        "Perte de Valeur du Fonds",
                        "Protection juridique",
                      ];
                      if (garantiesWithoutCapital.includes(title)) {
                        let newGaranties = { ...globalData.garanties };
                        newGaranties[title] = e;

                        setGlobalData({
                          ...globalData,
                          garanties: { ...newGaranties },
                        });
                        let temp = loadersArray;
                        temp[idx] = true;
                        setLoadersArray(temp);
                      } else if (
                        VerifyValue(form.getFieldValue()[InputName], title)
                      ) {
                        let reset = {};
                        reset[InputName] = form.getFieldValue()[InputName];
                        let newGaranties = { ...globalData.garanties };
                        newGaranties[title] = e;
                        form.setFieldsValue({
                          ...form.getFieldsValue(),
                          ...reset,
                        });

                        setGlobalData({
                          ...globalData,
                          ...reset,
                          garanties: { ...newGaranties },
                        });
                        let temp = loadersArray;
                        temp[idx] = true;
                        setLoadersArray(temp);
                      }
                    }
                  }}
                />
              </Form.Item>

              {InputDisplay == true ? (
                <>
                  <Form.Item
                    name={InputName}
                    validateTrigger={"onChange"}
                    rules={[
                      {
                        required: garantieOptions[fieldName] ? true : false,
                        message: "Veuillez remplir Capitaux",
                      },

                      () =>
                        garantieOptions[fieldName]
                          ? {
                              validator: (_, value) => {
                                if (VerifyValue(value, title)) {
                                  /*  setGlobalData({
                                    ...globalData,
                                    promises: {
                                      [`${title}_promise`]: "resolved",
                                    },
                                  }); */
                                  return Promise.resolve();
                                } else {
                                  /*  setGlobalData({
                                    ...globalData,
                                    promises: {
                                      [`${title}_promise`]: "rejected",
                                    },
                                  }); */
                                  return Promise.reject(
                                    new Error(
                                      `${
                                        value === undefined ? "Valeur" : value
                                      } est incorrecte`
                                    )
                                  );
                                }
                              },
                            }
                          : null,
                    ]}
                  >
                    <Space.Compact style={{ width: "100%" }}>
                      <InputNumber
                        size="large"
                        controls={false}
                        disabled={garantieOptions[fieldName] ? false : true}
                        defaultValue={globalData[InputName]}
                        onChange={(e) => {
                          form.setFieldsValue({
                            ...form.getFieldsValue(),
                            [InputName]: parseInt(e),
                          });
                        }}
                        addonBefore={"€"}
                        /*  style={{ padding: "10px 10px", width: "100%" }} */
                      />
                      <Button
                        disabled={
                          !VerifyValue(form.getFieldValue()[InputName], title)
                        }
                        onClick={() => {
                          if (
                            VerifyValue(form.getFieldValue()[InputName], title)
                          ) {
                            let newGaranties = { ...globalData.garanties };
                            newGaranties[title] = true;
                            setGlobalData({
                              ...globalData,
                              [InputName]: parseInt(form.getFieldValue()[InputName]),
                              garanties: { ...newGaranties },
                              promises: {
                                [`${title}_promise`]: "resolved",
                              },
                            });
                            let temp = loadersArray;
                            temp[idx] = true;
                            setLoadersArray(temp);
                          } else {
                            /* setGlobalData({
                              ...globalData,
                              promises: {
                                [`${title}_promise`]: "rejected",
                              },
                            }); */
                          }
                        }}
                      >
                        <RedoOutlined style={{ color: "black" }} />
                      </Button>
                    </Space.Compact>
                  </Form.Item>
                  <p className={classes.mutedText}>
                    Capital doit étre entre{" "}
                    {Math.round(GarantieCapitalInterval[title].min)} € et{" "}
                    {Math.round(GarantieCapitalInterval[title].max)} €
                  </p>
                </>
              ) : null}
            </>
          ) : (
            <>
              <Form.Item name={fieldName}>
                <Switch
                  disabled={true}
                  checked={false}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </>
          )
        ) : (
          <>
            <Form.Item name={fieldName}>
              <Switch
                checked={garantieOptions[fieldName]}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </>
        )}
      </div>
    </Col>
  );
}

export default GarantieOption;
