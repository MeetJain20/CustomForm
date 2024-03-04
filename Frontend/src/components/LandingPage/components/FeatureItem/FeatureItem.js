import React from 'react';
import classes from "./FeatureItem.module.css";

const FeatureItem = ({ title, description, image, side }) => {
  return (
    side !== "switch" ? (
      <div className={classes.featurebody}>
        <div className={classes.mainfeatureimage}>
          <img
            src={image}
            alt="Loading"
            className={classes.featureimage}
          />
        </div>
        <div className={classes.featuredescription}>
          <div className={classes.featuretitle}>
            {title}
          </div>
          <div className={classes.featuredesc}>
            {description}
          </div>
        </div>
      </div>
    ) : (
      <div className={classes.featurebody1}>
        <div className={classes.featuredescription}>
          <div className={classes.featuretitle}>
            {title}
          </div>
          <div className={classes.featuredesc}>
            {description}
          </div>
        </div>
        <div className={classes.mainfeatureimage}>
          <img
            src={image}
            alt="Loading"
            className={classes.featureimage}
          />
        </div>
      </div>
    )
  );
};

export default FeatureItem;
