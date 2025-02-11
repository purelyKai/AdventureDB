import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Field {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
}

interface CRUDTableProps {
  title: string;
  endpoint: string;
  fields: Field[];
}

const CRUDTable: React.FC<CRUDTableProps> = ({ title, endpoint, fields }) => {
  return (
    <>
      <div>
        {title}
        {endpoint}
      </div>
    </>
  );
};

export default CRUDTable;
