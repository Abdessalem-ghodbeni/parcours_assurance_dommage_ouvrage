import { Col, Form, Input, Radio, Row } from "antd";
import React, { useState } from "react";
import { FormHeader } from "../FormHeader/FormHeader";
import classes from "./InformationBancaire.module.css";
import dollar from "../../assets/svg/dollar.svg";
function InformationBancaire(props) {
  const { prev, form } = props;

  const forms = [
    "Nom de la banque",
    "Nom & Prénom titulaire du compte",
    "BIC",
    "IBAN",
  ];

  const InputsPattern = (input) => {
    switch (input) {
      case "IBAN":
        return /^AL\d{10}[0-9A-Z]{16}$|^AD\d{10}[0-9A-Z]{12}$|^AT\d{18}$|^BH\d{2}[A-Z]{4}[0-9A-Z]{14}$|^BE\d{14}$|^BA\d{18}$|^BG\d{2}[A-Z]{4}\d{6}[0-9A-Z]{8}$|^HR\d{19}$|^CY\d{10}[0-9A-Z]{16}$|^CZ\d{22}$|^DK\d{16}$|^FO\d{16}$|^GL\d{16}$|^DO\d{2}[0-9A-Z]{4}\d{20}$|^EE\d{18}$|^FI\d{16}$|^FR\d{12}[0-9A-Z]{11}\d{2}$|^GE\d{2}[A-Z]{2}\d{16}$|^DE\d{20}$|^GI\d{2}[A-Z]{4}[0-9A-Z]{15}$|^GR\d{9}[0-9A-Z]{16}$|^HU\d{26}$|^IS\d{24}$|^IE\d{2}[A-Z]{4}\d{14}$|^IL\d{21}$|^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^[A-Z]{2}\d{5}[0-9A-Z]{13}$|^KW\d{2}[A-Z]{4}22!$|^LV\d{2}[A-Z]{4}[0-9A-Z]{13}$|^LB\d{6}[0-9A-Z]{20}$|^LI\d{7}[0-9A-Z]{12}$|^LT\d{18}$|^LU\d{5}[0-9A-Z]{13}$|^MK\d{5}[0-9A-Z]{10}\d{2}$|^MT\d{2}[A-Z]{4}\d{5}[0-9A-Z]{18}$|^MR13\d{23}$|^MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}$|^MC\d{12}[0-9A-Z]{11}\d{2}$|^ME\d{20}$|^NL\d{2}[A-Z]{4}\d{10}$|^NO\d{13}$|^PL\d{10}[0-9A-Z]{,16}n$|^PT\d{23}$|^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$|^SM\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^SA\d{4}[0-9A-Z]{18}$|^RS\d{20}$|^SK\d{22}$|^SI\d{17}$|^ES\d{22}$|^SE\d{22}$|^CH\d{7}[0-9A-Z]{12}$|^TN59\d{20}$|^TR\d{7}[0-9A-Z]{17}$|^AE\d{21}$|^GB\d{2}[A-Z]{4}\d{14}$/;
      case "BIC":
        return /([a-zA-Z]{4})([a-zA-Z]{2})(([2-9a-zA-Z]{1})([0-9a-np-zA-NP-Z]{1}))((([0-9a-wy-zA-WY-Z]{1})([0-9a-zA-Z]{2}))|([xX]{3})|)/;
      default:
        return "";
    }
  };

  return (
    <div>
      <FormHeader title="Informations bancaires" number="7" prev={prev} />
      <Row className={classes.container}>
        {/* <Col>
          <h3 className={classes.title}>Fractionnement</h3>
        </Col> */}
        <Col className={classes.periodCard}>
          <Form.Item name={"Fractionnement"}>
            <Radio.Group defaultValue={"Mensuel"} className={classes.formGroup}>
              <Radio className={classes.radioText}  value={"Mensuel"}>Fractionnement Mensuel</Radio>
              <Radio className={classes.radioText} value={"Trimestriel"}>Fractionnement Trimestriel</Radio>
              <Radio className={classes.radioText} value={"Annuel"}>Fractionnement Annuel</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={18} className={classes.Card}>
          <h1 className={classes.prelev}>
            {" "}
            <img style={{marginRight:"0.5rem"}} src={dollar} alt="" />
            Prélèvement
          </h1>
          {forms.map((form, index) => (
            <Form.Item
              key={index}
              name={form + " prev"}
              label={<label className={classes.label}>{form}</label>}
              rules={[
                {
                  required: true,
                  message: `Veuillez remplir ${form}`,
                },
                {
                  pattern: new RegExp(InputsPattern(form)),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
            >
              <Input
                controls={false}
                size="large"
                placeholder={"Votre " + form}
                style={{ padding: "10px 10px", width: "100%" }}
              />
            </Form.Item>
          ))}

          <div className={classes.jourPrev}>
            <Form.Item
              name={"Jour de prélèvement"}
              label={
                <label className={classes.label}>Jour de prélèvement *</label>
              }
            >
              <Radio.Group defaultValue={5}>
                <Radio className={classes.radioText} value={5}>5</Radio>
                <Radio className={classes.radioText} value={10}>10</Radio>
                <Radio className={classes.radioText} value={15}>15</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </Col>

        <Col span={18} className={classes.Card}>
          <h1 className={classes.prelev}>
            <img style={{marginRight:"0.5rem"}} src={dollar} alt="" />
            Remboursement
          </h1>
          {forms.map((form, index) => (
            <Form.Item
              key={index}
              name={form + " remb"}
              label={<label className={classes.label}>{form}</label>}
              rules={[
                {
                  pattern: new RegExp(InputsPattern(form)),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
            >
              <Input
                controls={false}
                size="large"
                placeholder={"Votre " + form}
                style={{ padding: "10px 10px", width: "100%" }}
              />
            </Form.Item>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default InformationBancaire;
