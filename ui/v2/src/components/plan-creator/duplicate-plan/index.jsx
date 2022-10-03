import React, { useState } from 'react';

import 'twin.macro';

import Cover from './Cover';
import TryAnother from './TryAnother';

const DuplicatePlan = () => {
  const [open, setOpen] = useState(false);
  return (
    <div tw="bg-mid-grey rounded-18 border-dashed border border-dark-grey text-center">
      {open ? <TryAnother setOpen={setOpen} /> : <Cover setOpen={setOpen} />}
    </div>
  );
};

DuplicatePlan.propTypes = {};

export default DuplicatePlan;
