import { useContext, useEffect, useState } from "react";
import LogoAsSolutions from "../../assets/Atrias.svg";
import classes from "./Home.module.css";
import {
  message,
  Steps,
  Form,
  FloatButton,
  ConfigProvider,
  Typography,
} from "antd";
import InfoPrincipale from "../../components/InfoPrincipale/InfoPrincipale";
import InfoComplementaire from "../../components/InfoComplementaire/InfoComplementaire";
import Documents from "../../components/Documents/Documents";
import GlobalContext from "../../contexts/GlobalContext";

import dayjs from "dayjs";
import { ClearOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import { useNavigate } from "react-router-dom";

function Home() {
  const {
    globalData,
    setGlobalData,
    organisme,
    partnership_id,
    docs,
    selectedDate,
  } = useContext(GlobalContext);
  const [current, setCurrent] = useState(
    JSON.parse(sessionStorage.getItem("current")) || 0
  );
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const Navigate = useNavigate();
  const geoprod_url = import.meta.env.VITE_API_GEOPROD_URL;
  const Souscription = () => {
    // console.log(globalData);
    form
      .validateFields()

      .then((promise) => {
        setLoading(true);
        const Dommage_ouvrage = {
          nom_Souscripteur: String(globalData?.nom_Souscripteur),
          prenom_Souscripteur: String(globalData?.prenom_Souscripteur),
          date_naissaance_Souscripteur: dayjs(
            String(globalData?.date_naissaance_Souscripteur)
          ).format("DD/MM/YYYY"),

          adresse_Souscripteur: String(globalData?.adresse_Souscripteur),
          souscripteur_email: String(globalData?.souscripteur_email),
          phone_Souscripteur: String(globalData?.phone_Souscripteur),
          vente: globalData?.Destination == "vente" ? "True" : "false",
          usage_propore:
            globalData?.Destination == "usage_propore" ? "True" : "false",
          locatif: globalData?.Destination == "locatif" ? "True" : "false",
          professionnel:
            globalData?.Destination == "professionnel" ? "True" : "false",
          Nombre_batiment: String(globalData?.Nombre_batiment),
          Nombre_etage: String(globalData?.Nombre_etage),
          Nombre_logement: String(globalData?.Nombre_logement),
          Surface_planche: String(globalData?.Surface_planche),
          oui: String(globalData?.piscine_choice == "oui" ? "True" : "false"),
          non: String(globalData?.piscine_choice == "non" ? "True" : "false"),
          garage_oui: String(
            globalData?.garage_choice == "oui" ? "True" : "false"
          ),
          garage_non: String(
            globalData?.garage_choice == "non" ? "True" : "false"
          ),
          date_ouverture_chantier_: dayjs(
            String(globalData?.date_ouverture_chantier)
          ).format("DD/MM/YYYY"),

          Cout_construction: String(globalData?.Cout_construction),
        };
        const questionnaire_dommage_ouvrage = {
          nom_phy: String(globalData?.nom_Souscripteur),
          prenom_phy: String(globalData?.prenom_Souscripteur),
          code_postal_phy: String(globalData?._code_postal_Souscripteur),
          ville_phy: String(globalData?._ville),
          date_naissance_phy: dayjs(
            String(globalData?.date_naissaance_Souscripteur)
          ).format("DD/MM/YYYY"),

          profession_phy: globalData?.Profession_Souscripteur,
          telephone_phy: String(globalData?.fixe_souscripteur),
          email_phy: String(globalData?.souscripteur_email),
          adresse_risque: String(globalData?.adresse_siege),
          construction_neuve_oui: globalData?.Type_construction,
          construction_neuve_non: !globalData?.Type_construction,
          nombre_batiments: String(globalData?.Nombre_batiment),
          nombre_longements: String(globalData?.Nombre_logement),
          surface_plancher: String(globalData?.Surface_planche),
          nombre_etages_rdc: String(globalData?.Nombre_etage),
          montant_travaux_corps: String(globalData?.Cout_construction),
          annee_construction: dayjs(
            String(globalData?.date_ouverture_chantier)
          ).format("DD/MM/YYYY"),
        };
        axios
          .post(
            `${URL_MRP}atrias/subscribe_atrias`,
            {
              type_prospect: "prospect particulier do",
              gamme: organisme,
              prospect_data: {
                nom: String(globalData?.nom_Souscripteur),
                prenom: String(globalData?.prenom_Souscripteur),
                ville: String(globalData?._ville),
                adresse_mail: String(globalData?.souscripteur_email),
                civilite: String(globalData?.Civilite_Souscripteur),
                codepostal: String(globalData?.code_postal),
                street_name: String(globalData?.adresse_Souscripteur),
                mobile: String(globalData?.phone_Souscripteur),
                date_effet: dayjs(
                  String(globalData?.date_ouverture_chantier)
                ).format("YYYY-MM-DD"),
                DN: dayjs(
                  String(globalData?.date_naissaance_Souscripteur)
                ).format("YYYY-MM-DD"),
              },
              objet_assure: {
                adresse_risque: String(globalData?.adresse_siege),
                complement_adresse: globalData?.complement_adresse || "",
                ville_risque: globalData?.ville,
                cout: String(globalData?.Cout_construction),
                idObject: "1",
                nbr_logement: String(globalData?.Nombre_logement),
                nbr_etage: String(globalData?.Nombre_etage),

                declaration: dayjs(
                  String(globalData?.date_ouverture_chantier)
                ).format("YYYY-MM-DD"),
                type_construction: globalData?.Type_construction || "",
                destination: globalData?.Destination || "",
                piscine: String(globalData?.piscine_choice || ""),
                garage: String(globalData?.garage_choice || ""),
                nombre_batiment: String(globalData?.Nombre_batiment),
                surface: String(globalData?.Surface_planche),
                pays: "1",
                code_post_risque: String(globalData?.code_postal),
              },
              data_fields:
                organisme == 7929
                  ? Dommage_ouvrage
                  : questionnaire_dommage_ouvrage,
            },
            {
              headers: {
                apiKey: partnership_id,
              },
            }
          )
          .then((response) => {
            if (response.data.id_affaire) {
              console.log(response.data.id_affaire);
              let config = {
                headers: {
                  Authorization: `Bearer ${partnership_id}`,
                },
              };
              axios.post(`${geoprod_url}login`, {}, config).then((res) => {
                let token = res.data.Acces_Token;
                const Etude = import.meta.env.VITE_API_ETUDE_ID;
                const Attestation_Decinnale = import.meta.env
                  .VITE_API_Attestation_Decinnale_ID;
                const Plan = import.meta.env.VITE_API_PLAN_ID;

                const Devis = import.meta.env.VITE_API_Devis_ID;
                var counter = 0;
                Object.keys(docs).forEach((doc, index) => {
                  if (docs[doc][0]?.originFileObj) {
                    const formfile = new FormData();
                    formfile.append(
                      "id_type_doc",
                      doc === "ETUDE"
                        ? Etude
                        : doc === "DECENAL"
                        ? Attestation_Decinnale
                        : doc === "PLAN"
                        ? Plan
                        : Devis
                    );
                    formfile.append("id_affaire", response.data.id_affaire);
                    formfile.append(
                      "file[]",
                      docs[doc][0]?.originFileObj,
                      docs[doc][0]?.name
                    );
                    axios
                      .post(geoprod_url + "upload_document_affaire", formfile, {
                        headers: {
                          idSession: token,
                        },
                      })
                      .then((res) => {
                        counter = counter + 1;
                        if (counter == 4) {
                          message.success("Action terminée avec succès !");
                          Navigate(
                            "/success/?id_gamme=" +
                              organisme +
                              "/?partnership_id=" +
                              partnership_id
                          );
                        }
                      })
                      .catch((err) => {
                        setLoading(false);
                        message.error("Something went very wrong !");
                        console.log(err);
                      });
                  } else {
                    counter = counter + 1;
                    if (counter == 4) {
                      Navigate(
                        "/success/?id_gamme=" +
                          organisme +
                          "/?partnership_id=" +
                          partnership_id
                      );
                    }
                  }
                });
              });
            } else {
              setLoading(false);
              message.error("ID AFFAIRE UNDEFINED!");
            }
            message.success("Action terminée avec succès !");
          })
          .catch((err) => {
            setLoading(false);
            message.error("Something went very wrong !");
          });
      })
      .catch((error) => {
        setLoading(false);
        message.error(error);
      });
  };

  useEffect(() => {
    form.setFieldsValue(
      JSON.parse(sessionStorage.getItem("globalData"))
        ? {
            ...JSON.parse(sessionStorage.getItem("globalData")),
            date_effet: JSON.parse(sessionStorage.getItem("globalData"))
              ?.date_effet
              ? dayjs(
                  JSON.parse(sessionStorage.getItem("globalData")).date_effet
                )
              : dayjs().add(3, "day"),
            date_naissaance_Souscripteur: JSON.parse(
              sessionStorage.getItem("globalData")
            )?.date_naissaance_Souscripteur
              ? dayjs(
                  JSON.parse(sessionStorage.getItem("globalData"))
                    .date_naissaance_Souscripteur
                )
              : "",
            date_ouverture_chantier: JSON.parse(
              sessionStorage.getItem("globalData")
            )?.date_ouverture_chantier
              ? dayjs(
                  JSON.parse(sessionStorage.getItem("globalData"))
                    .date_ouverture_chantier
                )
              : "",
            // ...JSON.parse(sessionStorage.getItem("garantieOptions")),
          }
        : {
            ...form.getFieldsValue(),
            surface_locaux: "",
            contenu_pro: "",
            frais_dossier: 50,
            // code_activite_secondaire: "",
            franchise: 400,
            date_effet: dayjs().add(3, "day"),

            // Fractionnement: "Mensuelle",
            // "Jour de prélèvement": 5,
          }
    );
  }, []);

  useEffect(() => {
    sessionStorage.setItem("current", JSON.stringify(current));

    if (current === 3) {
      setDisabled(false);
    }
  }, [current]);

  const next = () => {
    setGlobalData({ ...globalData, ...form.getFieldsValue() });
    console.log(form.getFieldsValue());
    console.log(globalData);
    setCurrent(current + 1);
  };

  const prev = () => {
    setGlobalData({ ...globalData, ...form.getFieldsValue() });
    setCurrent(current - 1);
  };

  const URL_MRP = import.meta.env.VITE_API_URL_AS;

  const steps = [
    {
      title: "Informations principales",
      content: <InfoPrincipale form={form} />,
    },
    {
      title: "Informations complémentaires",
      content: <InfoComplementaire prev={prev} form={form} />,
    },

    {
      title: "Documents",
      content: <Documents prev={prev} form={form} />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div style={{ paddingBottom: "5rem" }}>
      <div className={classes.header}>
        <div className={classes.headerText}>
          <Typography.Text style={{ color: "white" }}>
            DOMMAGE OUVRAGE
          </Typography.Text>
        </div>
        <div className={classes.topBar}>
          <img
            src={LogoAsSolutions}
            alt="logo AsSolutions"
            className={classes.logoStyle}
          />
        </div>
      </div>
      {loading && (
        <div className={classes.loaderContainer}>
          <h2 style={{ color: "white" }}>Veuillez patienter un instant</h2>

          <CustomLoader />
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinishFailed={() => {
          message.error("Vérifier tous les champs !");
        }}
        onFinish={() => {
          next();
        }}
        onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
        // onValuesChange={onChange}
        className={classes.stepperContainer}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#DB4537",
            },
            components: {
              Steps: {
                colorText: "#DB4537",
              },
            },
          }}
        >
          <Steps
            className={classes.stepper}
            current={current}
            onKeyDown={(e) => (e.keyCode == 13 ? e.preventDefault() : "")}
            items={items}
          />
        </ConfigProvider>

        <div className={classes.contentStyle}>{steps[current].content}</div>

        <div className={classes.holder}>
          <div className={classes.btnsHolder}>
            {current === steps.length - 1 && (
              <button
                type="button"
                className={classes.btnNext}
                onClick={() => {
                  Souscription();
                }}
              >
                Soumettre la souscription
              </button>
            )}
            {current > 0 && current < steps.length - 1 && (
              <button
                className={disabled ? classes.btnPrevDisabled : classes.btnPrev}
                disabled={disabled}
                type="button"
                onClick={() => prev()}
              >
                Retour
              </button>
            )}

            {current < steps.length - 1 && (
              <button
                className={disabled ? classes.btnPrevDisabled : classes.btnNext}
                // onClick={handleSubmit}
                type="submit"
                disabled={disabled}
              >
                Suivant
              </button>
            )}
          </div>
        </div>
      </Form>

      <FloatButton
        type="primary"
        icon={<ClearOutlined />}
        tooltip={<div>Remise à zero</div>}
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
      />
    </div>
  );
}

export default Home;
