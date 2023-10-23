import { Checkbox, Col, Form, InputNumber, message, Radio, Row, Switch } from "antd";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { FormHeader } from "../FormHeader/FormHeader";
import classes from "./DevoirDeConseil.module.css";

function DevoirDeConseil(props) {
  const { prev, form } = props;
  // const { globalData, setGlobalData } = useContext(GlobalContext);
  const [exam, setExam] = useState({
    "Avez-vous fait l’objet d’une résiliation pour non-paiement de cotisation par un précédent assureur au cours des 36 derniers mois ?": false,
    "Avez-vous fait l’objet d’une résiliation pour sinistres par un précédent assureur au cours des 36 derniers mois ?": false,
    "Avez-vous fait l’objet d’une résiliation pour fausse déclaration (ou nullité du contrat) par un précédent assureur au cours des 36 derniers mois ?": false,
    "Etes-vous sous le coup d’une liquidation ou d’un redressement judiciaire ?": false,
    "Le local et les dépendances sont-ils construits et couvert à moins de 75% en matériaux durs ?": false,
    "Le bâtiment dans lequel le local se situe est-il inoccupé ou désaffecté ?  ": false,
    "Le sommet des marchandises entreposées excède-t-il une hauteur de 7.20 mètres prise à partir du sol ?  ": false,
    "Le local est-il classé ou inscrit au titre des Monuments historiques, ou situés dans de tels bâtiments ?": false,
    "Le local est-il situé dans un centre commercial dont la superficie est supérieure à 3000 m2 ?  ": false,

    discothèque: form.getFieldsValue(true)["discothèque"] || false,
    "boîte de nuit": form.getFieldsValue(true)["boîte de nuit"] || false,
    bowling: form.getFieldsValue(true)["bowling"] || false,
    cabaret: form.getFieldsValue(true)["cabaret"] || false,
    "bar de nuit": form.getFieldsValue(true)["bar de nuit"] || false,
    "tout autre établissement uniquement ouvert la nuit":
      form.getFieldsValue(true)[
        "tout autre établissement uniquement ouvert la nuit"
      ] || false,

    "application de peintures et de vernis":
      form.getFieldsValue(true)["application de peintures et de vernis"] ||
      false,
    "transformation de matières plastiques alvéolaires":
      form.getFieldsValue(true)[
        "transformation de matières plastiques alvéolaires"
      ] || false,
    "des stocks d’emballages combustibles vides pour un montant supérieur à 15 000 € ou 30 000 € commerce de gros.":
      form.getFieldsValue(true)[
        "des stocks d’emballages combustibles vides pour un montant supérieur à 15 000 € ou 30 000 € commerce de gros."
      ] || false,
  });

  const table = [
    {
      YesOrNoQuestion:
        "Avez-vous fait l’objet d’une résiliation pour non-paiement de cotisation par un précédent assureur au cours des 36 derniers mois ?",
    },
    {
      YesOrNoQuestion:
        "Avez-vous fait l’objet d’une résiliation pour sinistres par un précédent assureur au cours des 36 derniers mois ?",
    },
    {
      YesOrNoQuestion:
        "Avez-vous fait l’objet d’une résiliation pour fausse déclaration (ou nullité du contrat) par un précédent assureur au cours des 36 derniers mois ?",
    },
    {
      YesOrNoQuestion:
        "Etes-vous sous le coup d’une liquidation ou d’un redressement judiciaire ?",
    },
    {
      YesOrNoQuestion:
        "Le local et les dépendances sont-ils construits et couvert à moins de 75% en matériaux durs ?",
    },
    {
      YesOrNoQuestion:
        "Le bâtiment dans lequel le local se situe est-il inoccupé ou désaffecté ?  ",
    },
    {
      MultipleAnswers: "Le local est-il situé dans un bâtiment renfermant:",
      propositions: {
        rs: [
          "discothèque",
          "boîte de nuit",
          "bowling",
          "cabaret",
          "bar de nuit",
          "tout autre établissement uniquement ouvert la nuit",
        ],
        as: [
          "application de peintures et de vernis",
          "transformation de matières plastiques alvéolaires",
          "des stocks d’emballages combustibles vides pour un montant supérieur à 15 000 € ou 30 000 € commerce de gros.",
        ],
      },
    },
    {
      YesOrNoQuestion:
        "Le sommet des marchandises entreposées excède-t-il une hauteur de 7.20 mètres prise à partir du sol ?  ",
    },
    {
      YesOrNoQuestion:
        "Le local est-il classé ou inscrit au titre des Monuments historiques, ou situés dans de tels bâtiments ?",
    },
    {
      YesOrNoQuestion:
        "Le local est-il situé dans un centre commercial dont la superficie est supérieure à 3000 m2 ?  ",
    },
    {
      Input:
        "Nombre de sinistres déclarés au cours des 36 derniers mois :",
    },
    {
      Input:
        "Nombre de sinistres déclarés au cours des 36 derniers mois Dont Vol :",
    },
  ];

  return (
    <div>
      <FormHeader title="Éléments de validation du risque" number="4" prev={prev} />
      {table.map((element, index) => {
        if (element?.YesOrNoQuestion) {
          return (
            <Row gutter={24} className={classes.rowContainer} key={index}>
              <Col md={16} xs={24}>
                <h3> {element.YesOrNoQuestion} </h3>
              </Col>
              <Col lg={2} md={12} xs={24}>
                <Form.Item
                  name={element?.YesOrNoQuestion}
                  valuePropName="checked"
                >
                  <Switch
                    size="default"
                    checkedChildren={"Oui"}
                    unCheckedChildren={"Non"}
                    defaultChecked={form.getFieldValue(
                      element?.YesOrNoQuestion
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          );
        } else if (element?.Input) {
          return (
            <Row gutter={24} className={classes.rowContainer} key={index}>
              <Col md={16} xs={24}>
                <h3> {element.Input} </h3>
              </Col>
              <Col lg={2} md={12} xs={24}>
                <Form.Item
                  name={element?.Input}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez remplir ce champ",
                    },
                    () => ({
                      validator(_, value) {
                        if ((0 <= value && value <= form.getFieldsValue()["Nombre de sinistres déclarés au cours des 36 derniers mois :"]) && element?.Input.includes("Vol") ){
                          return Promise.resolve();
                        }else if(0 <= value && value <= 1 && !element?.Input.includes("Vol")) {
                          return Promise.resolve();
                        }
                        message.error('Pardon, vous ne pouvez pas souscrire un contrat MRP.');
                        return Promise.reject(new Error("Veuillez verifier ce champ"));
                      },
                    }),
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
          );
        } else {
          return (
            <div className={classes.container} key={index}>
              <Row className={classes.rowContainer}>
                <Col md={18} xs={24}>
                  <h3>{element?.MultipleAnswers}</h3>
                </Col>
              </Row>
              <div className={classes.propContainer}>
                <div className={classes.qualityBlock}>
                  <h4 style={{ color: "#292371" }}>Les risques suivants :</h4>
                  <Row gutter={24} className={classes.propBox}>
                    {element?.propositions?.rs.map((select, index) => {
                      return (
                        <Col
                          key={index}
                          lg={8}
                          style={{
                            height: "2rem",
                            padding: "0 3rem",
                            margin: ".6rem 0",
                          }}
                        >
                          <Form.Item name={select}>
                            <Checkbox
                              name={select}
                              onChange={(e) => {
                                form.setFieldsValue({
                                  ...form.getFieldsValue(),
                                  [e.target.name]:
                                    e.target.checked !== false
                                      ? e.target.checked
                                      : undefined,
                                });
                                setExam({
                                  ...exam,
                                  [e.target.name]:
                                    e.target.checked !== false
                                      ? e.target.checked
                                      : undefined,
                                });
                              }}
                              checked={exam[select]}
                            >
                              <span
                                style={{
                                  fontSize: "20px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {select}
                              </span>
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
                <div className={classes.qualityBlock}>
                  <h4 style={{ color: "#292371" }}>
                    Les activités suivantes :
                  </h4>

                  <Row
                    gutter={24}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {element?.propositions?.as.map((select, index) => {
                      return (
                        <Col
                          key={index}
                          lg={12}
                          style={{
                            height: "2rem",
                            padding: "0 3rem",
                            margin: ".6rem 0",
                          }}
                        >
                          <Form.Item name={select}>
                            <Checkbox
                              name={select}
                              onChange={(e) => {
                                form.setFieldsValue({
                                  ...form.getFieldsValue(),
                                  [e.target.name]:
                                    e.target.checked !== false
                                      ? e.target.checked
                                      : undefined,
                                });
                                setExam({
                                  ...exam,
                                  [e.target.name]:
                                    e.target.checked !== false
                                      ? e.target.checked
                                      : undefined,
                                });
                              }}
                              checked={exam[select]}
                            >
                              <span
                                style={{
                                  fontSize: "20px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {select}
                              </span>
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default DevoirDeConseil;
