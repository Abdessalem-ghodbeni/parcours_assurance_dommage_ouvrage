import React from "react";
import classes from "./GarantieObligatoire.module.css";
import checkbox from "../../assets/checkbox.png";
import canceledbox from "../../assets/canceledbox.png";
import { Progress } from "antd";
import { red, green } from "@ant-design/colors";
function GarantieObligatoire(props) {
  const { title, desc, value, classe_risque } = props;
  if (value !== undefined) {
    return (
      <div>
        <div className={classes.singleWaranty}>
          <img
            src={classe_risque !== 8 ? checkbox : canceledbox}
            alt="check box"
            height={25}
            width={25}
          />
          <div className={classes.warantyTextContainer}>
            <div>
              <h4 className={classes.warantyTitle}>{title}</h4>
              <p className={classes.warantyText}>{desc}</p>
            </div>
            <p className={classes.price} style={{ marginRight: "0.5rem" }}>
              {" "}
              {value + "€"}
            </p>{" "}
            {classe_risque !== 8 && classe_risque !== null && classe_risque !== 12? (
              <Progress
                type="circle"
                width={50}
                percent={(Number(classe_risque) / 7) * 100}
                format={() =>
                  Number(classe_risque) !== 12 ? Number(classe_risque) : "X"
                }
                strokeColor={[red[4]]}
                status={Number(classe_risque) == 12 ? "exception" : ""}
              />
            ) : (
              <Progress
                style={{visibility:"hidden"}}
                type="circle"
                width={50}
                percent={100}
                status="exception"
                format={() => "X"}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={classes.singleWaranty}>
          <img src={checkbox} alt="check box" />
          <div className={classes.warantyTextContainer}>
            <div>
              <h4 className={classes.warantyTitle}>{title}</h4>
              <p className={classes.warantyText}>{desc}</p>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GarantieObligatoire;
