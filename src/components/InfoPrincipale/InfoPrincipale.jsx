import classes from "./InfoPrincipale.module.css";
import Souscripteur from "../../assets/souscripteur.png";
import dayjs from "dayjs";
import { Form, Input, Col, Row, Select, DatePicker } from "antd";
import { FormHeader } from "../FormHeader/FormHeader";
import SectionHeader from "./SectionHeader/SectionHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { PhoneOutlined } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/fr";

const { Search } = Input;

function InfoPrincipale(props) {
  const { globalData, setGlobalData, selectedDate, setSelectedDate } =
    useContext(GlobalContext);
  const { form } = props;
  const [disabled, setDisabled] = useState(false);
  const [_villes, set_Villse] = useState([]);
  const [disabledDate, setDisabledDate] = useState(null);
  const [storage, setStorage] = useState("");
  const [checked, setChecked] = useState(
    form.getFieldsValue(true).validation_sinister || false
  );

  const URL_MRP = import.meta.env.VITE_API_URL_AS;
  const [valide, setValide] = useState(true);
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  const validatePhoneNumber = (_, value) => {
    if (value === "123456789" || value === "0000000000") {
      return Promise.reject("Veuillez vérifier ce champ");
    }

    return Promise.resolve();
  };
  const get_villes_by_code_postal = (code_postal, name) => {
    if (code_postal.length > 4) {
      const URL = import.meta.env.VITE_API_URL_AS;
      let ville_names = [];

      axios
        .post(`${URL}/groupe_villes/get_villes_by_code_postal`, {
          postal_code: code_postal,
        })
        .then((res) => {
          if (res.data == "list index out of range") {
            set_Villse([]);

            form.setFieldsValue({
              ...form.getFieldsValue(),
              _ville: "",
            });
          } else {
            res.data.villes.forEach((ville) => {
              let new_ville = {
                value: ville?.nom_comm,
                label: ville?.nom_comm,
              };
              if (!ville_names.find((val) => val.label == ville?.nom_comm)) {
                ville_names.push(new_ville);
              }
            });
            set_Villse(ville_names);
            form.setFieldsValue({
              ...form.getFieldsValue(),
              _ville: ville_names[0]?.value,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  let today = new Date().toISOString().split("T")[0];
  const isDateDisabled = (date) => {
    return date > currentDate;
  };

  const getYearsGraterThan = () => {
    var cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 18);
    return cutoffDate.toISOString().split("T")[0];
  };
  const isDateValid = (date) => {
    const currentDate = new Date();
    const minimumAgeDate = new Date();
    minimumAgeDate.setFullYear(minimumAgeDate.getFullYear() - 18);
    return date <= minimumAgeDate.toISOString().split("T")[0];
  };
  // function formatDate(date) {
  //   const year = date.getFullYear();
  //   let month = (date.getMonth() + 1).toString();
  //   let day = date.getDate().toString();

  //   if (month.length === 1) {
  //     month = "0" + month;
  //   }
  //   if (day.length === 1) {
  //     day = "0" + day;
  //   }

  //   return `${year}-${month}-${day}`;
  // }

  const fillInputs = (res) => {
    let code_naf =
      res.data.unite_legale.activite_principale.split(".")[0] +
      res.data.unite_legale.activite_principale.split(".")[1];

    const data = {
      raison_sociale: res.data.unite_legale.denomination,
      code_naf: code_naf,
      code_postal: res.data.unite_legale.etablissement_siege.code_postal,
      adresse_siege:
        res.data.unite_legale.etablissement_siege?.numero_voie +
        " " +
        res.data.unite_legale.etablissement_siege?.type_voie +
        " " +
        res.data.unite_legale.etablissement_siege?.libelle_voie +
        " " +
        res.data.unite_legale.etablissement_siege?.code_postal +
        " " +
        res.data.unite_legale.etablissement_siege?.libelle_commune,
      code_activite_principale: "",
      NUM_SIRET_1: res.data.unite_legale.etablissement_siege.siret,
    };

    sessionStorage.setItem(
      "siret",
      res.data.unite_legale.etablissement_siege.siret
    );
    form.setFieldsValue({ ...form.getFieldsValue(), ...data });
    get_code_activities(code_naf);
    setGlobalData({
      ...globalData,
      ...data,
      NUM_SIRET_1: res.data.unite_legale.etablissement_siege.siret,
    });
    // ACTITIES CODES
    // get_code_activities(code_naf);

    getVilles({
      target: {
        value: res.data.unite_legale.etablissement_siege.code_postal,
      },
    });
    setDisabled(false);
  };

  const onSearch = (value) => {
    setDisabled(true);
    const URL = import.meta.env.VITE_API_URL_SIREN + value;
    console.log("hello");
    axios
      .get(URL)
      .then((res) => {
        fillInputs(res);
      })
      .catch((err) => {
        if (err?.response?.data?.message !== "Invalid data") {
          const URL_NEO = import.meta.env.VITE_API_NEO_URL_SIREN + value;
          axios
            .get(URL_NEO)
            .then((res) => {
              fillInputs(res);
              setDisabled(false);
            })
            .catch((err) => {
              message.error("Vérifiez le siren que vous avez saisie !");
              setDisabled(false);
            });
        } else {
          message.error(
            err.response.data.message === "Invalid data"
              ? "Vérifiez le siren que vous avez saisie !"
              : err.response.data.message
          );
          setDisabled(false);
        }
      });
  };

  return (
    <div>
      <FormHeader title="Informations principales" number="1" />
      <div className={classes.formContainer}>
        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <SectionHeader icon={Souscripteur} title={"Souscripteur"} />
          </Col>
        </Row>

        <Row gutter={24} className={classes.rowContainer}>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Veuillez choisir la  civilité.",
                },
              ]}
              label={<label className={classes.label}>Civilité</label>}
              name="Civilite_Souscripteur"
            >
              <Select size="large">
                <Select.Option value="Mr">Mr</Select.Option>
                <Select.Option value="Mme">Mme</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="nom_Souscripteur"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le nom.",
                },
                {
                  pattern: new RegExp(
                    /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i
                  ),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Nom</label>}
            >
              <Input size="large" placeholder="Nom" />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="prenom_Souscripteur"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le prénom.",
                },

                {
                  pattern: new RegExp(
                    /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i
                  ),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Prénom</label>}
            >
              <Input size="large" placeholder="Prénom" />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Date de naissance</label>}
              name="date_naissaance_Souscripteur"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir la date de naissance",
                },
                {
                  validator: (_, value) => {
                    if (isDateValid(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error("L'utilisateur doit avoir au moins 18 ans.")
                      );
                    }
                  },
                },
              ]}
            >
              <Input
                type="date"
                placeholder="Exemple 01/01/1999"
                size="large"
                max={today}
                // max={getYearsGraterThan()}
                style={{ width: "100%", height: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              label={<label className={classes.label}>Adresse </label>}
              name="adresse_Souscripteur"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir l'adresse.",
                },
              ]}
            >
              <Input
                placeholder="Exemple : Bureau de Poste - 8 rue moliere"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="_code_postal_Souscripteur"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le code postale.",
                },
              ]}
              label={<label className={classes.label}>Code Postal</label>}
            >
              <Input
                placeholder=" Exemple: 75001"
                type="number"
                size="large"
                onBlur={(e) => {
                  get_villes_by_code_postal(
                    e.target.value,
                    "_code_postal_Souscripteur"
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le champ",
                },
              ]}
              name="_ville"
              label={<label className={classes.label}>Ville</label>}
            >
              <Select
                // placeholder="Paris 01"
                size="large"
                style={{
                  width: "100%",
                }}
                options={_villes}
              />
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="souscripteur_email"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir le champ",
                },
                {
                  pattern: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
                  message: "Veuillez verifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Email</label>}
            >
              <Input size="large" placeholder="Exemple@domaine.com" />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="Profession_Souscripteur"
              rules={[
                {
                  required: true,
                  message: "Veuillez remplir la Profession.",
                },
                {
                  pattern: new RegExp(
                    /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i
                  ),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Profession</label>}
            >
              <Input size="large" placeholder=" Exemple: Directeur" />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="fixe_souscripteur"
              rules={[
                {
                  pattern: new RegExp(/^(?!0+$|123456789$)(?!\d{11,})\d+$/),
                  message: "Veuillez vérifier ce champ",
                },
              ]}
              label={<label className={classes.label}>Téléphone fixe</label>}
            >
              <Input
                placeholder="Exemple: 12345678"
                type="number"
                size="large"
                onChange={(e) => {
                  form.setFieldsValue({
                    fixe_souscripteur: e.target.value.replace(/[^0-9 -]/g, ""),
                  });
                }}
                controls={false}
                addonAfter={<PhoneOutlined style={{ color: "#B5B5B5" }} />}
                prefix="+33"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col lg={7} md={12} xs={24}>
            <Form.Item
              name="phone_Souscripteur"
              rules={[
                {
                  pattern: new RegExp(/^(?!0+$|123456789$)(?!\d{11,})\d+$/),
                  message: "Veuillez vérifier ce champ",
                },
                {},
                {
                  required: true,
                  message: "Veuillez remplir le numéro de Téléphone",
                },
              ]}
              label={<label className={classes.label}>Téléphone</label>}
            >
              <Input
                placeholder="Exemple: 0612398745"
                maxLength="10"
                type="number"
                size="large"
                defaultValue={form.getFieldValue("phone_Souscripteur")}
                onChange={(e) => {
                  form.setFieldsValue({
                    phone_Souscripteur: e.target.value.replace(/[^0-9 -]/g, ""),
                  });
                  form.validateFields(["phone_Souscripteur"]);
                }}
                controls={false}
                addonAfter={<PhoneOutlined style={{ color: "#B5B5B5" }} />}
                prefix="+33"
                style={{ width: "100%" }}
              />{" "}
            </Form.Item>
          </Col>
          <Col lg={7} md={12} xs={24}></Col>
        </Row>
      </div>
    </div>
  );
}

export default InfoPrincipale;
