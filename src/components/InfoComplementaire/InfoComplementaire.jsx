import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";

import axios from "axios";
import React, { useEffect, useState } from "react";

import { useContext } from "react";
import { FormHeader } from "../FormHeader/FormHeader";
import classes from "./InfoComplementaire.module.css";
import GlobalContext from "../../contexts/GlobalContext";
import SectionHeader from "../InfoPrincipale/SectionHeader/SectionHeader";
import adresseRisque from "../../assets/adresseRisque.svg";
import house from "../../assets/house.png";
import dayjs from "dayjs";
function InfoComplementaire(props) {
  const { prev, form } = props;
  const { globalData, setGlobalData, value, setValue } =
    useContext(GlobalContext);

  const URL_MRP = import.meta.env.VITE_API_URL_AS;
  const [villes, setVilles] = useState([]);
  const [disabled, setDisabled] = React.useState(true);

  // React.useEffect(() => {
  //   if (form.getFieldsValue()?.capital_protege) {
  //     setCapitalprotege(form.getFieldsValue()?.capital_protege);
  //     setDisabled(false);
  //     setSliderValue(form.getFieldsValue());
  //   }
  // }, []);

  // React.useEffect(() => {
  //   console.log(
  //     form.getFieldsValue()["Promotion immobilière logements /bureaux/autres ?"]
  //   );
  // }, []);

  const getVilles = (e) => {
    if (e.target.value.length > 4) {
      const URL = import.meta.env.VITE_API_URL_AS;
      let ville_names = [];
      axios
        .post(`${URL}/groupe_villes/get_villes_by_code_postal`, {
          postal_code: e.target.value,
        })
        .then((res) => {
          if (res.data.villes) {
            // let ville_names = [];
            res.data.villes.forEach((ville) => {
              ville_names.push({
                value: ville?.nom_comm,
                label: ville?.nom_comm,
              });
            });
            setVilles(ville_names);
            form.setFieldsValue({
              ...form.getFieldsValue(),
              ville: ville_names[0]?.value,
            });
          } else {
            setVilles([]);
            form.setFieldsValue({
              ...form.getFieldsValue(),
              ville: "",
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const disabledDate = (current) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);

    const formattedMinDate = currentDate.toISOString().split("T")[0];
    console.log(formattedMinDate);
    return formattedMinDate;
  };
  const maxDate = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 360);

    const formattedMaxDate = currentDate.toISOString().split("T")[0];
    return formattedMaxDate;
  };
  return (
    <div>
      <FormHeader title="Informations complémentaires" number="2" prev={prev} />
      <div className={classes.formContainer}>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={adresseRisque} title={"Adresse du risque"} />
          </Col>
        </Row>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Adresse du risque</label>}
              name="adresse_siege"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir l'adresse du risque.",
                },
              ]}
            >
              <Input placeholder="Exemple: 1 rue louis le vau" size="large" />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={
                <label className={classes.label}>Complément d'adresse</label>
              }
              name="complement_adresse"
              // rules={[
              //   {
              //     required: true,
              //     message: "Veuillez remplir le complément d'adresse.",
              //   },
              // ]}
            >
              <Input size="large" placeholder={"Exemple: Bureau de Poste"} />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}></Col>
        </Row>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="code_postal"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le code postal.",
                },
              ]}
              label={<label className={classes.label}>Code postal</label>}
            >
              <Input
                size="large"
                type="number"
                placeholder={"Exemple: 78280"}
                onBlur={getVilles}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="ville"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir ce champ.",
                },
              ]}
              label={<label className={classes.label}>Ville</label>}
            >
              <Select
                // placeholder="exp: Canne"
                size="large"
                style={{
                  width: "100%",
                }}
                options={villes}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item label={<label className={classes.label}>Pays</label>}>
              <Select size="large" defaultValue="1">
                <Select.Option value="1">France</Select.Option>
                <Select.Option value="2">Tunisia</Select.Option>
                <Select.Option value="3">Canada</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={house} title={"Informations Bâtiment"} />
          </Col>
        </Row>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={
                <label className={classes.label}>
                  Cout construction (hors foncier)
                </label>
              }
              name="Cout_construction"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le cout construction",
                },
                () => ({
                  validator(_, value) {
                    if (10000 <= value && value <= 3000000) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "le  Cout construction  doit être entre 10000 et 3000000 "
                      )
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                type="number"
                controls={false}
                size="large"
                placeholder={"Exemple: 123456"}
                addonAfter={"€"}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Surface planché</label>}
              name="Surface_planche"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le surface planché",
                },
                () => ({
                  validator(_, value) {
                    if (10 <= value && value <= 1500) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        `${value}  n'est pas un chiffre   entre 10 m² et 1500 m²`
                      )
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                type="number"
                controls={false}
                size="large"
                placeholder={"Exemple: 22"}
                addonAfter={"m2"}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
            <p className={classes.mutedText} style={{ marginTop: "-23px" }}>
              Chiffre entre 10 m² et 1500 m²
            </p>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={
                <label className={classes.label}>Nombre de bâtiment</label>
              }
              name="Nombre_batiment"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le nombre de bâtiment",
                },
              ]}
            >
              <InputNumber
                type="number"
                min={0}
                controls={false}
                size="large"
                placeholder={"Exemple: 5"}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={
                <label className={classes.label}> Nombre de logement</label>
              }
              name="Nombre_logement"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le nombre de logement",
                },
              ]}
            >
              <InputNumber
                type="number"
                min={0}
                controls={false}
                size="large"
                placeholder={" Exemple: 50"}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}> Nombre d'étage</label>}
              name="Nombre_etage"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le nombre  d'étage",
                },
              ]}
            >
              <InputNumber
                type="number"
                min={0}
                controls={false}
                size="large"
                placeholder={"Exemple: 15"}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="garage_choice"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le champ Piscine",
                },
              ]}
              label={<label className={classes.label}>Garages</label>}
            >
              <Select
                placeholder="Oui"
                // defaultValue="oui"
                size="large"
                style={{
                  width: "100%",
                }}
                onSelect={(value) => {
                  console.log(value);
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    garage_choice: value,
                  });
                }}
              >
                <Select.Option value="oui">Oui</Select.Option>
                <Select.Option value="non">Non</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="piscine_choice"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le champ Piscine",
                },
              ]}
              label={<label className={classes.label}>Piscine</label>}
            >
              <Select
                placeholder="Oui"
                // defaultValue="oui"
                size="large"
                style={{
                  width: "100%",
                }}
                onSelect={(value) => {
                  console.log(value);
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    piscine_choice: value,
                  });
                }}
              >
                <Select.Option value="oui">Oui</Select.Option>
                <Select.Option value="non">Non</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={
                <label className={classes.label}>
                  Déclaration ouverture chantier
                </label>
              }
              name="date_ouverture_chantier"
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Veuillez remplir la date de déclaration ouverture chantier ",
              //   },

              //   disabledDate() && disabledDate()
              //     ? () => ({
              //         validator(_, value) {
              //           console.log(value);
              //           if (value >= disabledDate()) {
              //             return Promise.resolve();
              //           } else {
              //             return Promise.reject(
              //               new Error(
              //                 `${dayjs(value).format(
              //                   "DD/MM/YYYY"
              //                 )} est incorrecte`
              //               )
              //             );
              //           }
              //         },
              //       })
              //     : "",
              // ]}
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Veuillez remplir la date de déclaration ouverture chantier",
              //   },
              //   {
              //     validator: (_, value) => {
              //       if (value >= disabledDate()) {
              //         return Promise.resolve();
              //       } else {
              //         return Promise.reject(
              //           new Error("La date saisie est incorrecte")
              //         );
              //       }
              //     },
              //   },
              // ]}
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Veuillez remplir la date de déclaration ouverture chantier",
              //   },
              //   ({ getFieldValue }) => ({
              //     validator(_, value) {
              //       const selectedDate = dayjs(value, "DD/MM/YYYY", true);
              //       if (
              //         selectedDate.isValid() &&
              //         value === selectedDate.format("DD/MM/YYYY") &&
              //         selectedDate >= disabledDate()
              //       ) {
              //         return Promise.resolve();
              //       } else {
              //         return Promise.reject(
              //           new Error("La date saisie est incorrecte")
              //         );
              //       }
              //     },
              //   }),
              // ]}
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Veuillez remplir la date de déclaration ouverture chantier",
              //   },
              //   ({ getFieldValue }) => ({
              //     validator(_, value) {
              //       if (value) {
              //         const selectedDate = new Date(value);
              //         const currentDate = new Date(disabledDate());
              //         if (selectedDate >= currentDate) {
              //           return Promise.resolve();
              //         }
              //       }
              //       return Promise.reject(
              //         new Error(
              //           // `${dayjs(value).format("DD/MM/YYYY")} est incorrecte`
              //           "date saisie est incorrecte"
              //         )
              //       );
              //     },
              //   }),
              // ]}
              rules={[
                {
                  required: true,
                  message:
                    "Veuillez remplir la date de déclaration ouverture chantier",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value) {
                      const selectedDate = new Date(value);
                      if (
                        selectedDate instanceof Date &&
                        !isNaN(selectedDate)
                      ) {
                        const currentDate = new Date(disabledDate());
                        if (selectedDate >= currentDate) {
                          return Promise.resolve("date saisie est incorrecte");
                        }
                      }
                    }
                    return Promise.reject();
                  },
                }),
              ]}
            >
              <Input
                type="date"
                placeholder="Exemple 01/01/1999"
                size="large"
                style={{ width: "100%", height: "100%" }}
                format="DD/MM/YYYY"
                min={disabledDate()}
                max={maxDate()}
              />
            </Form.Item>
          </Col>
          {/* <DatePicker
                size="large"
                placeholder="Exemple: 01/06/2023"
                inputReadOnly={true}
                 
                style={{ width: "100%", height: "100%" }}
                
                format="DD/MM/YYYY"
               
              /> */}

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="Destination"
              label={<label className={classes.label}>Destination</label>}
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le champ Destination",
                },
              ]}
            >
              <Select
                placeholder="Vente"
                // defaultValue="vente"
                size="large"
                style={{
                  width: "100%",
                }}
                // options={_villes}
                onSelect={(value) => {
                  console.log(value);
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    Destination: value,
                  });
                }}
              >
                <Select.Option value="vente">VENTE</Select.Option>
                <Select.Option value="usage_propore">
                  USAGE PROPRE
                </Select.Option>
                <Select.Option value="locatif">LOCATION</Select.Option>
                <Select.Option value="professionnel">
                  PROFESSIONNEL
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="Type_construction"
              label={
                <label className={classes.label}>Type de construction</label>
              }
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le type de construction",
                },
              ]}
            >
              <Select
                placeholder="Neuve"
                // defaultValue="NEUVE"
                size="large"
                style={{
                  width: "100%",
                }}
              >
                <Select.Option value="NEUVE">NEUVE</Select.Option>
                <Select.Option value="RENOVATION">RENOVATION</Select.Option>
                <Select.Option value="EXTENSION">EXTENSION</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default InfoComplementaire;
