import ServiceTypes from "@redux/types/serviceTypes";
import styles from "@styles/pages/services/Services.module.css";
import { NextPage } from "next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  IService,
  PartCondition,
  PartType,
  ServiceType,
} from "src/types/service";

const Services: NextPage = () => {
  const [services, setServices] = useState<IService[]>([]);
  const dispatch = useDispatch();

  const [globalFilter, setGlobalFilter] = useState(null);

  // const services = useSelector(ServiceSelectors.getServices);

  const [editingRows, setEditingRows] = useState({});

  const [editingRows2, setEditingRows2] = useState({});

  const [expandedRows, setExpandedRows] = useState(null);

  useEffect(() => {
    dispatch({ type: ServiceTypes.READ_SERVICES });
    setLoading(false);
  }, [dispatch]);

  const [loading, setLoading] = useState(true);

  const toast = useRef(null);

  const servicesData: IService[] = [
    {
      id: "1",
      name: "oil change",
      description: "changes the engine oil",
      estimated_time: 5,
      total_price: "$100",
      parts: [
        {
          id: "0",
          quantity: 5,
          cost: 100,
          name: "nails",
          condition: PartCondition.NEW,
          build: PartType.OEM,
        },
      ],
      type: ServiceType.CANNED,
      shop_id: "1",
    },
    {
      id: "2",
      name: "oil change for fancy car",
      description: "changes the engine oil",
      estimated_time: 5,
      total_price: "$200",
      // parts_name: "nails",
      parts: [
        {
          id: "0",
          quantity: 5,
          cost: 100,
          name: "nails",
          condition: PartCondition.NEW,
          build: PartType.OEM,
        },
        {
          id: "1",
          quantity: 5,
          cost: 100,
          name: "nails2",
          condition: PartCondition.NEW,
          build: PartType.OEM,
        },
      ],
      type: ServiceType.CANNED,
      shop_id: "1",
    },
  ];

  const header = (
    <div className="table-header">
      <h3 className="mx-0 my-1">Basic Services</h3>
    </div>
  );

  const rowExpansionTemplate = (data) => {
    console.log(data);
    const parts = (data as IService).parts;
    return (
      <div className={styles.partsTable}>
        <h2>Parts</h2>
        <DataTable
          value={parts}
          responsiveLayout="scroll"
          size="small"
          dataKey="id"
          editMode="row"
          editingRows={editingRows}
          onRowEditComplete={onRowEditComplete}
        >
          <Column
            field="name"
            header="Name"
            editor={(options) => textEditor(options)}
            sortable
          ></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
          <Column
            field="cost"
            header="Cost Per Unit"
            editor={(options) => priceEditor(options)}
            sortable
          ></Column>
          <Column
            field="condition"
            header="Condition"
            editor={(options) => textEditor(options)}
          ></Column>
          <Column
            field="build"
            header="Type"
            editor={(options) => textEditor(options)}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            body={deleteService}
            exportable={false}
            style={{ minWidth: "4rem", textAlign: "center" }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  // Possibly do this for the condition/build
  const statuses = [
    { label: "In Stock", value: "INSTOCK" },
    { label: "Low Stock", value: "LOWSTOCK" },
    { label: "Out of Stock", value: "OUTOFSTOCK" },
  ];

  const statusEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  const priceEditor = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: { value: any }) => options.editorCallback(e.value)}
        mode="currency"
        currency="CAD"
        locale="en-US"
      />
    );
  };

  const allowExpansion = (rowData) => {
    return rowData.parts.length > 0;
  };

  const onRowEditComplete = (e: any) => {
    let _services = [...services];
    let { newData, index } = e;

    _services = [...services];
    [index] = newData;

    setServices(_services);
  };

  const deleteService = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger p-button-rounded"
          // call the delete saga pass in the id
          // onClick={() => deleteSaga(rowData)}
        />
      </React.Fragment>
    );
  };

  return (
    <div className={styles.serviceServicesContainer}>
      {/* Basic Services Table */}
      <Toast ref={toast} />
      <DataTable
        value={servicesData}
        paginator
        showGridlines
        rows={10}
        dataKey="id"
        size="small"
        // filters={filters}
        filterDisplay="menu"
        loading={loading}
        responsiveLayout="scroll"
        globalFilterFields={["name"]}
        header={header}
        rowExpansionTemplate={(e) => rowExpansionTemplate(e)}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        emptyMessage="No services found."
        editMode="row"
        editingRows={editingRows}
        onRowEditComplete={onRowEditComplete}
      >
        <Column expander={allowExpansion} style={{ width: "3em" }} />
        <Column
          field="name"
          header="Service Name"
          filter
          sortable
          filterPlaceholder="Search by service name"
          style={{ minWidth: "4rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="description"
          header="Description"
          style={{ minWidth: "8rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="estimated_time"
          header="Duration"
          style={{ minWidth: "4rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="total_price"
          header="Estimated Cost"
          editor={(options) => priceEditor(options)}
          sortable
          style={{ minWidth: "4rem" }}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: "4rem" }}
          bodyStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          body={deleteService}
          exportable={false}
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default Services;
