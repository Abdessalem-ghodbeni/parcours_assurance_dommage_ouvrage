import { Affix, message, Radio, Row, Skeleton, Spin } from "antd";
import axios from "axios";

import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/GlobalContext";
import { FormHeader } from "../FormHeader/FormHeader";
import SliderComponent from "../SliderComponent/SliderComponent";
import classes from "./Tarifications.module.css";

// const garanties_description = {
//   Incendie:
//     "Dommagés aux biens meubles et immeubles (dont les espèces, titres, valeurs, billets et monnaies) liés à l'incendie, au dommage de fumée, la fumée sans incendie, la foudre, l'implosion et l'explosion",
//   TGNA: "Dommagés aux biens meubles et immeubles (dont les espèces, titres, valeurs, billets et monnaies) liés à l'incendie, au dommage de fumée, la fumée sans incendie, la foudre, l'implosion et l'explosion",
//   CatNat:
//     "Dommagés aux biens meubles et immeubles (dont les espèces, titres, valeurs, billets et monnaies) liés à l'incendie, au dommage de fumée, la fumée sans incendie, la foudre, l'implosion et l'explosion",
//   "Garantie DDE":
//     "Dommagés aux biens meubles et immeubles (dont les espèces, titres, valeurs, billets et monnaies) liés à l'incendie, au dommage de fumée, la fumée sans incendie, la foudre, l'implosion et l'explosion",
//   "Garantie BdG":
//     "Bris de biens (vitrines, enseignes, plaques, etc), marchandise détériorée par le bris de produits et aménagements en verre, vol de marchandises exposées dans les vitrines suite à leur bris, frais de clotûre et de gardiennage",
//   "RC exploitation":
//     "Couvre les dommages causés à des tiers lors de l'exploitation de votre entreprise ou de votre activité professionnelle",
//   "RC professionnelle":
//     "Couvre les dommages causés à des tiers lors de l'exploitation de votre entreprise ou de votre activité professionnelle",
//   "Garantie Assistance":
//     "Cette garantie vous offre une aide 24 heures sur 24, 7 jours sur 7 en cas de besoin, tels que la remorquage de votre véhicule, l'hébergement en cas d'urgence, etc.",
//   "PE suite à incendie ou DDE":
//     "Cette garantie vous indemnise pour les pertes financières causées par les dommages subis par votre entreprise en raison d'un incendie ou de dommages d'eau.",
//   "PE suite à Vol ou Vandalisme":
//     "Elle couvre les pertes financières résultant de dommages causés à votre entreprise en raison d'un vol ou d'un acte de vandalisme.",
//   "Perte de Valeur du Fonds":
//     "Cette assurance vous indemnise pour la perte de valeur de votre fonds de commerce en cas de dommages subis par votre entreprise.",
//   "Garantie Vol":
//     "Vol, tentative de vol, vandalisme sur les biens mobiliers assurés et garantis (dont espèces, titres, valeurs, billets et monnaies), détériorations immobilières et coût du remplacement des serrures",
//   "Marchandises en Frigo":
//     "Perte des marchandises en installation frigorifiques dont frais annexes de sauvetage.",
//   "Garantie Bris de Machines":
//     "Bris de machines, matériaux et équipements informatiques ainsi que les frais annexes de reconstituion d'archives",

//   "Dommages électriques":
//     "Dommages à l'installation électrique des bâtiments assurés, aux appareils électriques, électroniques et informatiques (et accessoires) contenus dans les bâtiments assurés.",
//   "Extension extérieurs":
//     "Dommages au terrain, voies d'accès, parkings, clôtures, haies végétales et arbres (dont dessouchage, tronçonnage et évacuation)",
//   "Protection juridique":
//     "Elle couvre les coûts liés à un litige découlant de votre activité professionnelle ou de votre entreprise, tels que les frais de justice et les frais de défense.",
//   "Marchandises matériels transportés":
//     "Dommage ou vol aux marchandises et instruments professionnels (dont salons, foires et manifestations).",
// };
const marksFranchise = {
  300: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>150€</strong>,
  },
  800: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>300€</strong>,
  },
  1300: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>400€</strong>,
  },
  2000: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>450€</strong>,
  },
  3000: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>1000€</strong>,
  },
  4000: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>3000€</strong>,
  },
  5000: {
    style: {
      color: "#E30613be",
      marginTop: "10px",
    },
    label: <strong>5000€</strong>,
  },
};

function Tarifications(props) {
  const { prev, garantieOptions, form, setDisabled, disabled } = props;
  const { globalData } = useContext(GlobalContext);
  const [garanties_obligatoires, setGaranties_obligatoires] = useState([]);
  const [garanties_facultatives, setGaranties_facultatives] = useState([]);
  const [offre, setOffre] = React.useState("prime_commerciale_ttc");
  const [prime_commerciale_ttc, setPrime_commerciale_ttc] = useState({
    prime_commerciale_ttc: 0,
    prime_commerciale_ttc_mensuel: 12,
  });
  const [garantiesloader, setGarantiesloader] = useState(true);
  const [primeloader, setPrimeloader] = useState(true);
  const [loadersArray, setLoadersArray] = useState([]);

  const onChangeOffre = ({ target: { value } }) => {
    setOffre(value);
  };

  const convertFranchise = (franchise) => {
    switch (franchise) {
      case 500:
        return 500;
      case 1000:
        return 1000;
      case 1500:
        return 1500;
      case 2000:
        return 2000;
      case 2500:
        return 2500;
      default:
        return 500;
    }
  };

  return (
    <div className={classes.container}>
      <FormHeader title="Tarifications" number="3" prev={prev} />

      <div className={classes.container}>
        <div className={classes.headerBlock}>
          <div className={classes.primaryTitle}>Franchise</div>
          <label>
            Un montant minimum à payer en cas de sinistre couvert par votre
            assurance, qui est déduit de l'indemnité versée par l'assureur.
          </label>
          <div className={classes.sliderContainer}>
            <SliderComponent
              marks={marksFranchise}
              defValue={convertFranchise(globalData.franchise)}
              max={2500}
              min={500}
              fieldName="franchise"
            />
          </div>
        </div>
        <div className={classes.darkBlock} style={{ marginTop: "2rem" }}>
          <Radio.Group
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Radio value="Fractionnement par Mois">
              Fractionnement par Mois
            </Radio>
            <Radio value="Fractionnement par Trimestre">
              Fractionnement par Trimestre
            </Radio>
            <Radio value="Fractionnement par Semestre">
              Fractionnement par Semestre
            </Radio>
            <Radio value="Fractionnement par An">Fractionnement par An</Radio>
          </Radio.Group>
        </div>
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
              <Form.Item>
                <Input size="large" />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Tarifications;
