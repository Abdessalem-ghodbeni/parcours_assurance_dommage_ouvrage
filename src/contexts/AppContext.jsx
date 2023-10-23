import dayjs from "dayjs";
import { useState, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import { message } from "antd";

const AppContext = (props) => {
  // const [activities, setActivities] = useState([]);
  // const [activitiesSecondaire, setActivitiesSecondaire] = useState([]);
  const [value, setValue] = useState("Propriétaire Occupant");
  const [selectedDate, setSelectedDate] = useState(false);
  const [globalData, setGlobalData] = useState(
    JSON.parse(sessionStorage.getItem("globalData")) || {
      franchise: 400,
      commission: 15,
      promises: {},
      frais_dossier: 50,
      date_effet: dayjs().add(3, "day"),
      QUALITE_OCCUPANT_2: "Propriétaire Occupant",
      NUM_SIRET_1: "",
      // piscine_choice: "oui",

      // Type_construction: "NEUVE",
      // Destination: "VENTE",
    }
  );
  const [docs, setDocs] = useState({
    PLAN: [],
    DEVIS: [],
    DECENAL: [],
    ETUDE: [],
  });

  // Get the current URL
  const url = new URL(window.location.href);

  // Get the query parameters
  const searchParams = new URLSearchParams(url.search);

  // const { organisme } = useParams();
  const organisme = searchParams?.get("id_gamme")?.split("/")[0];
  const partnership_id = searchParams
    ?.get("id_gamme")
    ?.split("/")[1]
    ?.split("=")[1];

  useEffect(() => {
    if (window.location.pathname === "/") {
      if (
        (organisme === import.meta.env.VITE_API_MAISON_INDIVIDUELLE ||
          organisme === import.meta.env.VITE_API_TRAVAUX ||
          organisme === import.meta.env.VITE_API_PROMOTION) &&
        partnership_id
      ) {
        message.success("Bienvenue dans le parcours DOMMAGE OUVRAGE ATRIAS");
      } else {
        window.location = `${import.meta.env.VITE_API_PRCOURS_URL}not-found`;
      }
    }
  }, [organisme, partnership_id]);
  useEffect(() => {
    sessionStorage.setItem("globalData", JSON.stringify(globalData));
  }, [globalData]);

  useEffect(() => {
    localStorage.setItem("type", "DO");
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        globalData,
        docs,
        selectedDate,
        setSelectedDate,
        setDocs,
        setGlobalData,
        // activities,
        // setActivities,
        // activitiesSecondaire,
        value,
        setValue,
        // setActivitiesSecondaire,
        organisme,
        partnership_id,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
