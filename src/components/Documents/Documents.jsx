import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, Col, Row, Form, Input, InputNumber } from "antd";
import { useContext, useState } from "react";
import classes from "./Documents.module.css";
import { FormHeader } from "../FormHeader/FormHeader";
import GlobalContext from "../../contexts/GlobalContext";

function Documents(props) {
  const { prev, form } = props;
  const { docs, setDocs } = useContext(GlobalContext);

  const [fileList, setFileList] = useState({
    PLAN: docs["PLAN"],
    DEVIS: docs["DEVIS"],
    DECENAL: docs["DECENAL"],
    ETUDE: docs["ETUDE"],
  });
  const validateFraisDossier = (_, value) => {
    if (!value) {
      return Promise.reject("Veuillez choisir les frais du dossier.");
    }
    if (value < 50 || value > 250) {
      return Promise.reject(
        "Les frais du dossier doivent être compris entre 50 et 250."
      );
    }
    return Promise.resolve();
  };
  const handleChange1 = (info, type) => {
    switch (info.file.status) {
      case "uploading":
        type === "PLAN"
          ? setDocs({ ...docs, PLAN: [info.file] })
          : type === "DEVIS"
          ? setDocs({ ...docs, DEVIS: [info.file] })
          : type === "DECENAL"
          ? setDocs({ ...docs, DECENAL: [info.file] })
          : setDocs({ ...docs, ETUDE: [info.file] });

        type === "PLAN"
          ? setFileList({ ...docs, PLAN: [info.file] })
          : type === "DEVIS"
          ? setFileList({ ...docs, DEVIS: [info.file] })
          : type === "DECENAL"
          ? setFileList({ ...docs, DECENAL: [info.file] })
          : setFileList({ ...docs, ETUDE: [info.file] });

        break;
      case "done":
        type === "PLAN"
          ? setDocs({ ...docs, PLAN: [info.file] })
          : type === "DEVIS"
          ? setDocs({ ...docs, DEVIS: [info.file] })
          : type === "DECENAL"
          ? setDocs({ ...docs, DECENAL: [info.file] })
          : setDocs({ ...docs, ETUDE: [info.file] });

        type === "PLAN"
          ? setFileList({ ...docs, PLAN: [info.file] })
          : type === "DEVIS"
          ? setFileList({ ...docs, DEVIS: [info.file] })
          : type === "DECENAL"
          ? setFileList({ ...docs, DECENAL: [info.file] })
          : setFileList({ ...docs, ETUDE: [info.file] });
        break;

      default:
        // error or removed document
        type === "PLAN"
          ? setDocs({ ...docs, PLAN: [] })
          : type === "DEVIS"
          ? setDocs({ ...docs, DEVIS: [] })
          : type === "DECENAL"
          ? setDocs({ ...docs, DECENAL: [] })
          : setDocs({ ...docs, ETUDE: [] });

        type === "PLAN"
          ? setFileList({ ...docs, PLAN: [] })
          : type === "DEVIS"
          ? setFileList({ ...docs, DEVIS: [] })
          : type === "DECENAL"
          ? setFileList({ ...docs, DECENAL: [] })
          : setFileList({ ...docs, ETUDE: [] });
        form.setFieldsValue({
          ...form.getFieldsValue(),
          [type]: undefined,
        });
        break;
    }
  };

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  return (
    <div>
      <FormHeader title="Documents" number="3" prev={prev} />
      <div className={classes.container}>
        <Row
          gutter={24}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "2rem",
          }}
        >
          <Col lg={12} md={12} xs={24} className={classes.darkBlock}>
            <div style={{ padding: "0 3rem" }}>
              <div className={classes.cardLabel}>
                <div>
                  Frais de dossier <span style={{ color: "#E00000" }}>*</span>
                </div>
              </div>
              <Form.Item
                name="frais_dossier"
                rules={[
                  {
                    required: true,
                    message: "frais de dossier est obligatoire",
                  },
                  { validator: validateFraisDossier },
                ]}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  type="number"
                  addonAfter={
                    <span style={{ fontSize: "0.94vw", fontWeight: "600" }}>
                      €
                    </span>
                  }
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={24} className={classes.displayFlex}>
          {Object.keys(fileList).map((type, index) => {
            return (
              <Col
                lg={7}
                md={12}
                xs={24}
                className={classes.centerItems}
                key={index}
              >
                <Form.Item
                  name={type}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez remplir ce champ",
                    },
                  ]}
                >
                  <Upload
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      handleChange1(e, type);
                    }}
                    fileList={fileList[type]}
                    customRequest={dummyRequest}
                    accept="image/png, image/jpeg, application/pdf"
                  >
                    <Button
                      icon={<UploadOutlined />}
                      size="large"
                      className={classes.btnUpload}
                    >
                      {type === "PLAN"
                        ? " importer ''Plan''"
                        : type === "DEVIS"
                        ? " importer ''Devis''"
                        : type === "DECENAL"
                        ? " importer ''Attestation Décennale''"
                        : " importer ''Etude''"}
                      <span style={{ color: "#E00000" }}>*</span>
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            );
          })}
          <Col lg={7} md={12} xs={24} className={classes.centerItems}></Col>
          <Col lg={7} md={12} xs={24} className={classes.centerItems}></Col>
        </Row>
      </div>
    </div>
  );
}

export default Documents;
