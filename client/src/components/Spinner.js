import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

export const Spinner = () => {
  return (
    <div>
      <Dimmer active>
        <Loader size="massive">Please Wait</Loader>
      </Dimmer>
    </div>
  );
};

export default Spinner;
