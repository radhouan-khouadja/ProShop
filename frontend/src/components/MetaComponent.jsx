import { Helmet } from "react-helmet";

import React from "react";

const MetaComponent = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

MetaComponent.defaultProps = {
  title: "welcome to proshop",
  keywords: "electronics,buy electronics",
  description: "we sell the best products",
};

export default MetaComponent;
