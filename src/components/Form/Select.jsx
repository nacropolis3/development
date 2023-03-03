import React, { useState } from "react";

import SelectR from "react-select";

export const Select = ({options, value}) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  return (
    <>
      <SelectR
        className="basic-single"
        classNamePrefix="select"
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={false}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name="color"
         options={[
            {
                label: "22",
                vaue: "sss"
            }
         ]}
      />
    </>
  );
};
