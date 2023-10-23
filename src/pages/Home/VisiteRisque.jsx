import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./VisiteRisque.css";
import axios from "axios";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import { Button, Spin } from "antd";
import NotFound from "../../components/NotFound/NotFound";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
  standardFontDataUrl: "standard_fonts/",
};

function VisiteRisque() {
  const [numPages, setNumPages] = useState(null);
  const [file, setFile] = useState("");
  const [firstPage, setFirstPage] = useState({});
  const [loader, setLoader] = useState(false);
  const [existance, setExistance] = useState(true);
  const [loadsuccess, setLoadsuccess] = useState(true);
  var editique_data = {};
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    setLoadsuccess(false);
  }

  const key = new URLSearchParams(window.location.search).get("Vdr_sk");

  // useEffect(() => {
  //   const URL = import.meta.env.VITE_API_URL_AS;

  //   axios
  //     .get(`${URL}/session_url/get_object_from_session_url/${key}`)
  //     .then((res) => {
  //       if (res.data?.url && !res.data.open) {
  //         setFile(res.data?.url);
  //         setFirstPage(res.data?.data);
  //       } else {
  //         setExistance(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // HANDLE PRINT
  // const print = async () => {
  //   const URL = import.meta.env.VITE_API_URL_AS;
  //   const URL_EDITIQUE = import.meta.env.VITE_API_EDITIQUE_URL;

  //   setLoader(true);

  //   let multiple_radio_order = {
  //     Couverture_tuile: 0,
  //     Couverture_terrasse: 1,
  //     Couverture_autre_type: 2,
  //     Nature_planchers_Maçonnerie: 0,
  //     Nature_planchers_Acier: 1,
  //     Nature_planchers_Bois: 2,
  //     Nature_planchers_autres: 3,
  //     Nature_planchers_étage_maconnage: 0,
  //     Nature_planchers_étage_acier: 1,
  //     Nature_planchers_étage_Bois: 2,
  //     Nature_planchers_étage_autre_type:3,
  //     Qualité_assuré_propriétaire: 0,
  //     Qualité_assuré_occupant: 1,
  //     Qualité_assuré_Copropriétaire: 2,
  //   };
  //   if (
  //     firstPage?.code_naf.search('562') != -1 ||
  //     firstPage?.code_naf.search('561') != -1 ||
  //     firstPage?.code_naf.search('551') != -1 ||
  //     firstPage?.code_naf.search('552') != -1
  //   ) {
  //     var model_ids = model_resto_ids;
  //   } else {
  //     var model_ids = model_general_ids;
  //   }
  //   var fill_data = new Promise((resolve, reject) => {
  //     Object.keys(model_ids).forEach((key, index) => {
  //       if (model_ids[key].search('Check') != -1) {
  //         editique_data[key] =
  //           document?.getElementsByName(model_ids[key])[0]?.value == 'Oui'
  //             ? 'True'
  //             : 'False';
  //       } else if (
  //         model_ids[key].search('Group') != -1 ||
  //         model_ids[key].search('groupe') != -1
  //       ) {
  //         if (key.search('oui') != -1) {
  //           editique_data[key] = document?.getElementsByName(model_ids[key])[0]
  //             ?.checked
  //             ? 'True'
  //             : 'False';
  //         } else if (key.search('non') != -1) {
  //           editique_data[key] = document?.getElementsByName(model_ids[key])[1]
  //             ?.checked
  //             ? 'True'
  //             : 'False';
  //         } else {
  //           for (
  //             let i = 0;
  //             i < document?.getElementsByName(model_ids[key]).length;
  //             i++
  //           ) {
  //             if (multiple_radio_order[key] == i) {
  //               editique_data[key] = document?.getElementsByName(
  //                 model_ids[key]
  //               )[i]?.checked
  //                 ? 'True'
  //                 : 'False';
  //             }
  //           }
  //         }
  //       } else {
  //         editique_data[key] = document?.getElementsByName(
  //           model_ids[key]
  //         )[0]?.value;
  //       }
  //       if (index == Object.keys(model_ids).length - 1) {
  //         resolve();
  //       }
  //     });
  //   });
  //   fill_data.then(() => {
  //     Object.keys(firstPage).forEach((key) => {
  //       if(key != "code_naf" ){
  //         editique_data[key] = firstPage[key];
  //       }else{
  //         editique_data[key] = firstPage["code_naf_secondaire"];
  //       }
  //     });
  //     if (
  //       firstPage?.code_naf.search('562') != -1 ||
  //       firstPage?.code_naf.search('561') != -1 ||
  //       firstPage?.code_naf.search('551') != -1 ||
  //       firstPage?.code_naf.search('552') != -1
  //     ) {
  //       const ID_resto = import.meta.env.VITE_API_VR_RESTO_ID;
  //       var data = JSON.stringify({
  //         idModel: ID_resto,
  //         data: editique_data,
  //       });
  //     } else {
  //       console.log('general');

  //       const ID = import.meta.env.VITE_API_VR_ID;
  //       var data = JSON.stringify({
  //         idModel: ID,
  //         data: editique_data,
  //       });
  //     }
  //     var config = {
  //       method: 'post',
  //       url: URL_EDITIQUE + '/editique_pdf/',
  //       headers: {
  //         apiKey: 'tAnXRlDgUXniOw',
  //         'Content-Type': 'application/json',
  //       },
  //       data: data,
  //     };
  //     const url_geoprod = import.meta.env.VITE_API_GEOPROD_URL;

  //     axios
  //       .post(
  //         `${url_geoprod}login`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer 2a0ba616-dc38-18f-ff0-e5207c45a808`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         axios(config)
  //           .then(async (response) => {
  //             const vr_file = await fetch(response.data.file_url);
  //             const blob = await vr_file.blob();

  //             let visite_de_risque_file = new FormData();
  //             visite_de_risque_file.append('file[]', blob, 'VR.pdf');
  //             visite_de_risque_file.append('id_type_doc', '139');
  //             visite_de_risque_file.append('id_affaire', firstPage.id_affaire);
  //             visite_de_risque_file.append('name_doc', 'VR');
  //             setLoader(false);
  //             axios
  //               .post(
  //                 `${url_geoprod}upload_document_affaire`,
  //                 visite_de_risque_file,
  //                 {
  //                   headers: {
  //                     idSession: res.data.Acces_Token,
  //                   },
  //                 }
  //               )
  //               .then((res) => {
  //                   setLoader(false);
  //                   window.open(response.data.file_url)
  //                 /* var config = {
  //                   method: "post",
  //                   url: URL + "/taux_fidelidade/close_visite_de_risque/" + key,
  //                   headers: {},
  //                 };

  //                 axios(config)
  //                   .then(function (res) {
  //                     setLoader(false);
  //                     window.location = response.data.file_url
  //                   })
  //                   .catch(function (error) {
  //                     console.log(error);
  //                   }); */
  //               });
  //           })
  //           .catch(function (error) {
  //             console.log(error);
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });
  // };

  if (!existance) {
    return <NotFound />;
  }
  if (key) {
    return (
      <div className="Example">
        <div className="Example__container">
          <div className="Example__container__document">
            {loadsuccess && (
              <div className="loaderContainer">
                <h2 style={{ color: "white" }}>
                  Veuillez patienter un instant
                </h2>
                <CustomLoader />
              </div>
            )}
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
              {loader ? (
                <Spin size="large" />
              ) : (
                <Button
                  block
                  // HANDLE PRINT
                  //  onClick={print}
                  className="button"
                >
                  Confirmer
                </Button>
              )}
            </Document>
          </div>
        </div>
      </div>
    );
  } else {
    return <NotFound />;
  }
}

export default VisiteRisque;
